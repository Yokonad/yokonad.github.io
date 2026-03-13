// ── Sección Galería: carrusel rectangular arriba de música ──
import Section from './Section';
import Carousel from './Carousel';

export default function Gallery() {
  return (
    <Section id="galeria" title="Galería">
      <div className="max-w-2xl mx-auto">
        <Carousel />
      </div>
    </Section>
  );
}
