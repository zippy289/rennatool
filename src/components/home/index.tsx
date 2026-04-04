// src/components/home/index.tsx
// All homepage section components exported from one file

import Link from 'next/link';
import { ToolCard, type ToolCardData } from '@/components/tools/ToolCard';

// ─── HeroToolPreview ──────────────────────────────────────────────────────────
const PREVIEW_TOOLS = [
  { icon: '🔧', name: 'DeWalt 20V MAX Drill/Driver Kit', location: 'Beverly Hills, CA', distance: '1.2 mi away', price: '$25/day' },
  { icon: '🪚', name: 'Makita 10" Compound Miter Saw', location: 'Culver City, CA', distance: '2.8 mi away', price: '$45/day' },
  { icon: '💧', name: '3200 PSI Pressure Washer', location: 'Santa Monica, CA', distance: '4.1 mi away', price: '$55/day' },
];

export function HeroToolPreview() {
  return (
    <div className="flex flex-col gap-3">
      {PREVIEW_TOOLS.map((tool, i) => (
        <div key={tool.name} className="bg-ink-2 border border-ink-3 rounded-xl px-4 py-3.5 flex items-center gap-3.5 hover:border-brand transition-all duration-200 animate-fade-up" style={{ animationDelay: `${300 + i * 100}ms`, transform: `translateX(${(2 - i) * 12}px)` }}>
          <div className="w-11 h-11 rounded-xl bg-ink-3 flex items-center justify-center text-xl flex-shrink-0">{tool.icon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-[#F5F0E8] truncate">{tool.name}</p>
            <p className="text-[11px] text-[#6B5E52] mt-0.5">{tool.location} · {tool.distance}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[16px] font-bold text-brand" style={{ fontFamily: 'var(--font-display)' }}>{tool.price}</p>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-medium bg-brand/15 text-brand-muted">Available</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── StatsStrip ───────────────────────────────────────────────────────────────
const STATS = [
  { value: '2,400+', label: 'Tools listed' }, { value: '840+', label: 'Active owners' },
  { value: '180+', label: 'ZIP codes covered' }, { value: '$62', label: 'Avg owner monthly earnings' }, { value: '4.8★', label: 'Average rating' },
];

export function StatsStrip() {
  return (
    <div className="bg-brand mt-14 -mx-6 sm:-mx-10 lg:-mx-16 px-6 sm:px-10 lg:px-16 py-4">
      <div className="max-w-6xl mx-auto flex flex-wrap gap-x-10 gap-y-3 items-center">
        {STATS.map((stat, i) => (
          <div key={stat.label} className="flex items-center gap-10">
            <div className="text-center">
              <div className="text-2xl font-bold text-white leading-none" style={{ fontFamily: 'var(--font-display)' }}>{stat.value}</div>
              <div className="text-[11px] text-white/70 mt-0.5 tracking-wide">{stat.label}</div>
            </div>
            {i < STATS.length - 1 && <div className="w-px h-8 bg-white/25 flex-shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CategoryGrid ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: 'POWER_TOOLS', label: 'Power Tools', icon: '⚡' }, { key: 'HAND_TOOLS', label: 'Hand Tools', icon: '🔨' },
  { key: 'GARDEN_LANDSCAPING', label: 'Garden', icon: '🌿' }, { key: 'CONSTRUCTION', label: 'Construction', icon: '🏗️' },
  { key: 'AUTOMOTIVE', label: 'Automotive', icon: '🚗' }, { key: 'PLUMBING', label: 'Plumbing', icon: '💧' },
  { key: 'PAINTING', label: 'Painting', icon: '🎨' }, { key: 'MOVING', label: 'Moving', icon: '📦' },
];

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
      {CATEGORIES.map(({ key, label, icon }, i) => (
        <Link key={key} href={`/search?category=${key}`}
          className="group flex flex-col items-center gap-2 py-4 px-2 bg-white border border-sand rounded-xl hover:bg-ink hover:border-ink transition-all duration-150 animate-fade-up"
          style={{ animationDelay: `${i * 40}ms` }}>
          <div className="w-9 h-9 rounded-lg bg-canvas flex items-center justify-center text-lg group-hover:bg-brand/20 transition-colors">{icon}</div>
          <span className="text-[11px] font-medium text-center leading-tight text-ink-subtle group-hover:text-[#F5F0E8] transition-colors">{label}</span>
        </Link>
      ))}
    </div>
  );
}

// ─── FeaturedListings ─────────────────────────────────────────────────────────
const MOCK_TOOLS: ToolCardData[] = [
  { id: '1', name: 'DeWalt 20V MAX Drill/Driver', description: '', category: 'POWER_TOOLS', city: 'Beverly Hills', state: 'CA', dailyRate: 2500, depositAmount: 15000, imageEmoji: '🔧', imageBg: '#EDE5D5', rating: 5, reviewCount: 12, distanceMiles: 1.2 },
  { id: '2', name: 'Makita 10" Compound Miter Saw', description: '', category: 'POWER_TOOLS', city: 'Culver City', state: 'CA', dailyRate: 4500, depositAmount: 25000, imageEmoji: '🪚', imageBg: '#E5EDD5', rating: 4, reviewCount: 8, distanceMiles: 2.8 },
  { id: '3', name: 'Honda 3200 PSI Pressure Washer', description: '', category: 'CLEANING', city: 'Santa Monica', state: 'CA', dailyRate: 5500, depositAmount: 20000, imageEmoji: '💧', imageBg: '#D5E5ED', rating: 5, reviewCount: 21, distanceMiles: 4.1 },
  { id: '4', name: 'Honda 3000W Portable Generator', description: '', category: 'CONSTRUCTION', city: 'West Hollywood', state: 'CA', dailyRate: 6500, depositAmount: 40000, imageEmoji: '⚡', imageBg: '#EDD5D5', rating: 5, reviewCount: 6, distanceMiles: 3.5 },
  { id: '5', name: 'Milwaukee 40-Piece Tool Set', description: '', category: 'HAND_TOOLS', city: 'Los Angeles', state: 'CA', dailyRate: 1800, depositAmount: 12000, imageEmoji: '🪛', imageBg: '#EDE5D5', rating: 4, reviewCount: 15, distanceMiles: 5.0 },
  { id: '6', name: 'Husqvarna 450 Chainsaw', description: '', category: 'GARDEN_LANDSCAPING', city: 'Brentwood', state: 'CA', dailyRate: 3800, depositAmount: 18000, imageEmoji: '🌿', imageBg: '#D5EDE5', rating: 5, reviewCount: 9, distanceMiles: 6.2 },
];

export function FeaturedListings({ tools = MOCK_TOOLS }: { tools?: ToolCardData[] }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-[34px] font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Recently listed near you</h2>
            <p className="text-[14px] text-ink-subtle mt-1 font-light">Fresh tools from your neighbors</p>
          </div>
          <Link href="/search" className="text-[13px] text-brand hover:underline font-medium hidden sm:block">See all tools →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool, i) => (
            <div key={tool.id} className="animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
              <ToolCard tool={tool} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HowItWorks ───────────────────────────────────────────────────────────────
const STEPS = [
  { num: '01 / Find', icon: '🔍', title: 'Search your zip code', body: 'Enter what you need and your zip. See available tools within 5, 10, or 25 miles — filter by category, condition, and daily rate.' },
  { num: '02 / Book', icon: '📅', title: 'Pick dates & pay securely', body: 'Select your rental window. Pay with a card — Stripe holds your deposit safely and releases it automatically on return.' },
  { num: '03 / Use it', icon: '🏠', title: 'Pick up, use, return', body: 'Coordinate pickup with the owner. Finish your project. Return the tool and your deposit is back within 48 hours.' },
];

export function HowItWorks() {
  return (
    <section className="bg-ink py-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <h2 className="text-center text-[40px] font-bold text-[#F5F0E8] tracking-tight mb-14" style={{ fontFamily: 'var(--font-display)' }}>
          Simple as <em className="text-brand not-italic">borrowing from a neighbor</em>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 relative">
          {STEPS.map(({ num, icon, title, body }, i) => (
            <div key={num} className="relative animate-fade-up" style={{ animationDelay: `${i * 120}ms` }}>
              <p className="text-[11px] text-brand mb-4 tracking-[0.1em]" style={{ fontFamily: 'var(--font-mono)' }}>{num}</p>
              <div className="w-[52px] h-[52px] rounded-xl bg-ink-2 border border-ink-3 flex items-center justify-center text-2xl mb-5">{icon}</div>
              <h3 className="text-[22px] font-bold text-[#F5F0E8] mb-3 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
              <p className="text-[14px] text-ink-muted leading-relaxed font-light">{body}</p>
              {i < STEPS.length - 1 && <div className="hidden md:block absolute top-[68px] right-[-16px] text-ink-3 text-xl z-10">→</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── OwnerCTA ─────────────────────────────────────────────────────────────────
export function OwnerCTA() {
  return (
    <section className="bg-brand">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-center">
          <div>
            <p className="text-[11px] text-white/60 uppercase tracking-[0.12em] mb-3" style={{ fontFamily: 'var(--font-mono)' }}>For tool owners</p>
            <h2 className="text-[40px] md:text-[48px] font-bold text-white leading-[1.08] tracking-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>Your garage is a<br />revenue stream.</h2>
            <p className="text-[15px] text-white/70 max-w-[440px] font-light leading-relaxed">List your tools in minutes. You set the daily rate, the deposit, and when they're available. We handle payments — and you keep 85%.</p>
          </div>
          <Link href="/list-tool" className="inline-flex items-center gap-2 bg-ink hover:bg-ink-2 text-[#F5F0E8] px-8 py-4 rounded-xl text-[15px] font-medium transition-colors whitespace-nowrap">List your first tool →</Link>
        </div>
      </div>
    </section>
  );
}

// ─── TrustSection ─────────────────────────────────────────────────────────────
const PILLARS = [
  { icon: '🛡️', title: 'Deposit protection', body: "Every rental requires a refundable deposit set by the owner. If the tool comes back in good shape, it's returned automatically — no awkward conversations." },
  { icon: '✅', title: 'Verified owners', body: "Owners connect their bank account through Stripe and are reviewed before their listings go live. You know exactly who you're renting from." },
  { icon: '⭐', title: 'Two-way reviews', body: 'After every rental, both the renter and owner leave reviews. This keeps the community honest and makes it easy to find great tools and trustworthy borrowers.' },
];

export function TrustSection() {
  return (
    <section className="py-20 bg-canvas">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <h2 className="text-[34px] font-bold tracking-tight mb-10" style={{ fontFamily: 'var(--font-display)' }}>Built on trust</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map(({ icon, title, body }, i) => (
            <div key={title} className="bg-white border border-sand rounded-2xl p-7 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="text-[28px] mb-4">{icon}</div>
              <h4 className="text-[16px] font-medium mb-2" style={{ fontFamily: 'var(--font-display)' }}>{title}</h4>
              <p className="text-[13px] text-ink-subtle leading-relaxed font-light">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
