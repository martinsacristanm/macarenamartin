
-- Remove the public insert policy on questions (only admin via service role can create)
DROP POLICY IF EXISTS "Anyone can create questions" ON public.forum_questions;

-- Allow admin to delete replies (via service role in edge function)
-- No additional policy needed since edge function uses service role

-- Add delete policy for replies (none exists, edge function uses service role which bypasses RLS)
