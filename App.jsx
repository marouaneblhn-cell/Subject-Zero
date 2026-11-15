import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import RecentWorks from './components/RecentWorks';
import Services from './components/Services';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="relative" style={{ backgroundColor: '#0d1116' }}>
      <Navbar />
      <main>
        <Hero />
        <About />
        <RecentWorks />
        <Services />
        <Footer />
      </main>
    </div>
  );
}
