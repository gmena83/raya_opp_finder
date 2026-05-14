import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { LiveWorkflow } from './components/LiveWorkflow';
import { DiscoveryDashboard } from './components/DiscoveryDashboard';
import { LearningHub } from './components/LearningHub';
import { TechStack } from './components/TechStack';
import { FolderStructure } from './components/FolderStructure';
import { Footer } from './components/Footer';

function App() {

  const scrollToDashboard = () => {
    const el = document.getElementById('dashboard');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', color: 'var(--color-ink)' }}>
      <Navbar onSubmitClick={scrollToDashboard} />
      <Hero onOpenDemo={scrollToDashboard} />
      <HowItWorks />
      <LiveWorkflow />
      <DiscoveryDashboard />
      <LearningHub />
      <TechStack />
      <FolderStructure />
      <Footer />
    </div>
  );
}

export default App;
