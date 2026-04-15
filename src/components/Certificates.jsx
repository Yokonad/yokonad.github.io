import Section from './Section';
import { useEffect, useState } from 'react';
import { certificates } from '../data/content';

export default function Certificates() {
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (certificates.length <= 2) return undefined;

    const intervalId = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % certificates.length);
    }, 3500);

    return () => clearInterval(intervalId);
  }, []);

  const visibleCertificates = [
    certificates[startIndex % certificates.length],
    certificates[(startIndex + 1) % certificates.length],
  ].filter(Boolean);

  return (
    <Section id="certificados" title="Certificados">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visibleCertificates.map((cert, certIndex) => (
          <a
            key={`cert-${cert.url}-${certIndex}`}
            href={cert.url}
            target="_blank"
            rel="noopener noreferrer"
            className="geo-card p-4 sm:p-5 hover:bg-white/[0.03] transition-colors duration-200"
          >
            <p className="text-[10px] uppercase tracking-widest text-terminal-dim mb-1 truncate whitespace-nowrap overflow-hidden">
              {cert.issuer} • {cert.date}
            </p>
            <h3 className="text-sm sm:text-base text-terminal-fg font-bold leading-snug mb-2 truncate whitespace-nowrap overflow-hidden">
              {cert.title}
            </h3>
            <div className="flex gap-1.5 mb-2 overflow-hidden whitespace-nowrap">
              {cert.tags.map((tag, tagIndex) => (
                <span
                  key={`cert-tag-${tag}-${tagIndex}`}
                  className="text-[9px] uppercase tracking-widest border border-terminal-border text-terminal-dim px-2 py-1 shrink-0"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-[10px] text-green-400">Ver certificado PDF →</span>
          </a>
        ))}
      </div>
    </Section>
  );
}