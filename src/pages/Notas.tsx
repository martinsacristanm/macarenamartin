import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MessageCircle, Send, ChevronDown, ChevronUp } from "lucide-react";

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
  const [newName, setNewName] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyName, setReplyName] = useState("");
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

    // Real-time subscription
    const channel = supabase
      .channel("forum-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "forum_questions" }, () => fetchQuestions())
      .on("postgres_changes", { event: "*", schema: "public", table: "forum_replies" }, () => fetchQuestions())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const submitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    await supabase.from("forum_questions").insert({
      question: newQuestion.trim(),
      author_name: newName.trim() || "Anónimo",
    });

    setNewQuestion("");
    setNewName("");
  };

  const submitReply = async (questionId: string) => {
    if (!replyContent.trim()) return;

    await supabase.from("forum_replies").insert({
      question_id: questionId,
      content: replyContent.trim(),
      author_name: replyName.trim() || "Anónimo",
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">Comunidad</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">Notas</h1>
            <div className="divider-gold my-6 max-w-[100px] mx-auto" />
            <p className="text-foreground/70">Un espacio para compartir ideas, preguntas y reflexiones.</p>
          </div>

          {/* New question form */}
          <form onSubmit={submitQuestion} className="mb-12 bg-card border border-border rounded-sm p-6 space-y-4">
            <h3 className="font-display text-lg text-foreground tracking-wide">Deja tu pregunta</h3>
            <input
              type="text"
              placeholder="Tu nombre (opcional)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-background border border-border rounded-sm px-4 py-2 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <textarea
              placeholder="¿Qué quieres preguntar o compartir?"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              rows={3}
              className="w-full bg-background border border-border rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary transition-colors resize-none"
            />
            <button
              type="submit"
              disabled={!newQuestion.trim()}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-sm text-sm tracking-wider uppercase hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={14} /> Publicar
            </button>
          </form>

          {/* Questions list */}
          {loading ? (
            <p className="text-center text-muted-foreground">Cargando...</p>
          ) : questions.length === 0 ? (
            <p className="text-center text-muted-foreground">Aún no hay preguntas. ¡Sé el primero!</p>
          ) : (
            <div className="space-y-4">
              {questions.map((q) => (
                <div key={q.id} className="bg-card border border-border rounded-sm overflow-hidden">
                  {/* Question */}
                  <div
                    className="p-6 cursor-pointer hover:bg-card/80 transition-colors"
                    onClick={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="text-foreground leading-relaxed">{q.question}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {q.author_name} · {formatDate(q.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground shrink-0">
                        <MessageCircle size={14} />
                        <span className="text-xs">{q.forum_replies?.length || 0}</span>
                        {expandedQuestion === q.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </div>
                    </div>
                  </div>

                  {/* Replies */}
                  {expandedQuestion === q.id && (
                    <div className="border-t border-border">
                      {q.forum_replies?.length > 0 && (
                        <div className="divide-y divide-border">
                          {q.forum_replies
                            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                            .map((r) => (
                              <div key={r.id} className="px-6 py-4 bg-background/50">
                                <p className="text-foreground text-sm leading-relaxed">{r.content}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {r.author_name} · {formatDate(r.created_at)}
                                </p>
                              </div>
                            ))}
                        </div>
                      )}

                      {/* Reply form */}
                      {replyingTo === q.id ? (
                        <div className="p-4 bg-background/30 space-y-3">
                          <input
                            type="text"
                            placeholder="Tu nombre (opcional)"
                            value={replyName}
                            onChange={(e) => setReplyName(e.target.value)}
                            className="w-full bg-background border border-border rounded-sm px-3 py-2 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                          />
                          <textarea
                            placeholder="Tu respuesta..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            rows={2}
                            className="w-full bg-background border border-border rounded-sm px-3 py-2 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => submitReply(q.id)}
                              disabled={!replyContent.trim()}
                              className="flex items-center gap-1 bg-primary text-primary-foreground px-4 py-1.5 rounded-sm text-xs tracking-wider uppercase hover:bg-primary/90 transition-colors disabled:opacity-40"
                            >
                              <Send size={12} /> Responder
                            </button>
                            <button
                              onClick={() => { setReplyingTo(null); setReplyContent(""); setReplyName(""); }}
                              className="px-4 py-1.5 text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReplyingTo(q.id)}
                          className="w-full p-3 text-xs tracking-wider uppercase text-muted-foreground hover:text-primary hover:bg-background/30 transition-colors"
                        >
                          Responder
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Notas;
