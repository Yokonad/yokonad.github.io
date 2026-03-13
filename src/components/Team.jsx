import Section from './Section';
import ImagePlaceholder from './ImagePlaceholder';
import { team, teamName, teamDescription } from '../data/content';

const tagColors = {
  Python:      { border: '#3776AB', bg: 'rgba(55,118,171,0.12)',  text: '#60A5FA' },
  Android:     { border: '#3DDC84', bg: 'rgba(61,220,132,0.12)',  text: '#3DDC84' },
  Streaming:   { border: '#9146FF', bg: 'rgba(145,70,255,0.12)',  text: '#A78BFA' },
  Frontend:    { border: '#F97316', bg: 'rgba(249,115,22,0.12)',  text: '#F97316' },
  'UI/UX':     { border: '#EC4899', bg: 'rgba(236,72,153,0.12)',  text: '#F472B6' },
  Cisco:       { border: '#1BA0D7', bg: 'rgba(27,160,215,0.12)',  text: '#1BA0D7' },
  HTML:        { border: '#E34F26', bg: 'rgba(227,79,38,0.12)',   text: '#E34F26' },
  JavaScript:  { border: '#F7DF1E', bg: 'rgba(247,223,30,0.12)',  text: '#F7DF1E' },
};

function MemberCard({ name, role, bio, avatar, tags }) {
  return (
    <div className="geo-card p-4 flex flex-col items-center text-center h-full">
      {/* Imagen cuadrada */}
      <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 mb-2.5 overflow-hidden border border-terminal-border">
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        ) : (
          <ImagePlaceholder src={null} alt={name} size="full" />
        )}
      </div>

      {/* Nombre + rol con altura fija para alinear */}
      <div className="flex-shrink-0">
        <h3 className="text-sm sm:text-base font-bold tracking-wide">{name}</h3>
        <span className="inline-block mt-1 mb-2 px-3 py-0.5 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold border border-red-500/60 text-red-400 bg-red-500/10">
          {role}
        </span>
      </div>
      <hr className="retro-hr w-12 mb-2" />
      <p className="text-xs sm:text-sm text-terminal-dim mb-3 flex-1">{bio}</p>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 mt-auto">
          {tags.map((tag) => {
            const c = tagColors[tag];
            return (
              <span
                key={tag}
                className="px-2 py-0.5 text-[9px] tracking-wide"
                style={c ? {
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: c.border,
                  backgroundColor: c.bg,
                  color: c.text,
                } : { border: '1px solid #333', color: '#666' }}
              >
                {tag}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Team() {
  return (
    <Section id="equipo" title="Equipo">
      {/* Nombre del equipo centrado */}
      <div className="text-center mb-5">
        <h2 className="text-2xl md:text-3xl font-bold tracking-wider uppercase">
          {teamName}
        </h2>
        <div className="mt-2 flex items-center justify-center gap-2 text-terminal-dim text-xs">
          <span>{'█'.repeat(8)}</span>
          <span className="tracking-widest">•••</span>
          <span>{'█'.repeat(8)}</span>
        </div>
      </div>
      
      <p className="text-sm text-terminal-fg mb-4 max-w-2xl mx-auto text-center">
        {teamDescription}
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {team.map((member) => (
          <MemberCard key={member.name} {...member} />
        ))}
      </div>
    </Section>
  );
}
