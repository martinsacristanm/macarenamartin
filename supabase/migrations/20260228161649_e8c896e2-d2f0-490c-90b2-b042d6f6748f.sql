
-- Tabla de preguntas del foro
CREATE TABLE public.forum_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL DEFAULT 'Anónimo',
  question TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de respuestas
CREATE TABLE public.forum_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.forum_questions(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL DEFAULT 'Anónimo',
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.forum_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

-- Acceso público de lectura e inserción (foro abierto sin auth)
CREATE POLICY "Anyone can read questions" ON public.forum_questions FOR SELECT USING (true);
CREATE POLICY "Anyone can create questions" ON public.forum_questions FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read replies" ON public.forum_replies FOR SELECT USING (true);
CREATE POLICY "Anyone can create replies" ON public.forum_replies FOR INSERT WITH CHECK (true);

-- Índice para buscar respuestas por pregunta
CREATE INDEX idx_forum_replies_question_id ON public.forum_replies(question_id);
