import Section from './Section';
import ImagePlaceholder from './ImagePlaceholder';
import { projects } from '../data/content';

function ProjectCard({ title, description, tags, image, url, index }) {
  const isEven = index % 2 === 0;
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="geo-card block hover:bg-white/[0.05] transition-all duration-300 group overflow-hidden border-2 hover:border-terminal-accent"
    >
      <div className={`flex flex-col md:flex-row ${isEven ? '' : 'md:flex-row-reverse'} gap-0 h-[240px]`}>
        <div className="md:w-1/2 flex-shrink-0 relative overflow-hidden h-full">
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover" />
          ) : (
            <ImagePlaceholder src={null} alt={title} size="lg" className="w-full h-full border-0" />
          )}
        </div>

        {/* Contenido del proyecto */}
        <div className="flex-1 p-5 flex flex-col justify-center bg-black/40">
          <div className="mb-2.5">
            <h3 className="text-base md:text-lg font-bold tracking-wider mb-1 group-hover:text-terminal-accent transition-colors uppercase">
              {title} <span className="text-terminal-dim">•••</span> <span className="text-xs">?!</span>
            </h3>
            <div className="h-px bg-gradient-to-r from-terminal-accent to-transparent mb-2.5" />
          </div>
          
          <p className="text-xs md:text-sm text-terminal-dim leading-relaxed mb-3">
            {description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-2.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] uppercase tracking-widest px-2 py-1 bg-terminal-border/20 text-terminal-fg border border-terminal-border hover:border-terminal-accent transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="text-xs text-red-500 hover:text-red-400 transition-colors">
            Ver en GitHub →
          </div>
        </div>
      </div>
    </a>
  );
}

export default function Projects() {
  return (
    <Section id="proyectos" title="Proyectos">
      <div className="space-y-5">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} {...project} index={index} />
        ))}
      </div>
    </Section>
  );
}
