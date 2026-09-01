-- 게시판 + 케이스스터디 섹션 — 전체 리셋 스크립트
--
-- ⚠️ 파괴적입니다. 아래 테이블의 기존 데이터를 전부 지우고 새로 만듭니다.
--      public.guestbook          (방명록 글)
--      public.project_details    (케이스스터디 상세 섹션)
--
-- 실행 방법
--   1. 아래 STEP 0 의 '여기에_관리자_비밀번호' 를 실제 쓸 비밀번호로 바꾼다
--   2. Supabase 대시보드 > SQL Editor 에 이 파일 전체를 붙여넣고 Run
--
--   여러 번 실행해도 안전합니다(매번 초기화됨).
--
-- 이 스크립트가 고치는 것
--   * password_hash 가 anon 키로 그대로 읽히던 문제.
--     anon 키는 사이트 JS 번들에 실려 나가는 공개값이라 누구나 덤프할 수 있었습니다.
--     RLS 는 '행' 단위 필터라 컬럼 노출을 막지 못합니다. 컬럼 단위 GRANT 로 막습니다.
--   * 빈 비밀번호로 글이 만들어지던 문제. 4자 미만은 생성을 거부합니다.
--   * 해시 알고리즘을 bcrypt 로 통일합니다.
--
-- 설계 요지
--   읽기는 anon 에게 열되 password_hash 는 제외하고, 쓰기는 테이블 직접이 아니라
--   SECURITY DEFINER 함수를 통해서만 가능하게 합니다.
--   비밀번호 대조가 서버 안에서 끝나야 하기 때문입니다.

create extension if not exists pgcrypto with schema extensions;

begin;

-- ══════════════════════════════════════════════════════════════════
-- STEP 0 — 관리자 비밀번호
-- ══════════════════════════════════════════════════════════════════
-- 케이스스터디 섹션 추가·수정·삭제에 쓰는 단일 비밀번호입니다.
-- 👇 반드시 바꾸고 실행하세요.

create table if not exists public.app_secrets (
  key        text primary key,
  value_hash text not null,
  updated_at timestamptz not null default now()
);

alter table public.app_secrets enable row level security;
revoke all on public.app_secrets from anon, authenticated;
-- 정책을 하나도 만들지 않으므로 anon/authenticated 는 어떤 행도 볼 수 없습니다.

insert into public.app_secrets (key, value_hash)
values ('admin_password', extensions.crypt('여기에_관리자_비밀번호', extensions.gen_salt('bf')))
on conflict (key) do update
  set value_hash = excluded.value_hash, updated_at = now();

-- ══════════════════════════════════════════════════════════════════
-- STEP 1 — 기존 객체 제거
-- ══════════════════════════════════════════════════════════════════

drop function if exists public.guestbook_create_post(text, text, text, text);
drop function if exists public.guestbook_update_post(bigint, text, text);
drop function if exists public.guestbook_delete_post(bigint, text);
drop function if exists public.project_detail_create(text, text, text, text, integer, text);
drop function if exists public.project_detail_update(bigint, text, text, text, text);
drop function if exists public.project_detail_delete(bigint, text);
drop function if exists public.is_admin(text);

drop table if exists public.guestbook cascade;
drop table if exists public.project_details cascade;

-- ══════════════════════════════════════════════════════════════════
-- STEP 2 — 테이블
-- ══════════════════════════════════════════════════════════════════

create table public.guestbook (
  id            bigint generated always as identity primary key,
  author        text        not null check (length(trim(author)) between 1 and 40),
  content       text        not null check (length(trim(content)) between 1 and 2000),
  category      text        not null default 'Guestbook' check (category in ('Q&A', 'Guestbook')),
  password_hash text        not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index guestbook_created_at_idx on public.guestbook (created_at desc);

create table public.project_details (
  id            bigint generated always as identity primary key,
  slug          text        not null,
  section_title text        not null,
  content       text        not null,
  image_url     text,
  order_num     integer     not null default 1,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index project_details_slug_order_idx on public.project_details (slug, order_num);

-- ══════════════════════════════════════════════════════════════════
-- STEP 3 — 권한 (읽기는 열되 password_hash 는 제외)
-- ══════════════════════════════════════════════════════════════════

alter table public.guestbook       enable row level security;
alter table public.project_details enable row level security;

create policy "guestbook read"
  on public.guestbook for select to anon, authenticated using (true);
create policy "project_details read"
  on public.project_details for select to anon, authenticated using (true);

revoke all on public.guestbook       from anon, authenticated;
revoke all on public.project_details from anon, authenticated;

grant select (id, author, content, category, created_at, updated_at)
  on public.guestbook to anon, authenticated;
grant select (id, slug, section_title, content, image_url, order_num, created_at, updated_at)
  on public.project_details to anon, authenticated;

-- ══════════════════════════════════════════════════════════════════
-- STEP 4 — 방명록 함수
-- ══════════════════════════════════════════════════════════════════

create function public.guestbook_create_post(
  p_author   text,
  p_content  text,
  p_category text,
  p_password text
) returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  if length(trim(coalesce(p_author, ''))) = 0 then
    raise exception '이름을 입력해 주세요.';
  end if;
  if length(trim(coalesce(p_content, ''))) = 0 then
    raise exception '내용을 입력해 주세요.';
  end if;
  if length(coalesce(p_password, '')) < 4 then
    raise exception '비밀번호는 4자 이상이어야 합니다.';
  end if;
  if coalesce(p_category, '') not in ('Q&A', 'Guestbook') then
    raise exception '알 수 없는 분류입니다.';
  end if;

  insert into public.guestbook (author, content, category, password_hash)
  values (
    left(trim(p_author), 40),
    left(trim(p_content), 2000),
    p_category,
    extensions.crypt(p_password, extensions.gen_salt('bf'))
  );
end;
$$;

create function public.guestbook_update_post(
  p_id       bigint,
  p_password text,
  p_content  text
) returns boolean
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_hash text;
begin
  select password_hash into v_hash from public.guestbook where id = p_id;

  -- bcrypt 형식이 아니면 어떤 입력과도 일치시키지 않는다 (fail closed)
  if v_hash is null or left(v_hash, 1) <> '$' then
    return false;
  end if;
  if v_hash <> extensions.crypt(p_password, v_hash) then
    return false;
  end if;
  if length(trim(coalesce(p_content, ''))) = 0 then
    return false;
  end if;

  update public.guestbook
     set content = left(trim(p_content), 2000), updated_at = now()
   where id = p_id;
  return true;
end;
$$;

create function public.guestbook_delete_post(
  p_id       bigint,
  p_password text
) returns boolean
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_hash text;
begin
  select password_hash into v_hash from public.guestbook where id = p_id;

  if v_hash is null or left(v_hash, 1) <> '$' then
    return false;
  end if;
  if v_hash <> extensions.crypt(p_password, v_hash) then
    return false;
  end if;

  delete from public.guestbook where id = p_id;
  return true;
end;
$$;

-- ══════════════════════════════════════════════════════════════════
-- STEP 5 — 케이스스터디 섹션 함수 (관리자 비밀번호로 보호)
-- ══════════════════════════════════════════════════════════════════

create function public.is_admin(p_password text)
returns boolean
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_hash text;
begin
  select value_hash into v_hash from public.app_secrets where key = 'admin_password';
  return v_hash is not null and v_hash = extensions.crypt(p_password, v_hash);
end;
$$;

-- Postgres 는 함수 생성 시 EXECUTE 를 PUBLIC 에게 자동으로 부여한다.
-- anon/authenticated 만 회수하면 PUBLIC 경유 권한이 남아 그대로 호출된다.
-- 그러면 anon 키만으로 관리자 비밀번호를 무제한 대조할 수 있는 오라클이 된다.
-- project_detail_* 은 SECURITY DEFINER 라 소유자 권한으로 내부 호출하므로 영향 없다.
revoke all on function public.is_admin(text) from public, anon, authenticated;

create function public.project_detail_create(
  p_slug          text,
  p_section_title text,
  p_content       text,
  p_image_url     text,
  p_order_num     integer,
  p_password      text
) returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.is_admin(p_password) then
    raise exception '관리자 비밀번호가 올바르지 않습니다.';
  end if;

  insert into public.project_details (slug, section_title, content, image_url, order_num)
  values (
    p_slug,
    p_section_title,
    p_content,
    nullif(trim(coalesce(p_image_url, '')), ''),
    coalesce(p_order_num, 1)
  );
end;
$$;

create function public.project_detail_update(
  p_id            bigint,
  p_password      text,
  p_section_title text,
  p_content       text,
  p_image_url     text
) returns boolean
language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.is_admin(p_password) then
    return false;
  end if;

  update public.project_details
     set section_title = p_section_title,
         content       = p_content,
         image_url     = nullif(trim(coalesce(p_image_url, '')), ''),
         updated_at    = now()
   where id = p_id;

  return found;
end;
$$;

create function public.project_detail_delete(
  p_id       bigint,
  p_password text
) returns boolean
language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.is_admin(p_password) then
    return false;
  end if;

  delete from public.project_details where id = p_id;
  return found;
end;
$$;

-- ══════════════════════════════════════════════════════════════════
-- STEP 6 — 함수 실행 권한
-- ══════════════════════════════════════════════════════════════════

grant execute on function public.guestbook_create_post(text, text, text, text) to anon, authenticated;
grant execute on function public.guestbook_update_post(bigint, text, text)     to anon, authenticated;
grant execute on function public.guestbook_delete_post(bigint, text)           to anon, authenticated;
grant execute on function public.project_detail_create(text, text, text, text, integer, text) to anon, authenticated;
grant execute on function public.project_detail_update(bigint, text, text, text, text)        to anon, authenticated;
grant execute on function public.project_detail_delete(bigint, text)                          to anon, authenticated;

commit;

-- PostgREST 스키마 캐시 갱신 (없어도 몇 분 뒤 자동 반영됨)
notify pgrst, 'reload schema';
