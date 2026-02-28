import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Atmósfera literaria"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <p className="text-sm tracking-[0.4em] uppercase text-muted-foreground mb-6 animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
          Próximamente
        </p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold leading-tight mb-6 glow-gold animate-fade-in-up opacity-0 text-gradient-gold">
          Un nuevo capítulo comienza
        </h1>
        <div className="divider-gold my-8 max-w-xs mx-auto animate-fade-in opacity-0" style={{ animationDelay: '0.6s' }} />
        <p className="text-lg md:text-xl text-secondary-foreground leading-relaxed font-light max-w-xl mx-auto animate-fade-in opacity-0" style={{ animationDelay: '0.8s' }}>
          No viajaron para cambiar la historia.
          <br /><br />
          Viajaron para observarla.
          <br /><br />
          Pero hay fechas que no se dejan mirar sin consecuencias.
        </p>
        <a
          href="#libro"
          className="inline-block mt-10 px-8 py-3 border border-primary/40 text-primary text-sm tracking-widest uppercase hover:bg-primary/10 transition-all duration-500 animate-fade-in opacity-0"
          style={{ animationDelay: '1.2s' }}
        >
          Descubrir más
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
