// lib/supabase.ts

// 임시 mock – 실제 DB 연결 안 하고
// select/insert 호출해도 항상 빈 데이터/성공만 반환하는 버전

export const supabase = {
  from(_table: string) {
    return {
      // select 뒤에 .order(...) 체이닝을 할 수 있도록 구현
      select(_columns?: string) {
        return {
          order(
            _column: string,
            _opts?: { ascending?: boolean }
          ): Promise<{ data: any[]; error: null }> {
            return Promise.resolve({ data: [], error: null });
          },
        };
      },

      // insert는 바로 Promise를 리턴
      insert(_values: any): Promise<{ error: null }> {
        return Promise.resolve({ error: null });
      },
    };
  },
};



// import { createClient } from '@supabase/supabase-js';

// 아까 수파베이스 설정(Settings -> API)에서 본 값을 따옴표 안에 넣으세요.
// const supabaseUrl = 'https://wchcdfeyazvsibxbasbb.supabase.co';
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjaGNkZmV5YXp2c2lieGJhc2JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NzEzNDYsImV4cCI6MjA4MDQ0NzM0Nn0.v8gYCjS2gys9oBcDwEYhj-kSnDq1liDungsMFRdhMGE';

// export const supabase = createClient(supabaseUrl, supabaseKey);
