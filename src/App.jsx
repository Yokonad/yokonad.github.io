import Header from './components/Header';
import UserProfile from './components/UserProfile';
import Contact from './components/Contact';
import TextBlocks from './components/TextBlocks';
import InfoBlocks from './components/InfoBlocks';
import Informacion from './components/Informacion';
import Projects from './components/Projects';
import Team from './components/Team';
import Comunidad from './components/Comunidad';
import Music from './components/Music';
import Footer from './components/Footer';
import PixelBackground from './components/PixelBackground';

export default function App() {
  return (
    <div className="scanlines crt-vignette min-h-screen relative">
      <PixelBackground />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <UserProfile />
          <Contact />
          <TextBlocks />
          <Informacion />
          <Projects />
          <Team />
          <InfoBlocks />
          <Comunidad />
          <Music />
        </main>

        <Footer />
      </div>
    </div>
  );
}
