import '@supabase/supabase-js';

declare module '@supabase/supabase-js' {
  interface User {
    name?: string;
  }
  interface UserMetadata {
    [key: string]: unknown;
  }
}
