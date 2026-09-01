-- 20260901 · 비밀번호 컬럼 노출 차단 + 비밀번호 처리 강화
--
-- 배경
--   guestbook, project_details 두 테이블의 password_hash 컬럼이 anon 키로 그대로
--   읽혔습니다. anon 키는 사이트 JS 번들에 실려 나가는 공개값이라, 누구나
--   전체 해시를 덤프할 수 있는 상태였습니다.
--
--   RLS 는 '행' 단위 필터라 컬럼 노출은 막지 못합니다. 컬럼 단위 GRANT 를
--   따로 걸어야 합니다.
--
-- 실행 방법
--   Supabase 대시보드 > SQL Editor 에 붙여넣고 Run.
--   여러 번 실행해도 안전합니다.

begin;

-- ══════════════════════════════════════════════════════════════════
-- PART A — 컬럼 노출 차단 (필수, 동작 변화 없음)
-- ══════════════════════════════════════════════════════════════════
-- 쓰기는 전부 SECURITY DEFINER 함수를 거치므로, 테이블 직접 권한을 회수해도
-- 글쓰기·수정·삭제는 그대로 동작합니다.

revoke all on public.guestbook from anon, authenticated;
grant select (id, author, content, category, created_at, updated_at)
  on public.guestbook to anon, authenticated;

revoke all on public.project_details from anon, authenticated;
grant select (id, slug, section_title, content, image_url, order_num, created_at, updated_at)
  on public.project_details to anon, authenticated;

-- ══════════════════════════════════════════════════════════════════
-- PART B — 비밀번호 처리 강화
-- ══════════════════════════════════════════════════════════════════
-- 현재 5개 글 중 3개는 password_hash 가 빈 문자열입니다. 빈 비밀번호가
-- 어떻게 비교되느냐에 따라 아무나 수정·삭제할 수 있습니다.
--
-- 아래는 해시를 bcrypt 로 통일하고 빈 비밀번호를 금지합니다.
-- ⚠️ 기존 글의 비밀번호는 알고리즘이 달라 검증에 실패하게 됩니다.
--    현재 남아 있는 5개가 모두 테스트 글("hi", "hello", "ㅇㅇ", "게시글")이라
--    그대로 진행해도 잃을 것이 없습니다.

create extension if not exists pgcrypto with schema extensions;

-- 비밀번호 없이 만들어진 과거 글은 아무나 건드릴 수 있으므로 잠급니다.
-- 검증 불가능한 표식을 넣어 두면 어떤 입력과도 일치하지 않습니다.
update public.guestbook
   set password_hash = '!locked'
 where coalesce(trim(password_hash), '') = '';

alter table public.guestbook
  alter column password_hash set not null;

create or replace function public.guestbook_create_post(
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

  -- '!locked' 처럼 bcrypt 형식이 아닌 값은 어떤 입력과도 일치하지 않습니다.
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

create or replace function public.guestbook_delete_post(
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

-- 함수 실행 권한은 유지 (PART A 의 revoke 는 테이블 대상이라 함수와 무관하지만,
-- 재실행해도 안전하도록 명시합니다.)
grant execute on function public.guestbook_create_post(text, text, text, text) to anon, authenticated;
grant execute on function public.guestbook_update_post(bigint, text, text)     to anon, authenticated;
grant execute on function public.guestbook_delete_post(bigint, text)           to anon, authenticated;

commit;

-- ══════════════════════════════════════════════════════════════════
-- 선택 — 테스트 글 정리
-- ══════════════════════════════════════════════════════════════════
-- 위 마이그레이션 후 기존 5개 글은 모두 수정·삭제가 불가능해집니다
-- (비밀번호를 검증할 수 없으므로). 지우시려면 아래를 실행하세요.
--
-- delete from public.guestbook where id in (1, 2, 3, 4, 5);
