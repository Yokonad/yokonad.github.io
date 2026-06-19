// ── Datos centralizados del portafolio ──
// Edita este archivo para personalizar todo el contenido.

export const profile = {
  name: 'Dan Ramos Reynaldo',
  role: 'Estudiante de Ciberseguridad — SENATI | 6to Ciclo',
  avatar: '/picture/yokonad.webp',
  bio: [
    '> Apodo: yokonad',
    '> Estudiante de Ciberseguridad en SENATI, cursando el sexto ciclo.',
    '> Uso principalmente Windows 11, aunque también trabajo con Arch Linux, Fedora, Debian, Ubuntu y FreeBSD.',
    '> Me apasiona la programación y las redes — practico con Cisco Packet Tracer para aprender más sobre infraestructura de red.',
    '> Gran fan del anime y su arte. Y la músic me encanta mucho, mucho. Es parte esencial de mi día a día.',
  ],
  location: 'Perú',
  experience: '6to Ciclo — SENATI',
  os: [
    'Windows 11', 'Arch Linux', 'Fedora', 'Debian', 'Ubuntu',
    '& many more being tested',
  ],
  skills: ['Windows 11', 'Arch Linux', 'Fedora', 'Debian', 'Ubuntu'],
  languages: ['JavaScript', 'React', 'Node.js', 'Python', 'CSS', 'Git'],
  links: [
    { label: 'GitHub', url: 'https://github.com/Yokonad' },
    { label: 'Instagram', url: 'https://www.instagram.com/yk.nadrr/' },
    { label: 'Discord', url: 'https://discord.com/users/773971588054908928' },
    { label: 'Email', url: 'mailto:danramos939@gmail.com' },
  ],
};

// ── Bloques de estadísticas / datos rápidos ──
export const stats = [
  { value: '+6', label: 'Proyectos completados' },
  { value: '+3', label: 'Años de experiencia' },
  { value: '4', label: 'Tecnologías dominadas' },
  { value: '∞', label: 'Horas de música escuchada' },
];

export const projects = [
  {
    title: 'Subneteo VLSM',
    description: 'Calculadora de subredes VLSM y enlaces punto a punto /30 entre routers. Valida direcciones IP, calcula máscaras, wildcards y asigna direcciones de forma óptima desde una interfaz interactiva en consola.',
    tags: ['Python', 'Networking', 'CLI'],
    image: '/picture/proyecto1.webp',
    url: 'https://github.com/Yokonad/Subneteo-VLSM',
  },
  {
    title: 'MCP Gemini Packet',
    description: 'Proyecto MCP orientado a flujos con Gemini y Packet Tracer para automatizar tareas y mejorar procesos de trabajo técnico.',
    tags: ['TypeScript', 'Node.js', 'MCP', 'Packet Tracer'],
    image: '/picture/proyecto2.webp',
    url: 'https://github.com/Yokonad/mcp-gemini-packet.git',
  },
  {
    title: 'Calculadora Resistencias',
    description: 'Calculadora profesional de resistencias electrónicas por código de colores. Soporta resistencias de 4, 5 y 6 bandas con tolerancia, coeficiente térmico, historial de cálculos y valores comerciales cercanos.',
    tags: ['Python', 'Electrónica', 'CLI'],
    image: '/picture/proyecto3.webp',
    url: 'https://github.com/Yokonad/Calculadora-Resistencias',
  },
];

// ── Equipo ──
export const teamName = 'KOROSOFT TEAM';
export const teamDescription = 'Formo parte de un grupo privado de desarrollo donde colaboramos en proyectos innovadores de software, ciberseguridad y desarrollo web. Cada uno aporta su experiencia única para crear soluciones personalizadas y herramientas de código abierto.';

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
    role: 'Owner de KoroSoft Code',
    bio: 'Experto en desarrollo web completo y arquitecturas escalables. Especialista en React y Node.js.',
    avatar: '/picture/perfil_equipo.webp',
    tags: ['Cisco', 'HTML', 'JavaScript'],
  },
];

// ── Bloques de información extra ──
export const infoBlocks = [
  {
    title: 'Hecha con',
    text: 'Esta página está hecha con mucho Monster y horas de musica.',
  },
  {
    title: 'Artistas Favoritos',
    text: 'Fito Páez, Wos, Oasis, Jaze, Gustavo Cerati, Enanitos Verdes, Queen.',
    special: true,
  },
  {
    title: 'Actualmente',
    text: 'Estudiando Ciberseguridad, practicando redes en Packet Tracer.',
  },
];

export const comunidad = {
  serverName: 'KoroSoft Community',
  established: 'Est. abr 2026',
  description: 'Korosoft Community es un ecosistema técnico especializado en el desarrollo de software avanzado y la orquestación de agentes de IA, diseñado para quienes buscan integrar inteligencia autónoma en sistemas de alto rendimiento.',
  technologies: [
    { name: 'Python', color: 'transparent', borderColor: '#4DA3FF', textColor: '#FFE66D' },
    { name: 'OpenCode', color: 'transparent', borderColor: '#FFFFFF', textColor: '#FFFFFF' },
    { name: 'Java', color: 'transparent', borderColor: '#FF9F43', textColor: '#FFD166' },
    { name: 'CSS', color: 'transparent', borderColor: '#5B8CFF', textColor: '#7FDBFF' },
    { name: 'Tailwind', color: 'transparent', borderColor: '#22D3EE', textColor: '#67E8F9' },
    { name: 'HTML', color: 'transparent', borderColor: '#FF6B4A', textColor: '#FF9E7A' },
    { name: 'Linux', color: 'transparent', borderColor: '#FFD93D', textColor: '#FFF27A' },
    { name: 'Arch', color: 'transparent', borderColor: '#38BDF8', textColor: '#7DD3FC' },
    { name: 'Ubuntu', color: 'transparent', borderColor: '#FF7A45', textColor: '#FFB26B' },
    { name: 'Go', color: 'transparent', borderColor: '#2DD4FF', textColor: '#A5F3FC' },
    { name: 'npm', color: 'transparent', borderColor: '#FF4D6D', textColor: '#FF8FA3' },
    { name: 'Claude', color: 'transparent', borderColor: '#F4A261', textColor: '#FFD6A5' },
    { name: 'ChatGPT', color: 'transparent', borderColor: '#34D399', textColor: '#6EE7B7' },
    { name: 'DeepSeek', color: 'transparent', borderColor: '#8B5CF6', textColor: '#C084FC' },
  ],
  discordLink: 'https://discord.gg/8hzrg5UEsU',
};

export const contact = {
  heading: 'Contacto',
  text: '¿Quieres colaborar o tienes alguna pregunta? Escríbeme.',
  email: 'danramos939@gmail.com',
};

export const footer = {
  text: `© ${new Date().getFullYear()} — Hecho con código y café.`,
};
