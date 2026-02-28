const BookTeaser = () => {
  return (
    <section id="libro" className="py-24 md:py-32 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">El proyecto</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            El libro
          </h2>
          <div className="divider-gold my-6 max-w-[100px] mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Teaser text */}
          <div className="space-y-6">
            <div className="mb-4 text-center">
              <p className="font-display text-2xl md:text-3xl font-light tracking-wide text-foreground/70">
                El Legado de
              </p>
              <p className="font-display text-5xl md:text-7xl font-bold text-primary tracking-wider">
                Auroa
              </p>
            </div>
            <div className="divider-gold my-4 max-w-[60px]" />
            <p className="text-secondary-foreground leading-relaxed text-lg font-light italic font-display">
              "No todo lo que se pierde desaparece. A veces, lo perdido simplemente espera en otro lugar, en otro tiempo, en otra versión de nosotros mismos."
            </p>
            <div className="divider-gold my-4 max-w-[60px]" />
            <p className="text-foreground leading-relaxed">
              Una novela sobre memoria, poder y las consecuencias de alterar lo que creemos inmutable.
            </p>
            <p className="text-foreground leading-relaxed">
              Un viaje a los días previos al 23 de febrero de 1981.
            </p>
            <p className="text-foreground leading-relaxed font-display italic">
              ¿Y si la historia no fue como nos contaron?
            </p>
          </div>

          {/* Visual element */}
          <div className="relative">
            <div className="aspect-[3/4] bg-card border border-border rounded-sm flex items-center justify-center overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <div className="text-center px-8 relative z-10">
                <p className="font-display text-6xl text-primary/20 font-bold mb-4">?</p>
                <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground">
                  Portada por revelar
                </p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent group-hover:via-primary/70 transition-all duration-700" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookTeaser;
