import Header from './components/Header';
import UserProfile from './components/UserProfile';
import Contact from './components/Contact';
import Certificates from './components/Certificates';
import TextBlocks from './components/TextBlocks';
import InfoBlocks from './components/InfoBlocks';
import Gadgets from './components/Gadgets';
import Projects from './components/Projects';
import Team from './components/Team';
import Music from './components/Music';
import Footer from './components/Footer';
import TriangleBackground from './components/TriangleBackground';

export default function App() {
  return (
    <div className="scanlines crt-vignette min-h-screen relative">
      <TriangleBackground />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <UserProfile />
          <Contact />
          <Certificates />
          <TextBlocks />
          <InfoBlocks />
          <Gadgets />
          <Projects />
          <Team />
          <Music />
        </main>

        <Footer />
      </div>
    </div>
  );
}
