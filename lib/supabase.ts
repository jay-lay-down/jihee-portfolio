// 임시 mock – 실제 DB 연결 안 하고 그냥 빈 데이터/성공만 돌려줌
export const supabase = {
  from() {
    return {
      // SELECT 호출 시: 빈 배열 + 에러 없음
      select: async () => ({ data: [], error: null }),

      // INSERT 호출 시: 그냥 성공했다고만 리턴
      insert: async () => ({ error: null }),
    };
  },
};



// import { createClient } from '@supabase/supabase-js';

// 아까 수파베이스 설정(Settings -> API)에서 본 값을 따옴표 안에 넣으세요.
// const supabaseUrl = 'https://wchcdfeyazvsibxbasbb.supabase.co';
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjaGNkZmV5YXp2c2lieGJhc2JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NzEzNDYsImV4cCI6MjA4MDQ0NzM0Nn0.v8gYCjS2gys9oBcDwEYhj-kSnDq1liDungsMFRdhMGE';

// export const supabase = createClient(supabaseUrl, supabaseKey);
