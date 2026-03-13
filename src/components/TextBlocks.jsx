import { useState, useEffect } from 'react';

const GITHUB_USER = 'Yokonad';
const API_URL = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`;

const LEVEL_COLORS = [
  'bg-[#161b22]',   // 0 - ninguna
  'bg-[#0e4429]',   // 1 - poca
  'bg-[#006d32]',   // 2 - media
  'bg-[#26a641]',   // 3 - alta
  'bg-[#39d353]',   // 4 - máxima
];

const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Convierte la respuesta de la API en semanas de 7 días con niveles 0-4
function parseContributions(data) {
  const contribs = data.contributions || [];
  if (!contribs.length) return { weeks: [], total: 0, months: [] };

  // Agrupar por semana (Dom = inicio de semana)
  const weeks = [];
  let currentWeek = [];

  // Rellenar días vacíos al inicio para alinear con el día de la semana
  const firstDate = new Date(contribs[0].date);
  const startDay = firstDate.getDay(); // 0=Dom
  for (let i = 0; i < startDay; i++) currentWeek.push(0);

  contribs.forEach((c) => {
    const level = c.level || 0;
    currentWeek.push(level);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(0);
    weeks.push(currentWeek);
  }

  // Calcular etiquetas de meses
  const months = [];
  let lastMonth = -1;
  weeks.forEach((_, wi) => {
    const dayIndex = wi * 7 - startDay;
    if (dayIndex >= 0 && dayIndex < contribs.length) {
      const d = new Date(contribs[dayIndex].date);
      const m = d.getMonth();
      if (m !== lastMonth) {
        months.push({ label: SHORT_MONTHS[m], pos: wi });
        lastMonth = m;
      }
    }
  });

  return { weeks, total: data.total?.lastYear || contribs.length, months };
}

export default function TextBlocks() {
  const [weeks, setWeeks] = useState([]);
  const [total, setTotal] = useState(0);
  const [months, setMonths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((r) => r.json())
      .then((data) => {
        const parsed = parseContributions(data);
        setWeeks(parsed.weeks);
        setTotal(parsed.total);
        setMonths(parsed.months);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full py-5 md:py-7">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Calendario de contribuciones */}
        <div className="md:col-span-4 border border-terminal-border p-3 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] sm:text-xs text-terminal-fg tracking-widest uppercase font-bold">
              <a href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noopener noreferrer" className="hover:text-terminal-accent">
                yokonad
              </a>
            </p>
            <span className="text-[9px] sm:text-[10px] text-terminal-dim">
              {loading ? '...' : `${total} contributions`}
            </span>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center text-terminal-dim text-xs">
              Cargando contribuciones...
            </div>
          ) : weeks.length > 0 ? (
            <>
              {/* Meses */}
              <div className="relative h-3 mb-1">
                {months.map((m, i) => (
                  <span
                    key={i}
                    className="absolute text-[8px] sm:text-[9px] text-terminal-dim"
                    style={{ left: `${(m.pos / weeks.length) * 100}%` }}
                  >
                    {m.label}
                  </span>
                ))}
              </div>

              {/* Grid de contribuciones */}
              <div className="flex gap-[2px]">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[2px] flex-1">
                    {week.map((level, di) => (
                      <div
                        key={di}
                        className={`aspect-square rounded-[1px] ${LEVEL_COLORS[level] || LEVEL_COLORS[0]}`}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Leyenda */}
              <div className="flex items-center justify-end gap-1 mt-2">
                <span className="text-[8px] text-terminal-dim mr-1">Less</span>
                {LEVEL_COLORS.map((c, i) => (
                  <div key={i} className={`w-[8px] h-[8px] rounded-[1px] ${c}`} />
                ))}
                <span className="text-[8px] text-terminal-dim ml-1">More</span>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-terminal-dim text-xs">
              No se pudieron cargar las contribuciones
            </div>
          )}
        </div>

        {/* Imagen derecha — más pequeña */}
        <div className="md:col-span-1 border border-terminal-border overflow-hidden flex items-center justify-center">
          <img
            src="/picture/none.webp"
            alt="Pixel art"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
