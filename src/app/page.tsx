import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSearch } from '@/components/search/HeroSearch';
import { HeroToolPreview, StatsStrip, CategoryGrid, FeaturedListings, HowItWorks, OwnerCTA, TrustSection } from '@/components/home';
import Link from 'next/link';

export const metadata = {
  title: 'Rennatool — Rent Tools Near You',
  description: 'Find and rent tools in your neighborhood. Power tools, garden equipment, construction gear — available by the day.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="bg-ink overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-16 pb-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div>
              <div className="inline-flex items-center gap-2 mb-6 text-brand text-[11px] uppercase tracking-[0.12em] animate-fade-up" style={{ fontFamily: 'var(--font-mono)' }}>
                <span className="block w-6 h-px bg-brand" /> Tool rental marketplace
              </div>
              <h1 className="text-[clamp(48px,6vw,76px)] font-black text-[#F5F0E8] leading-[1.0] tracking-tight mb-6 animate-fade-up delay-100" style={{ fontFamily: 'var(--font-display)' }}>
                Rent the tool.<br /><em className="text-brand not-italic">Skip the store.</em>
              </h1>
              <p className="text-[16px] text-[#9A8E80] font-light leading-relaxed mb-8 max-w-[400px] animate-fade-up delay-200">
                Borrow exactly what you need from neighbors in your zip code. List what you own and earn while it sits in the garage.
              </p>
              <div className="animate-fade-up delay-300"><HeroSearch /></div>
              <div className="flex flex-wrap gap-4 mt-5 text-[12px] text-[#6B5E52] animate-fade-up delay-400">
                {['No membership fees', 'Verified owners', 'Deposit protection'].map((t) => (
                  <span key={t}><span className="text-brand mr-1">✓</span>{t}</span>
                ))}
              </div>
            </div>
            <div className="hidden lg:block animate-fade-up delay-200"><HeroToolPreview /></div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 lg:px-10"><StatsStrip /></div>
      </section>
      <section className="py-16 bg-canvas">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="flex items-baseline justify-between mb-7">
            <h2 className="text-[28px] font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Browse by category</h2>
            <Link href="/search" className="text-[13px] text-brand hover:underline font-medium">View all →</Link>
          </div>
          <CategoryGrid />
        </div>
      </section>
      <FeaturedListings />
      <HowItWorks />
      <OwnerCTA />
      <TrustSection />
      <Footer />
    </div>
  );
}
