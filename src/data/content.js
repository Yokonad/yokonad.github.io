// ── Datos del portafolio ──
// Edita este archivo para personalizar el contenido que se renderiza.

export const profile = {
  avatar: '/picture/yokonad.webp',
  location: 'Perú',
  links: [
    { label: 'GitHub', url: 'https://github.com/Yokonad' },
    { label: 'Instagram', url: 'https://www.instagram.com/yk.nadrr/' },
    { label: 'Discord', url: 'https://discord.com/users/773971588054908928' },
    { label: 'Email', url: 'mailto:danramos939@gmail.com' },
  ],
};

// ── Proyectos ──
export const projects = [
  {
    title: 'Subneteo VLSM',
    description:
      'Calculadora de subredes VLSM y enlaces punto a punto /30 entre routers. Valida direcciones IP, calcula máscaras, wildcards y asigna direcciones de forma óptima desde una interfaz interactiva en consola.',
    tags: ['Python', 'Networking', 'CLI'],
    url: 'https://github.com/Yokonad/Subneteo-VLSM',
  },
  {
    title: 'MCP Gemini Packet',
    description:
      'Proyecto MCP orientado a flujos con Gemini y Packet Tracer para automatizar tareas y mejorar procesos de trabajo técnico.',
    tags: ['TypeScript', 'Node.js', 'MCP', 'Packet Tracer'],
    url: 'https://github.com/Yokonad/mcp-gemini-packet.git',
  },
  {
    title: 'Calculadora Resistencias',
    description:
      'Calculadora profesional de resistencias electrónicas por código de colores. Soporta resistencias de 4, 5 y 6 bandas con tolerancia, coeficiente térmico, historial de cálculos y valores comerciales cercanos.',
    tags: ['Python', 'Electrónica', 'CLI'],
    url: 'https://github.com/Yokonad/Calculadora-Resistencias',
  },
];

// ── Equipo ──
export const teamName = 'KOROSOFT TEAM';
export const teamDescription =
  'Formo parte de un grupo privado de desarrollo donde colaboramos en proyectos innovadores de software, ciberseguridad y desarrollo web. Cada uno aporta su experiencia única para crear soluciones personalizadas y herramientas de código abierto.';

export const team = [
  {
    name: 'LoonBac21',
    role: 'Co-Owner & Lead Dev',
    bio: 'Especializado en programación Python y fan de la ciberseguridad, planificador y organizador.',
    avatar: '/picture/loonbac.webp',
    tags: ['Python', 'Android', 'Streaming'],
  },
  {
    name: 'Insent1208',
    role: 'Frontend Engineer',
    bio: 'Especialista en UI/UX FrontEnd y Diseño Gráfico enfocado en mejorar la experiencia de usuario. Creativo y detallista.',
    avatar: '/picture/insent.webp',
    tags: ['Frontend', 'Python', 'UI/UX'],
  },
  {
    name: 'Yokonad',
    role: 'Owner & Fullstack Dev',
    bio: 'Experto en desarrollo web completo y arquitecturas escalables. Especialista en React y Node.js.',
    avatar: '/picture/perfil_equipo.webp',
    tags: ['Cisco', 'HTML', 'JavaScript'],
  },
];

// ── Comunidad ──
export const comunidad = {
  serverName: 'KoroSoft Community',
  description:
    'Un ecosistema técnico especializado en el desarrollo de software avanzado y la orquestación de agentes de IA, diseñado para quienes buscan integrar inteligencia autónoma en sistemas de alto rendimiento.',
  discordLink: 'https://discord.gg/8hzrg5UEsU',
};
