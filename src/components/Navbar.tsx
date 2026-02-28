const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <a href="#hero" className="font-display text-xl tracking-wider text-primary">
          Macarena Martin S.
        </a>
        <div className="flex gap-8 text-sm tracking-widest uppercase text-muted-foreground">
          <a href="/#libro" className="hover:text-primary transition-colors duration-300">Libro</a>
          
          <a href="/#sobre-mi" className="hover:text-primary transition-colors duration-300">Sobre mí</a>
          <a href="/notas" className="hover:text-primary transition-colors duration-300">Notas</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
