const writings = [
  {
    title: "Fragmentos del silencio",
    excerpt: "El silencio no es la ausencia de sonido. Es el espacio donde las palabras que no dijimos siguen resonando, esperando ser encontradas.",
    category: "Relato corto",
    year: "2019",
  },
  {
    title: "Cartas a ninguna parte",
    excerpt: "Escribo cartas que nunca envío. Cada una es un puente hacia alguien que ya no existe, o que quizá nunca existió fuera de mi imaginación.",
    category: "Ensayo",
    year: "2020",
  },
  {
    title: "El peso de las sombras",
    excerpt: "Las sombras no pesan, dirán algunos. Pero quien ha cargado con la sombra de una decisión no tomada sabe que pueden ser lo más pesado del mundo.",
    category: "Poesía",
    year: "2021",
  },
  {
    title: "Notas desde el margen",
    excerpt: "Desde los márgenes se ve mejor el centro. Desde el centro, en cambio, los márgenes son invisibles.",
    category: "Reflexiones",
    year: "2022",
  },
];

const WritingsSection = () => {
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

        <div className="grid gap-1">
          {writings.map((writing, index) => (
            <article
              key={index}
              className="group border-b border-border py-8 px-4 hover:bg-secondary/30 transition-all duration-500 cursor-pointer"
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
                <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-8 text-lg">
                  →
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WritingsSection;
