// lib/supabase.ts

import { createClient } from '@supabase/supabase-js';

// **Next.js 규칙에 따라 NEXT_PUBLIC_ 접두사를 사용합니다.**
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 배포 시 문제가 생기지 않도록 값이 있는지 확인
if (!supabaseUrl || !supabaseKey) {
    // ⚠️ 환경 변수가 없으면 오류 발생
    throw new Error('Supabase URL or Key is missing in environment variables. Check .env.local and Vercel settings.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
