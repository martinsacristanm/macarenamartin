
-- Enable realtime for forum tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_questions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_replies;
