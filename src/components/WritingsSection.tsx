import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Send, X } from "lucide-react";

interface Writing {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  year: string;
}

interface WritingsSectionProps {
  isAdmin?: boolean;
  adminPassword?: string;
}

const WritingsSection = ({ isAdmin = false, adminPassword = "" }: WritingsSectionProps) => {
  const [writings, setWritings] = useState<Writing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", excerpt: "", category: "", year: "" });

  const fetchWritings = async () => {
    const { data } = await supabase
      .from("writings")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setWritings(data as Writing[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchWritings();
  }, []);

  const adminAction = async (action: string, extra: Record<string, string> = {}) => {
    const res = await supabase.functions.invoke("forum-admin", {
      body: { action, password: adminPassword, ...extra },
    });
    if (res.error || res.data?.error) throw new Error(res.data?.error || res.error?.message || "Error");
    return res.data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminAction("update_writing", { writing_id: editingId, ...form });
      } else {
        await adminAction("create_writing", form);
      }
      resetForm();
      fetchWritings();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este escrito?")) return;
    try {
      await adminAction("delete_writing", { writing_id: id });
      fetchWritings();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const startEdit = (w: Writing) => {
    setForm({ title: w.title, excerpt: w.excerpt, category: w.category, year: w.year });
    setEditingId(w.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ title: "", excerpt: "", category: "", year: "" });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <section id="escritos" className="py-24 md:py-32 px-6 bg-card/50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">Archivo</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Escritos anteriores
          </h2>
          <div className="divider-gold my-6 max-w-[100px] mx-auto" />
          <p className="text-muted-foreground max-w-lg mx-auto">
            Una selección de textos que escribí a lo largo de los años. Semillas de lo que vendrá.
          </p>
        </div>

        {/* Admin: add button */}
        {isAdmin && !showForm && (
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="mb-8 flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-lg text-xs tracking-wider uppercase hover:bg-primary/90 transition-colors mx-auto"
          >
            <Plus size={14} /> Nuevo escrito
          </button>
        )}

        {/* Admin: form */}
        {isAdmin && showForm && (
          <form onSubmit={handleSubmit} className="mb-12 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-5 space-y-3 max-w-2xl mx-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-base text-foreground tracking-wide">
                {editingId ? "Editar escrito" : "Nuevo escrito"}
              </h3>
              <button type="button" onClick={resetForm} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={16} />
              </button>
            </div>
            <input
              type="text"
              placeholder="Título"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full bg-background/50 border border-border/50 rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors"
            />
            <textarea
              placeholder="Extracto / contenido"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              required
              rows={3}
              className="w-full bg-background/50 border border-border/50 rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Categoría"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="flex-1 bg-background/50 border border-border/50 rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
              <input
                type="text"
                placeholder="Año"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-24 bg-background/50 border border-border/50 rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={!form.title.trim() || !form.excerpt.trim()}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-lg text-xs tracking-wider uppercase hover:bg-primary/90 transition-colors disabled:opacity-40"
            >
              <Send size={13} /> {editingId ? "Guardar" : "Publicar"}
            </button>
          </form>
        )}

        {/* Writings list */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : writings.length === 0 ? (
          <p className="text-center text-muted-foreground">Aún no hay escritos.</p>
        ) : (
          <div className="grid gap-1">
            {writings.map((writing) => (
              <article
                key={writing.id}
                className="group border-b border-border py-8 px-4 hover:bg-secondary/30 transition-all duration-500"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs tracking-[0.2em] uppercase text-primary">
                        {writing.category}
                      </span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{writing.year}</span>
                    </div>
                    <h3 className="font-display text-xl md:text-2xl text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
                      {writing.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base max-w-2xl">
                      {writing.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 mt-8 shrink-0">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => startEdit(writing)}
                          className="text-muted-foreground/50 hover:text-primary transition-colors p-1.5"
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(writing.id)}
                          className="text-muted-foreground/50 hover:text-destructive transition-colors p-1.5"
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                    <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-lg ml-1">
                      →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WritingsSection;
