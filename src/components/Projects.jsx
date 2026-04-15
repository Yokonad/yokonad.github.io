import Section from './Section';
import { projects } from '../data/content';

function ProjectCard({ title, description, tags, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="geo-card block hover:bg-white/[0.05] transition-all duration-300 group overflow-hidden border-2 hover:border-terminal-accent"
    >
      <div className="p-5 bg-black/40 min-h-[220px] flex flex-col justify-center">
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
          {tags.map((tag, i) => (
            <span
              key={`project-tag-${tag}-${i}`}
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
    </a>
  );
}

export default function Projects() {
  return (
    <Section id="proyectos" title="Proyectos">
      <div className="space-y-5">
        {projects.map((project, i) => (
          <ProjectCard key={`project-${project.title}-${i}`} {...project} />
        ))}
      </div>
    </Section>
  );
}
