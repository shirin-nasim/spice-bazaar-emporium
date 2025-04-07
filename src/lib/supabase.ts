
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qicomzwfiudggpubcsgu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpY29tendmaXVkZ2dwdWJjc2d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMjkxNjksImV4cCI6MjA1OTYwNTE2OX0.zmDveKynL-GnsACJESyXbXoCZmTj7j3y-h7u-ypuWOM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
