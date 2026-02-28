CREATE TABLE public.writings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  excerpt text NOT NULL,
  category text NOT NULL DEFAULT 'Relato corto',
  year text NOT NULL DEFAULT '2024',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.writings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read writings" ON public.writings
  FOR SELECT USING (true);

INSERT INTO public.writings (title, excerpt, category, year) VALUES
  ('Fragmentos del silencio', 'El silencio no es la ausencia de sonido. Es el espacio donde las palabras que no dijimos siguen resonando, esperando ser encontradas.', 'Relato corto', '2019'),
  ('Cartas a ninguna parte', 'Escribo cartas que nunca envío. Cada una es un puente hacia alguien que ya no existe, o que quizá nunca existió fuera de mi imaginación.', 'Ensayo', '2020'),
  ('El peso de las sombras', 'Las sombras no pesan, dirán algunos. Pero quien ha cargado con la sombra de una decisión no tomada sabe que pueden ser lo más pesado del mundo.', 'Poesía', '2021'),
  ('Notas desde el margen', 'Desde los márgenes se ve mejor el centro. Desde el centro, en cambio, los márgenes son invisibles.', 'Reflexiones', '2022');