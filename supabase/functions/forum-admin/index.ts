import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { action, password } = body;
    const adminPassword = Deno.env.get("ADMIN_PASSWORD");

    if (!password || password !== adminPassword) {
      return json({ error: "Contraseña incorrecta" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // --- Forum actions ---

    if (action === "create_question") {
      if (!body.question?.trim()) return json({ error: "La pregunta no puede estar vacía" }, 400);
      const { data, error } = await supabase
        .from("forum_questions")
        .insert({ question: body.question.trim(), author_name: "Macarena Martin S." })
        .select()
        .single();
      if (error) throw error;
      return json({ success: true, data });
    }

    if (action === "delete_reply") {
      if (!body.reply_id) return json({ error: "ID requerido" }, 400);
      const { error } = await supabase.from("forum_replies").delete().eq("id", body.reply_id);
      if (error) throw error;
      return json({ success: true });
    }

    if (action === "delete_question") {
      if (!body.reply_id) return json({ error: "ID requerido" }, 400);
      const { error } = await supabase.from("forum_questions").delete().eq("id", body.reply_id);
      if (error) throw error;
      return json({ success: true });
    }

    // --- Writings actions ---

    if (action === "create_writing") {
      const { title, excerpt, category, year } = body;
      if (!title?.trim() || !excerpt?.trim()) return json({ error: "Título y extracto requeridos" }, 400);
      const { data, error } = await supabase
        .from("writings")
        .insert({ title: title.trim(), excerpt: excerpt.trim(), category: category?.trim() || "Relato corto", year: year?.trim() || new Date().getFullYear().toString() })
        .select()
        .single();
      if (error) throw error;
      return json({ success: true, data });
    }

    if (action === "update_writing") {
      const { writing_id, title, excerpt, category, year } = body;
      if (!writing_id) return json({ error: "ID requerido" }, 400);
      const updates: Record<string, string> = {};
      if (title?.trim()) updates.title = title.trim();
      if (excerpt?.trim()) updates.excerpt = excerpt.trim();
      if (category?.trim()) updates.category = category.trim();
      if (year?.trim()) updates.year = year.trim();
      const { data, error } = await supabase
        .from("writings")
        .update(updates)
        .eq("id", writing_id)
        .select()
        .single();
      if (error) throw error;
      return json({ success: true, data });
    }

    if (action === "delete_writing") {
      if (!body.writing_id) return json({ error: "ID requerido" }, 400);
      const { error } = await supabase.from("writings").delete().eq("id", body.writing_id);
      if (error) throw error;
      return json({ success: true });
    }

    if (action === "verify") {
      return json({ success: true });
    }

    return json({ error: "Acción no válida" }, 400);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
});
