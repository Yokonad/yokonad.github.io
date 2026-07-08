import React, { useEffect, useRef, useState } from 'react';

// Cada comando con su comentario explicando para qué sirve.
const SCRIPT = [
  { c: 'comment', t: '# conectarte a la VPN de Hack The Box\n' },
  { c: 'cmd', t: '$ sudo openvpn lab_yokonad.ovpn\n' },
  { c: 'comment', t: '# comprobar que llegas a la máquina objetivo\n' },
  { c: 'cmd', t: '$ ping -c1 10.10.10.10' },
];
const COLOR = { comment: '#8b8b93', cmd: '#f4f4f5' };
const FULL = SCRIPT.reduce((n, tok) => n + tok.t.length, 0);

// Carácter y clase en la posición global `pos` (1-indexado).
function at(pos) {
  let idx = pos;
  for (const tok of SCRIPT) {
    if (idx <= tok.t.length) return { ch: tok.t.charAt(idx - 1), c: tok.c };
    idx -= tok.t.length;
  }
  return { ch: '', c: '' };
}

export default function HtbTerminal() {
  const [n, setN] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    let count = 0;
    const tick = () => {
      if (count >= FULL) return;
      count += 1;
      setN(count);
      const { ch, c } = at(count);
      const delay = ch === '\n' ? 220 : c === 'cmd' ? 42 : 14;
      timer.current = setTimeout(tick, delay);
    };
    timer.current = setTimeout(tick, 350);
    return () => clearTimeout(timer.current);
  }, []);

  const spans = [];
  let remaining = n;
  for (let i = 0; i < SCRIPT.length && remaining > 0; i += 1) {
    const tok = SCRIPT[i];
    const take = Math.min(tok.t.length, remaining);
    spans.push(
      <span key={i} style={{ color: COLOR[tok.c] }}>
        {tok.t.slice(0, take)}
      </span>
    );
    remaining -= take;
  }

  return (
    <div className="win">
      <div className="win-bar" style={{ background: '#000000', color: '#f4f4f5' }}>
        <span>root@yokonad: ~/htb</span>
        <span className="win-btns">
          <i></i>
          <i></i>
          <i></i>
        </span>
      </div>
      <div
        style={{
          background: '#000000',
          color: '#f4f4f5',
          fontFamily: "'IBM Plex Mono', monospace",
          whiteSpace: 'pre-wrap',
          lineHeight: 1.7,
          minHeight: '128px',
          padding: '1rem',
          fontSize: '13px',
        }}
      >
        {spans}
        <span className="term-cursor" />
      </div>
    </div>
  );
}
