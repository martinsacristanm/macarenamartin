import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MessageCircle, Send, ChevronDown, ChevronUp, Trash2, Lock, LogOut } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

interface Reply {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

interface Question {
  id: string;
  author_name: string;
  question: string;
  created_at: string;
  forum_replies: Reply[];
}

const Notas = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyName, setReplyName] = useState("");
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  const fetchQuestions = async () => {
    const { data } = await supabase
      .from("forum_questions")
      .select("*, forum_replies(*)")
      .order("created_at", { ascending: false });

    if (data) setQuestions(data as Question[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions();

    const channel = supabase
      .channel("forum-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "forum_questions" }, () => fetchQuestions())
      .on("postgres_changes", { event: "*", schema: "public", table: "forum_replies" }, () => fetchQuestions())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const adminAction = async (action: string, extra: Record<string, string> = {}) => {
    const res = await supabase.functions.invoke("forum-admin", {
      body: { action, password: adminPassword, ...extra },
    });
    if (res.error || res.data?.error) {
      const msg = res.data?.error || res.error?.message || "Error";
      if (msg === "Contraseña incorrecta") {
        setIsAdmin(false);
        setAdminPassword("");
      }
      throw new Error(msg);
    }
    return res.data;
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    try {
      const res = await supabase.functions.invoke("forum-admin", {
        body: { action: "verify", password: adminPassword },
      });
      if (res.error || res.data?.error) {
        setAdminError(res.data?.error || "Contraseña incorrecta");
        return;
      }
      setIsAdmin(true);
      setShowAdminLogin(false);
    } catch {
      setAdminError("Error de conexión");
    }
  };

  const submitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !isAdmin) return;
    try {
      await adminAction("create_question", { question: newQuestion.trim() });
      setNewQuestion("");
    } catch (err: any) {
      setAdminError(err.message);
    }
  };

  const deleteReply = async (replyId: string) => {
    try {
      await adminAction("delete_reply", { reply_id: replyId });
    } catch (err: any) {
      setAdminError(err.message);
    }
  };

  const deleteQuestion = async (questionId: string) => {
    if (!confirm("¿Eliminar esta pregunta y todas sus respuestas?")) return;
    try {
      await adminAction("delete_question", { reply_id: questionId });
    } catch (err: any) {
      setAdminError(err.message);
    }
  };

  const submitReply = async (questionId: string) => {
    if (!replyContent.trim() || !replyName.trim()) return;

    await supabase.from("forum_replies").insert({
      question_id: questionId,
      content: replyContent.trim(),
      author_name: replyName.trim(),
    });

    setReplyContent("");
    setReplyName("");
    setReplyingTo(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen relative">
      {/* Background matching main page but lighter */}
      <div className="fixed inset-0 -z-10">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background/75" />
      </div>

      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-sm tracking-[0.3em] uppercase text-primary mb-3">Comunidad</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-3">Notas</h1>
            <div className="divider-gold my-5 max-w-[80px] mx-auto" />
            <p className="text-foreground/60 text-sm max-w-md mx-auto">
              Un espacio abierto para compartir ideas, preguntas y reflexiones.
            </p>
          </div>

          {/* Admin login toggle */}
          {!isAdmin && (
            <button
              onClick={() => setShowAdminLogin(!showAdminLogin)}
              className="fixed bottom-6 right-6 p-2 text-muted-foreground/30 hover:text-primary transition-colors z-50"
              title="Admin"
            >
              <Lock size={16} />
            </button>
          )}

          {/* Admin login modal */}
          {showAdminLogin && !isAdmin && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setShowAdminLogin(false)}>
              <form
                onSubmit={handleAdminLogin}
                onClick={(e) => e.stopPropagation()}
                className="bg-card border border-border rounded-sm p-6 w-full max-w-sm space-y-4"
              >
                <h3 className="font-display text-lg text-foreground tracking-wide">Acceso admin</h3>
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-sm px-4 py-2 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                  autoFocus
                />
                {adminError && <p className="text-destructive text-xs">{adminError}</p>}
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-sm text-sm tracking-wider uppercase hover:bg-primary/90 transition-colors"
                >
                  Entrar
                </button>
              </form>
            </div>
          )}

          {/* Admin bar */}
          {isAdmin && (
            <div className="mb-4 flex items-center justify-between bg-primary/10 border border-primary/20 rounded-lg px-4 py-2">
              <span className="text-xs text-primary tracking-wider uppercase">Modo admin activo</span>
              <button onClick={() => { setIsAdmin(false); setAdminPassword(""); }} className="text-muted-foreground hover:text-foreground transition-colors">
                <LogOut size={14} />
              </button>
            </div>
          )}

          {/* New question form - admin only */}
          {isAdmin && (
            <form onSubmit={submitQuestion} className="mb-8 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-5 space-y-3">
              <h3 className="font-display text-base text-foreground tracking-wide">Nueva pregunta</h3>
              <textarea
                placeholder="¿Qué quieres preguntar a la comunidad?"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                rows={2}
                className="w-full bg-background/50 border border-border/50 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none"
              />
              <button
                type="submit"
                disabled={!newQuestion.trim()}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-lg text-xs tracking-wider uppercase hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={13} /> Publicar
              </button>
            </form>
          )}

          {/* Chat area - lighter background to stand out */}
          <div className="bg-[hsl(220_10%_22%)] border border-[hsl(220_10%_30%)]/50 rounded-2xl p-4 md:p-6 shadow-2xl shadow-black/30">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border/20">
              <MessageCircle size={16} className="text-primary/60" />
              <span className="text-xs tracking-widest uppercase text-muted-foreground/60">Conversaciones</span>
            </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-16">
              <MessageCircle className="mx-auto mb-4 text-muted-foreground/20" size={36} />
              <p className="text-muted-foreground/50 text-sm">Aún no hay conversaciones.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="bg-[hsl(220_10%_26%)] border border-[hsl(220_10%_32%)]/30 rounded-xl overflow-hidden hover:border-primary/20 transition-all duration-300"
                >
                  {/* Question bubble */}
                  <div
                    className="p-5 cursor-pointer group"
                    onClick={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground leading-relaxed text-[15px]">{q.question}</p>
                        <p className="text-xs text-muted-foreground/60 mt-2">
                          {q.author_name} · {formatDate(q.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground/50 shrink-0 group-hover:text-muted-foreground transition-colors">
                        {isAdmin && (
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteQuestion(q.id); }}
                            className="hover:text-destructive transition-colors p-1"
                            title="Eliminar pregunta"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                        <div className="flex items-center gap-1">
                          <MessageCircle size={13} />
                          <span className="text-xs">{q.forum_replies?.length || 0}</span>
                        </div>
                        {expandedQuestion === q.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </div>
                    </div>
                  </div>

                  {/* Replies - chat style */}
                  {expandedQuestion === q.id && (
                    <div className="border-t border-border/20">
                      {q.forum_replies?.length > 0 && (
                        <div className="p-4 space-y-3">
                          {q.forum_replies
                            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                            .map((r) => (
                              <div key={r.id} className="flex gap-3 items-start group/reply">
                                {/* Avatar circle */}
                                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                                  <span className="text-[10px] font-medium text-foreground/70 uppercase">
                                    {r.author_name.charAt(0)}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="bg-secondary/40 rounded-lg rounded-tl-sm px-3.5 py-2.5">
                                    <p className="text-xs font-medium text-primary/80 mb-1">{r.author_name}</p>
                                    <p className="text-foreground/90 text-sm leading-relaxed">{r.content}</p>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground/40 mt-1 px-1">
                                    {formatDate(r.created_at)}
                                  </p>
                                </div>
                                {isAdmin && (
                                  <button
                                    onClick={() => deleteReply(r.id)}
                                    className="text-muted-foreground/20 hover:text-destructive transition-colors p-1 shrink-0 opacity-0 group-hover/reply:opacity-100"
                                    title="Eliminar respuesta"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                )}
                              </div>
                            ))}
                        </div>
                      )}

                      {/* Reply input - chat style */}
                      {replyingTo === q.id ? (
                        <div className="p-4 pt-2 space-y-2">
                          <input
                            type="text"
                            placeholder="Tu nombre"
                            required
                            value={replyName}
                            onChange={(e) => setReplyName(e.target.value)}
                            className="w-full bg-background/40 border border-border/30 rounded-lg px-3.5 py-2 text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-primary/40 transition-colors"
                          />
                          <div className="flex gap-2">
                            <textarea
                              placeholder="Escribe tu respuesta..."
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              rows={1}
                              className="flex-1 bg-background/40 border border-border/30 rounded-lg px-3.5 py-2 text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-primary/40 transition-colors resize-none"
                              autoFocus
                            />
                            <button
                              onClick={() => submitReply(q.id)}
                              disabled={!replyContent.trim() || !replyName.trim()}
                              className="bg-primary text-primary-foreground p-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0 self-end"
                            >
                              <Send size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => { setReplyingTo(null); setReplyContent(""); setReplyName(""); }}
                            className="text-[10px] tracking-wider uppercase text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReplyingTo(q.id)}
                          className="w-full p-3 text-xs tracking-wider text-muted-foreground/40 hover:text-primary hover:bg-background/20 transition-all border-t border-border/10"
                        >
                          Responder...
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Notas;
