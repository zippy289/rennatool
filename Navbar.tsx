// src/app/page.tsx
//
// This is a Next.js App Router Server Component.
// The mock data in FeaturedListings will be replaced by a real
// Prisma query once the database is connected — see the comment below.

import { Navbar }           from '@/components/layout/Navbar';
import { Footer }           from '@/components/layout/Footer';
import { HeroSearch }       from '@/components/search/HeroSearch';
import { HeroToolPreview }  from '@/components/home/HeroToolPreview';
import { StatsStrip }       from '@/components/home/StatsStrip';
import { CategoryGrid }     from '@/components/home/CategoryGrid';
import { FeaturedListings } from '@/components/home/FeaturedListings';
import { HowItWorks }       from '@/components/home/HowItWorks';
import { OwnerCTA }         from '@/components/home/OwnerCTA';
import { TrustSection }     from '@/components/home/TrustSection';

// ─── Optional: real data fetch (uncomment when DB is ready) ──────────────────
//
// import { prisma } from '@/lib/db';
// import type { ToolCardData } from '@/components/tools/ToolCard';
//
// async function getFeaturedTools(): Promise<ToolCardData[]> {
//   const tools = await prisma.tool.findMany({
//     where: { available: true },
//     include: { images: { where: { isPrimary: true }, take: 1 } },
//     orderBy: { createdAt: 'desc' },
//     take: 6,
//   });
//   return tools.map((t) => ({
//     id:            t.id,
//     name:          t.name,
//     description:   t.description,
//     category:      t.category,
//     city:          t.city,
//     state:         t.state,
//     dailyRate:     t.dailyRate,
//     depositAmount: t.depositAmount,
//     imageUrl:      t.images[0]?.url,
//     rating:        undefined,   // add avg rating query if needed
//     reviewCount:   undefined,
//   }));
// }

export const metadata = {
  title: 'Rennatool — Rent Tools Near You',
  description:
    'Find and rent tools in your neighborhood. Power tools, garden equipment, construction gear — available by the day.',
};

export default async function HomePage() {
  // const tools = await getFeaturedTools(); // ← enable when DB is ready

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-ink overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-16 pb-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">

            {/* Left: copy + search */}
            <div>
              {/* Eyebrow */}
              <div
                className="inline-flex items-center gap-2 mb-6 text-brand text-[11px] uppercase tracking-[0.12em] animate-fade-up"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                <span className="block w-6 h-px bg-brand" />
                Tool rental marketplace
              </div>

              {/* Headline */}
              <h1
                className="
                  text-[clamp(48px,6vw,76px)] font-black text-[#F5F0E8]
                  leading-[1.0] tracking-tight mb-6
                  animate-fade-up delay-100
                "
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Rent the tool.<br />
                <em className="text-brand not-italic">Skip the store.</em>
              </h1>

              {/* Sub */}
              <p className="text-[16px] text-[#9A8E80] font-light leading-relaxed mb-8 max-w-[400px] animate-fade-up delay-200">
                Borrow exactly what you need from neighbors in your zip code.
                List what you own and earn while it sits in the garage.
              </p>

              {/* Search bar */}
              <div className="animate-fade-up delay-300">
                <HeroSearch />
              </div>

              {/* Trust ticks */}
              <div className="flex flex-wrap gap-4 mt-5 text-[12px] text-[#6B5E52] animate-fade-up delay-400">
                {['No membership fees', 'Verified owners', 'Deposit protection'].map((t) => (
                  <span key={t}>
                    <span className="text-brand mr-1">✓</span>{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: preview cards */}
            <div className="hidden lg:block animate-fade-up delay-200">
              <HeroToolPreview />
            </div>
          </div>
        </div>

        {/* Stats strip — bleeds full width */}
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <StatsStrip />
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────────────── */}
      <section className="py-16 bg-canvas">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="flex items-baseline justify-between mb-7">
            <h2
              className="text-[28px] font-bold tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Browse by category
            </h2>
            <a href="/search" className="text-[13px] text-brand hover:underline font-medium">
              View all →
            </a>
          </div>
          <CategoryGrid />
        </div>
      </section>

      {/* ── Featured listings ─────────────────────────────────────────────── */}
      {/* Pass tools={tools} once the DB fetch above is enabled */}
      <FeaturedListings />

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <HowItWorks />

      {/* ── Owner earn CTA ────────────────────────────────────────────────── */}
      <OwnerCTA />

      {/* ── Trust pillars ─────────────────────────────────────────────────── */}
      <TrustSection />

      <Footer />
    </div>
  );
}
