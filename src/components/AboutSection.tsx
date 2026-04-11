const AboutSection = () => {
  return (
    <section id="sobre-mi" className="py-24 md:py-32 px-6">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">La autora</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Sobre mí
          </h2>
          <div className="divider-gold my-6 max-w-[100px] mx-auto" />
        </div>

        <div className="space-y-6 text-center">
          <p className="text-secondary-foreground leading-relaxed text-xl md:text-2xl font-light">
            He vivido siempre entre dos mundos:<br />
            el de las ideas que no me dejan dormir<br />
            y el de las palabras que intento usar para atraparlas.
          </p>
          <p className="text-muted-foreground leading-relaxed text-lg md:text-xl">
            Durante años escribí sin mostrarlo.<br />
            Ahora he decidido compartir lo que antes guardaba.
          </p>
          
          <div className="pt-8">
            <div className="divider-gold my-8 max-w-[60px] mx-auto" />
            <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground">
              Contacto
            </p>
            <a 
              href="mailto:martinsacristanm@gmail.com" 
              className="inline-block mt-2 text-primary hover:text-gold transition-colors duration-300 font-display text-lg"
            >
              martinsacristanm@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
