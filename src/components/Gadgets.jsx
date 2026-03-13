import { useState, useEffect, useRef } from 'react';
import Section from './Section';

// ── Gadget 1: Contador de ciberataques en tiempo real ──
// ~2,200 ataques/segundo globalmente (fuente: Cybersecurity Ventures)
function CyberAttackCounter() {
  const ATTACKS_PER_SEC = 2200;
  // Ataques estimados desde inicio del año 2026
  const BASE_DATE = new Date('2026-01-01T00:00:00Z');
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => {
      const elapsed = (Date.now() - BASE_DATE.getTime()) / 1000;
      setCount(Math.floor(elapsed * ATTACKS_PER_SEC));
    };
    update();
    const id = setInterval(update, 50);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[130px] text-center" style={{
      border: '1.5px solid #ef4444',
      background: 'rgba(239,68,68,0.05)',
    }}>
      <span className="text-[9px] uppercase tracking-widest text-terminal-fg mb-2">
        Ataques a sitios web (2026)
      </span>
      <span className="text-xl sm:text-2xl font-bold tracking-tight tabular-nums text-red-400">
        {count.toLocaleString('en-US')}
      </span>
      <span className="text-[8px] text-terminal-fg mt-1.5 opacity-80">
        ~2,200/seg • Fuente: Cybersecurity Ventures
      </span>
    </div>
  );
}

// ── Gadget 2: Tiempo sin nuevo capítulo de Go-Tōbun no Hanayome ──
function QuintupletTimer() {
  // Último capítulo (#122) publicado el 19 de febrero de 2020
  const LAST_CHAPTER = new Date('2020-02-19T00:00:00Z');
  const [elapsed, setElapsed] = useState({ years: 0, months: 0, days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      let years = now.getFullYear() - LAST_CHAPTER.getFullYear();
      let months = now.getMonth() - LAST_CHAPTER.getMonth();
      let days = now.getDate() - LAST_CHAPTER.getDate();
      let hours = now.getHours() - LAST_CHAPTER.getHours();
      let mins = now.getMinutes() - LAST_CHAPTER.getMinutes();
      let secs = now.getSeconds() - LAST_CHAPTER.getSeconds();

      if (secs < 0) { secs += 60; mins--; }
      if (mins < 0) { mins += 60; hours--; }
      if (hours < 0) { hours += 24; days--; }
      if (days < 0) { const prev = new Date(now.getFullYear(), now.getMonth(), 0).getDate(); days += prev; months--; }
      if (months < 0) { months += 12; years--; }

      setElapsed({ years, months, days, hours, mins, secs });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[130px] text-center" style={{
      border: '1.5px solid transparent',
      background: 'linear-gradient(#0a0a0a, #0a0a0a) padding-box, linear-gradient(135deg, #E8845C, #E8845C, #EB7B94, #5DBAE0, #F3C553, #59C196) border-box',
    }}>
      <span className="text-[9px] uppercase tracking-widest text-terminal-fg mb-2">
        Sin nuevo capítulo de
      </span>
      <span className="text-[10px] sm:text-xs font-bold tracking-wide text-terminal-fg mb-1">
        Go-Tōbun no Hanayome
      </span>
      <div className="flex gap-2 text-terminal-accent tabular-nums">
        <div className="text-center">
          <span className="block text-lg sm:text-xl font-bold">{elapsed.years}</span>
          <span className="text-[7px] uppercase tracking-widest text-terminal-fg">años</span>
        </div>
        <span className="text-lg text-terminal-fg">:</span>
        <div className="text-center">
          <span className="block text-lg sm:text-xl font-bold">{elapsed.months}</span>
          <span className="text-[7px] uppercase tracking-widest text-terminal-fg">meses</span>
        </div>
        <span className="text-lg text-terminal-fg">:</span>
        <div className="text-center">
          <span className="block text-lg sm:text-xl font-bold">{elapsed.days}</span>
          <span className="text-[7px] uppercase tracking-widest text-terminal-fg">días</span>
        </div>
        <span className="text-lg text-terminal-fg">:</span>
        <div className="text-center">
          <span className="block text-lg sm:text-xl font-bold">{String(elapsed.hours).padStart(2,'0')}</span>
          <span className="text-[7px] uppercase tracking-widest text-terminal-fg">hrs</span>
        </div>
        <span className="text-lg text-terminal-fg">:</span>
        <div className="text-center">
          <span className="block text-lg sm:text-xl font-bold">{String(elapsed.mins).padStart(2,'0')}</span>
          <span className="text-[7px] uppercase tracking-widest text-terminal-fg">min</span>
        </div>
        <span className="text-lg text-terminal-fg">:</span>
        <div className="text-center">
          <span className="block text-lg sm:text-xl font-bold">{String(elapsed.secs).padStart(2,'0')}</span>
          <span className="text-[7px] uppercase tracking-widest text-terminal-fg">seg</span>
        </div>
      </div>
      <span className="text-[8px] text-terminal-fg mt-1.5 opacity-80">
        Cap. #122 — 19 Feb 2020
      </span>
    </div>
  );
}

// ── Gadget 3: Último resultado del FC Barcelona ──
const BARCA_API = 'https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=133739';

function BarcaLastMatch() {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(BARCA_API)
      .then((r) => r.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          setMatch(data.results[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="geo-card p-4 flex items-center justify-center min-h-[130px] text-terminal-fg text-xs">
        Cargando...
      </div>
    );
  }

  if (!match) {
    return (
      <div className="geo-card p-4 flex items-center justify-center min-h-[130px] text-terminal-fg text-xs">
        Sin datos disponibles
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[130px] text-center" style={{
      border: '1.5px solid transparent',
      background: 'linear-gradient(#0a0a0a, #0a0a0a) padding-box, linear-gradient(135deg, #004D98, #A50044, #004D98, #A50044) border-box',
    }}>
      <div className="flex items-center gap-3 my-2">
        <div className="flex flex-col items-center gap-1">
          {match.strHomeTeamBadge && (
            <img src={match.strHomeTeamBadge} alt={match.strHomeTeam} className="w-8 h-8 object-contain" />
          )}
          <span className="text-[9px] uppercase tracking-widest text-terminal-fg font-bold">
            {match.strHomeTeam}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-terminal-accent">{match.intHomeScore}</span>
          <span className="text-lg text-terminal-fg">-</span>
          <span className="text-2xl sm:text-3xl font-bold text-terminal-accent">{match.intAwayScore}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          {match.strAwayTeamBadge && (
            <img src={match.strAwayTeamBadge} alt={match.strAwayTeam} className="w-8 h-8 object-contain" />
          )}
          <span className="text-[9px] uppercase tracking-widest text-terminal-fg font-bold">
            {match.strAwayTeam}
          </span>
        </div>
      </div>
      <span className="text-[8px] text-terminal-fg opacity-80">
        {match.strVenue || 'Venue N/A'} — {match.strStatus}
      </span>
    </div>
  );
}

export default function Gadgets() {
  return (
    <Section id="gadgets" title="[GADGETS]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <CyberAttackCounter />
        <QuintupletTimer />
        <BarcaLastMatch />
      </div>
    </Section>
  );
}
