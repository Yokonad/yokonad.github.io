import Section from './Section';
import { comunidad } from '../data/content';

function DiscordIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 127.14 96.36"
      className="h-5 w-5 shrink-0"
      fill="currentColor"
    >
      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.2,46,96.12,53,91.08,65.69,84.69,65.69Z" />
    </svg>
  );
}

export default function Comunidad() {
  return (
    <Section id="comunidad" title="Comunidad">
      <div className="max-w-7xl mx-auto grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(240px,0.85fr)] items-stretch">
        <a
          href={comunidad.discordLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block overflow-hidden p-6 md:p-8 transition-all duration-300 hover:opacity-90 border border-solid border-terminal-border bg-transparent !border-b-terminal-border !border-b"
        >
          <div className="relative z-10 flex flex-col h-full items-center justify-center text-center gap-5">
            <div className="max-w-3xl flex flex-col items-center">
              <div className="inline-flex rounded-sm border border-[#e0b0ff] bg-transparent px-4 py-2.5">
                <h3 className="text-2xl md:text-3xl font-semibold text-[#e0b0ff] font-mono leading-tight">
                  {comunidad.serverName}
                </h3>
              </div>
              <p className="mt-4 text-sm md:text-[15px] leading-relaxed text-gray-300 font-mono max-w-2xl">
                {comunidad.description}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-1.5 pt-2">
              {comunidad.technologies.map((tech) => (
                <span
                  key={tech.name}
                  className="px-2 py-0.5 text-[10px] tracking-wide transition-colors duration-200"
                  style={{
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: tech.borderColor,
                    color: tech.textColor,
                    backgroundColor: `${tech.borderColor}1F`,
                  }}
                >
                  {tech.name}
                </span>
              ))}
            </div>

            <div className="pt-1">
              <span className="inline-flex items-center gap-2 rounded-sm border border-terminal-border bg-transparent hover:bg-white/5 px-4 py-2 text-xs font-mono text-gray-100 transition-colors">
                <DiscordIcon />
                Join Discord
              </span>
            </div>
          </div>
        </a>

        <div className="relative overflow-hidden min-h-[260px] md:min-h-[320px] border border-terminal-border bg-transparent">
          <img
            src="/picture/perfil-comunity.webp"
            alt="Perfil de la comunidad"
            className="relative z-10 h-full w-full object-cover object-center"
          />
        </div>
      </div>
    </Section>
  );
}
