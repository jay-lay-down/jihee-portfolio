-- 게시판 + 케이스스터디 섹션 스키마
--
-- ⚠️ 기존 프로젝트가 살아 있다면 실행하지 마세요.
--    GRANT/REVOKE 구문이 현재 권한 설정을 덮어씁니다.
--    이 파일은 (1) 스키마를 코드로 남겨두기 위한 기록이고,
--             (2) 프로젝트를 새로 만들어야 할 때 쓰는 복구용입니다.
--
-- 새 프로젝트에 적용할 때만 Supabase 대시보드 > SQL Editor 에 붙여넣어 실행하세요.
-- 여러 번 실행해도 안전하도록 작성했습니다.
--
-- 설계 요지
--   * 비밀번호는 평문으로 두지 않고 bcrypt 해시로만 저장합니다.
--   * 읽기는 anon 에게 열되, 컬럼 단위 GRANT 로 password_hash 는 아예 못 읽게 막습니다.
--     (RLS 는 행 단위라 컬럼 노출은 못 막습니다. 그래서 GRANT 를 함께 씁니다.)
--   * 쓰기는 테이블에 직접 못 하고 SECURITY DEFINER 함수를 통해서만 가능합니다.
--     비밀번호 대조가 서버 안에서 끝나야 하기 때문입니다.

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------- 방명록

create table if not exists public.guestbook (
  id            bigint generated always as identity primary key,
  author        text        not null check (length(trim(author)) between 1 and 40),
  content       text        not null check (length(trim(content)) between 1 and 2000),
  category      text        not null default 'Guestbook' check (category in ('Q&A', 'Guestbook')),
  password_hash text        not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists guestbook_created_at_idx on public.guestbook (created_at desc);

alter table public.guestbook enable row level security;

drop policy if exists "guestbook read" on public.guestbook;
create policy "guestbook read" on public.guestbook for select to anon, authenticated using (true);

-- 직접 쓰기 차단 + password_hash 컬럼은 읽기 대상에서 제외
revoke all on public.guestbook from anon, authenticated;
grant select (id, author, content, category, created_at, updated_at)
  on public.guestbook to anon, authenticated;

-- ------------------------------------------------- 케이스스터디 상세 섹션

create table if not exists public.project_details (
  id            bigint generated always as identity primary key,
  slug          text        not null,
  section_title text        not null,
  content       text        not null,
  image_url     text,
  order_num     integer     not null default 1,
  -- 운영 DB에 존재하는 컬럼. 읽기 GRANT에서 제외해 anon 에게 노출되지 않게 한다.
  password_hash text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists project_details_slug_order_idx
  on public.project_details (slug, order_num);

alter table public.project_details enable row level security;

drop policy if exists "project_details read" on public.project_details;
create policy "project_details read" on public.project_details for select to anon, authenticated using (true);

revoke all on public.project_details from anon, authenticated;
grant select (id, slug, section_title, content, image_url, order_num, created_at, updated_at)
  on public.project_details to anon, authenticated;

-- ------------------------------------------------------------ 관리자 비밀번호
-- 케이스스터디 섹션 편집에 쓰는 단일 관리자 비밀번호. anon 은 접근 불가.

create table if not exists public.app_secrets (
  key         text primary key,
  value_hash  text not null,
  updated_at  timestamptz not null default now()
);

alter table public.app_secrets enable row level security;
revoke all on public.app_secrets from anon, authenticated;
-- 정책을 하나도 만들지 않으므로 anon/authenticated 는 어떤 행도 볼 수 없습니다.

-- 관리자 비밀번호 설정 (아래 '여기에_관리자_비밀번호' 를 바꿔서 실행하세요)
insert into public.app_secrets (key, value_hash)
values ('admin_password', extensions.crypt('여기에_관리자_비밀번호', extensions.gen_salt('bf')))
on conflict (key) do nothing;

-- ------------------------------------------------------------------ 함수

create or replace function public.guestbook_create_post(
  p_author   text,
  p_content  text,
  p_category text,
  p_password text
) returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  if length(trim(coalesce(p_password, ''))) < 4 then
    raise exception '비밀번호는 4자 이상이어야 합니다.';
  end if;

  insert into public.guestbook (author, content, category, password_hash)
  values (trim(p_author), trim(p_content), p_category, extensions.crypt(p_password, extensions.gen_salt('bf')));
end;
$$;

create or replace function public.guestbook_update_post(
  p_id       bigint,
  p_password text,
  p_content  text
) returns boolean
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_hash text;
begin
  select password_hash into v_hash from public.guestbook where id = p_id;
  if v_hash is null or v_hash <> extensions.crypt(p_password, v_hash) then
    return false;
  end if;

  update public.guestbook
     set content = trim(p_content), updated_at = now()
   where id = p_id;
  return true;
end;
$$;

create or replace function public.guestbook_delete_post(
  p_id       bigint,
  p_password text
) returns boolean
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_hash text;
begin
  select password_hash into v_hash from public.guestbook where id = p_id;
  if v_hash is null or v_hash <> extensions.crypt(p_password, v_hash) then
    return false;
  end if;

  delete from public.guestbook where id = p_id;
  return true;
end;
$$;

-- 관리자 비밀번호 대조용 내부 헬퍼
create or replace function public.is_admin(p_password text)
returns boolean
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_hash text;
begin
  select value_hash into v_hash from public.app_secrets where key = 'admin_password';
  return v_hash is not null and v_hash = extensions.crypt(p_password, v_hash);
end;
$$;

revoke all on function public.is_admin(text) from anon, authenticated;

create or replace function public.project_detail_create(
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
  values (p_slug, p_section_title, p_content, nullif(trim(coalesce(p_image_url, '')), ''), coalesce(p_order_num, 1));
end;
$$;

create or replace function public.project_detail_update(
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

create or replace function public.project_detail_delete(
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

-- 클라이언트(anon)가 호출할 수 있어야 하는 함수만 실행 권한을 줍니다.
grant execute on function public.guestbook_create_post(text, text, text, text) to anon, authenticated;
grant execute on function public.guestbook_update_post(bigint, text, text)     to anon, authenticated;
grant execute on function public.guestbook_delete_post(bigint, text)           to anon, authenticated;
grant execute on function public.project_detail_create(text, text, text, text, integer, text) to anon, authenticated;
grant execute on function public.project_detail_update(bigint, text, text, text, text)        to anon, authenticated;
grant execute on function public.project_detail_delete(bigint, text)                          to anon, authenticated;
