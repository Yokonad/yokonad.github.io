// ── Datos centralizados del portafolio ──
// Edita este archivo para personalizar todo el contenido.

export const profile = {
  name: 'Dan Ramos Reynaldo',
  role: 'Estudiante de Ciberseguridad — SENATI | 6to Ciclo',
  avatar: '/picture/perfil.jpg',
  bio: [
    '> Apodo: yokonad',
    '> Estudiante de Ciberseguridad en SENATI, cursando el sexto ciclo.',
    '> Uso principalmente Windows 11, aunque también trabajo con Arch Linux, Fedora, Debian, Ubuntu y FreeBSD.',
    '> Me apasiona la programación y las redes — practico con Cisco Packet Tracer para aprender más sobre infraestructura de red.',
    '> Gran fan del anime. Y la música… la música es mi dios. Me encanta mucho, mucho. Es parte esencial de mi día a día.',
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
    image: '/picture/proyecto1.jpg',
    url: 'https://github.com/Yokonad/Subneteo-VLSM',
  },
  {
    title: 'PS2 Launcher',
    description: 'Interfaz gráfica para gestionar y ejecutar juegos de PlayStation 2 mediante PCSX2. Detecta controladores automáticamente y los configura como DualShock2. Incluye instalador con extracción de BIOS y selector de ROMs.',
    tags: ['Python', 'PCSX2', 'GUI'],
    image: '/picture/proyecto2.jpg',
    url: 'https://github.com/Yokonad/PS2-Launcher',
  },
  {
    title: 'Calculadora Resistencias',
    description: 'Calculadora profesional de resistencias electrónicas por código de colores. Soporta resistencias de 4, 5 y 6 bandas con tolerancia, coeficiente térmico, historial de cálculos y valores comerciales cercanos.',
    tags: ['Python', 'Electrónica', 'CLI'],
    image: '/picture/proyecto3.jpg',
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
    avatar: '/picture/insent.jpg',
    tags: ['Frontend', 'Python', 'UI/UX'],
  },
  {
    name: 'Yokonad',
    role: 'Owner de KoroSoft Code',
    bio: 'Experto en desarrollo web completo y arquitecturas escalables. Especialista en React y Node.js.',
    avatar: '/picture/yokonad.jpg',
    tags: ['Cisco', 'HTML', 'JavaScript'],
  },
];

// ── Bloques de información extra ──
export const infoBlocks = [
  {
    title: 'Hecha con',
    text: 'Esta página está hecha con mucho Monster y música hermosa.',
  },
  {
    title: 'Artistas Favoritos',
    text: 'Fito Páez, Wos y Oasis. Su música me acompaña siempre.',
    special: true,
  },
  {
    title: 'Actualmente',
    text: 'Estudiando Ciberseguridad, practicando redes en Packet Tracer y escuchando música.',
  },
];

export const contact = {
  heading: 'Contacto',
  text: '¿Quieres colaborar o tienes alguna pregunta? Escríbeme.',
  email: 'danramos939@gmail.com',
};

export const footer = {
  text: `© ${new Date().getFullYear()} — Hecho con código y café.`,
};
