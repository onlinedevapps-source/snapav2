import dynamic from 'next/dynamic';
import HeroSection from '@/components/HeroSection';
import { ServicesSection, AboutSection, ContactSection } from '@/components/Sections';
import HorizontalWrapper from '@/components/HorizontalWrapper';

// No SSR for particles
const HeroParticles = dynamic(() => import('@/components/HeroParticles'), {
  ssr: false
});

/**
 * Main Page
 * ---------
 * Implements a unified horizontal layout with a fixed WebGL particle background.
 */
export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#FF3D00]">
      {/* Fixed global background layer */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <HeroParticles />
      </div>

      {/* Content Layer (Horizontal Scroll) */}
      <HorizontalWrapper>
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <ContactSection />
      </HorizontalWrapper>
    </main>
  );
}
