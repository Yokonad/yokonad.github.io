import Section from './Section';
import { infoBlocks } from '../data/content';

export default function InfoBlocks() {
  return (
    <Section id="info" title="Notas">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {infoBlocks.map((block) => (
          <div
            key={block.title}
            className={`p-4 hover:bg-white/[0.03] transition-colors duration-200 ${
              block.special
                ? 'relative rounded-[1px] bg-terminal-bg'
                : 'border border-terminal-border'
            }`}
            style={block.special ? {
              background: 'linear-gradient(#0a0a0a, #0a0a0a) padding-box, linear-gradient(135deg, #f87171, #facc15, #34d399, #60a5fa, #0a0a0a 50%, #0a0a0a 55%, #1e3a5f, #60a5fa) border-box',
              border: '1.5px solid transparent',
            } : undefined}
          >
            <h3 className={`text-xs uppercase tracking-widest mb-2 flex items-center gap-2 ${
              block.special ? 'bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 font-bold' : 'text-terminal-dim'
            }`}>
              <span className={`inline-block w-2 h-2 ${
                block.special ? 'bg-gradient-to-br from-pink-500 to-purple-500 rounded-full' : 'border border-terminal-fg'
              }`} />
              {block.title}
            </h3>
            <p className={`text-xs sm:text-sm ${
              block.special ? 'text-terminal-fg' : 'text-terminal-fg'
            }`}>
              {block.text}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
