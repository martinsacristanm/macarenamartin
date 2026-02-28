const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="container mx-auto max-w-4xl text-center">
        <p className="font-display text-primary text-lg mb-2">Macarena Martin S.</p>
        <p className="text-xs text-muted-foreground tracking-widest uppercase">
          © {new Date().getFullYear()} · Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
};

export default Footer;
