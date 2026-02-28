import { createContext, useContext, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock, LogOut } from "lucide-react";

interface AdminContextType {
  isAdmin: boolean;
  adminPassword: string;
  showAdminLogin: () => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  adminPassword: "",
  showAdminLogin: () => {},
  logout: () => {},
});

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await supabase.functions.invoke("forum-admin", {
        body: { action: "verify", password: inputPassword },
      });
      if (res.error || res.data?.error) {
        setError(res.data?.error || "Contraseña incorrecta");
        return;
      }
      setPassword(inputPassword);
      setIsAdmin(true);
      setShowLogin(false);
    } catch {
      setError("Error de conexión");
    }
  };

  const logout = () => {
    setIsAdmin(false);
    setPassword("");
    setInputPassword("");
  };

  return (
    <AdminContext.Provider value={{ isAdmin, adminPassword: password, showAdminLogin: () => setShowLogin(true), logout }}>
      {children}

      {/* Admin toggle button */}
      {!isAdmin && (
        <button
          onClick={() => setShowLogin(true)}
          className="fixed bottom-6 right-6 p-2 text-muted-foreground/30 hover:text-primary transition-colors z-50"
          title="Admin"
        >
          <Lock size={16} />
        </button>
      )}

      {/* Admin bar */}
      {isAdmin && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-3 py-1.5 z-50">
          <span className="text-[10px] text-primary tracking-wider uppercase">Admin</span>
          <button onClick={logout} className="text-muted-foreground hover:text-foreground transition-colors">
            <LogOut size={12} />
          </button>
        </div>
      )}

      {/* Login modal */}
      {showLogin && !isAdmin && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setShowLogin(false)}>
          <form
            onSubmit={handleLogin}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-sm p-6 w-full max-w-sm space-y-4"
          >
            <h3 className="font-display text-lg text-foreground tracking-wide">Acceso admin</h3>
            <input
              type="password"
              placeholder="Contraseña"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              className="w-full bg-background border border-border rounded-sm px-4 py-2 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary transition-colors"
              autoFocus
            />
            {error && <p className="text-destructive text-xs">{error}</p>}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-sm text-sm tracking-wider uppercase hover:bg-primary/90 transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      )}
    </AdminContext.Provider>
  );
};
