import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/layout/Hero';
import Features from '../components/layout/Features';
import MockupDisplay from '../components/layout/MockupDisplay';
import CallToAction from '../components/layout/CallToAction';
import Footer from '../components/layout/Footer';
import WaveBackground from '../components/layout/WaveBackground';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#0A0A10] text-white overflow-hidden">
      <WaveBackground />

      <Navbar />

      <main>
        <Hero navigate={navigate} />

        <div className="relative">
          <MockupDisplay />
          <Features />
        </div>

        <CallToAction navigate={navigate} />
      </main>

      <Footer />
    </div>
  );
};

export default Home;