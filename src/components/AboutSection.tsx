const AboutSection = () => {
  return (
    <section id="sobre-mi" className="py-24 md:py-32 px-6">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">El autor</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Sobre mí
          </h2>
          <div className="divider-gold my-6 max-w-[100px] mx-auto" />
        </div>

        <div className="space-y-6 text-center">
          <p className="text-secondary-foreground leading-relaxed text-lg font-light">
            Soy alguien que siempre ha vivido entre dos mundos: el de las ideas que no me dejan 
            dormir y el de las palabras que intento usar para atraparlas.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Durante años escribí en silencio — relatos, ensayos, fragmentos sueltos que guardaba 
            en cajones y carpetas olvidadas. Ahora, por fin, he decidido darles voz. Este sitio 
            es el primer paso de un proyecto más grande: mi primer libro.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            No pretendo tener todas las respuestas. Solo quiero hacer las preguntas correctas y, 
            quizá, encontrar a quienes se hacen las mismas.
          </p>
          
          <div className="pt-8">
            <div className="divider-gold my-8 max-w-[60px] mx-auto" />
            <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground">
              Contacto
            </p>
            <a 
              href="mailto:hola@elautor.com" 
              className="inline-block mt-2 text-primary hover:text-gold transition-colors duration-300 font-display text-lg"
            >
              hola@elautor.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
