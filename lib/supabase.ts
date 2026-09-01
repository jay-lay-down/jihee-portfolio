// lib/supabase.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/*
  환경변수가 없다고 여기서 throw 하면 게시판과 무관한 페이지까지 통째로 죽는다.
  빌드나 클론 직후처럼 키가 없는 상황에서도 사이트는 떠야 하므로,
  설정 여부만 플래그로 노출하고 호출부에서 판단하게 한다.
*/
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

if (!isSupabaseConfigured && typeof window !== 'undefined') {
  console.warn(
    '[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 가 없습니다. 게시판 기능이 비활성화됩니다.'
  );
}

export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseKey ?? 'placeholder-anon-key'
);
