// src/app/search/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar }          from '@/components/layout/Navbar';
import { Footer }          from '@/components/layout/Footer';
import { ToolCard }        from '@/components/tools/ToolCard';
import { SearchSidebar }   from '@/components/search/SearchSidebar';
import { SlidersHorizontal, Search, MapPin, X } from 'lucide-react';
import type { ToolCardData } from '@/components/tools/ToolCard';

// ─── Mock results (replace with real fetch) ───────────────────────────────────
const ALL_TOOLS: ToolCardData[] = [
  { id:'1', name:'DeWalt 20V MAX Drill/Driver', description:'', category:'POWER_TOOLS', city:'Beverly Hills', state:'CA', dailyRate:2500, depositAmount:15000, imageEmoji:'🔧', imageBg:'#EDE5D5', rating:5, reviewCount:12, distanceMiles:1.2 },
  { id:'2', name:'Makita 10" Compound Miter Saw', description:'', category:'POWER_TOOLS', city:'Culver City', state:'CA', dailyRate:4500, depositAmount:25000, imageEmoji:'🪚', imageBg:'#E5EDD5', rating:4, reviewCount:8, distanceMiles:2.8 },
  { id:'3', name:'Honda 3200 PSI Pressure Washer', description:'', category:'CLEANING', city:'Santa Monica', state:'CA', dailyRate:5500, depositAmount:20000, imageEmoji:'💧', imageBg:'#D5E5ED', rating:5, reviewCount:21, distanceMiles:4.1 },
  { id:'4', name:'Honda 3000W Portable Generator', description:'', category:'CONSTRUCTION', city:'West Hollywood', state:'CA', dailyRate:6500, depositAmount:40000, imageEmoji:'⚡', imageBg:'#EDD5D5', rating:5, reviewCount:6, distanceMiles:3.5 },
  { id:'5', name:'Milwaukee 40-Piece Tool Set', description:'', category:'HAND_TOOLS', city:'Los Angeles', state:'CA', dailyRate:1800, depositAmount:12000, imageEmoji:'🪛', imageBg:'#EDE5D5', rating:4, reviewCount:15, distanceMiles:5.0 },
  { id:'6', name:'Husqvarna 450 Chainsaw', description:'', category:'GARDEN_LANDSCAPING', city:'Brentwood', state:'CA', dailyRate:3800, depositAmount:18000, imageEmoji:'🌿', imageBg:'#D5EDE5', rating:5, reviewCount:9, distanceMiles:6.2 },
  { id:'7', name:'Bosch 7-1/4" Circular Saw', description:'', category:'POWER_TOOLS', city:'Burbank', state:'CA', dailyRate:2200, depositAmount:10000, imageEmoji:'🔧', imageBg:'#EDE8D5', rating:4, reviewCount:3, distanceMiles:8.1 },
  { id:'8', name:'RIDGID Pipe Wrench Set', description:'', category:'PLUMBING', city:'Glendale', state:'CA', dailyRate:1500, depositAmount:8000, imageEmoji:'🔩', imageBg:'#E5D5ED', rating:5, reviewCount:7, distanceMiles:9.4 },
  { id:'9', name:'Werner 8ft Fiberglass Ladder', description:'', category:'CONSTRUCTION', city:'Pasadena', state:'CA', dailyRate:1200, depositAmount:6000, imageEmoji:'🪜', imageBg:'#D5EDE8', rating:4, reviewCount:11, distanceMiles:11.0 },
];

const SORT_OPTIONS = [
  { value: 'distance',   label: 'Nearest first' },
  { value: 'price_asc',  label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'rating',     label: 'Top rated' },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [query,      setQuery]      = useState(searchParams.get('q')   ?? '');
  const [zip,        setZip]        = useState(searchParams.get('zip') ?? '');
  const [sort,       setSort]       = useState('distance');
  const [sidebarOpen,setSidebarOpen]= useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') ?? '',
    minPrice: '',
    maxPrice: '',
    radius:   '25',
  });

  // Derived filtered + sorted tools
  const results = ALL_TOOLS
    .filter((t) => {
      if (query && !t.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (filters.category && t.category !== filters.category) return false;
      if (filters.minPrice && t.dailyRate < parseFloat(filters.minPrice) * 100) return false;
      if (filters.maxPrice && t.dailyRate > parseFloat(filters.maxPrice) * 100) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'price_asc')  return a.dailyRate - b.dailyRate;
      if (sort === 'price_desc') return b.dailyRate - a.dailyRate;
      if (sort === 'rating')     return (b.rating ?? 0) - (a.rating ?? 0);
      return (a.distanceMiles ?? 99) - (b.distanceMiles ?? 99); // distance
    });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (query) p.set('q', query);
    if (zip)   p.set('zip', zip);
    router.push(`/search?${p.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      {/* ── Search bar row ────────────────────────────────────────────────── */}
      <div className="bg-ink border-b border-ink-3">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5E52] pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools…"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-ink-2 border border-ink-3 text-[#F5F0E8] placeholder:text-[#6B5E52] text-sm outline-none focus:border-brand transition-colors"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B5E52] hover:text-[#F5F0E8]">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="relative sm:w-[120px]">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5E52] pointer-events-none" />
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g,'').slice(0,5))}
                placeholder="ZIP"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-ink-2 border border-ink-3 text-[#F5F0E8] placeholder:text-[#6B5E52] text-sm outline-none focus:border-brand transition-colors"
              />
            </div>
            <button type="submit" className="px-5 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-lg text-sm font-medium transition-colors">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8">
          <div className="flex gap-8">

            {/* Sidebar — desktop always visible, mobile overlay */}
            <aside className="hidden lg:block w-60 flex-shrink-0">
              <SearchSidebar filters={filters} onFiltersChange={setFilters} />
            </aside>

            {/* Results */}
            <div className="flex-1 min-w-0">

              {/* Results header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[15px] font-medium">
                    {results.length} tool{results.length !== 1 ? 's' : ''} found
                    {zip ? ` near ${zip}` : ''}
                  </p>
                  {query && (
                    <p className="text-[13px] text-ink-subtle mt-0.5">
                      Showing results for "{query}"
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {/* Mobile filter toggle */}
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-sand rounded-lg text-sm hover:bg-white transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                  </button>
                  {/* Sort */}
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="px-3 py-2 border border-sand rounded-lg text-sm bg-white outline-none focus:border-brand cursor-pointer"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active filter chips */}
              {(filters.category || filters.minPrice || filters.maxPrice) && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {filters.category && (
                    <FilterChip label={filters.category.replace(/_/g,' ').toLowerCase()} onRemove={() => setFilters(f => ({...f, category:''}))} />
                  )}
                  {(filters.minPrice || filters.maxPrice) && (
                    <FilterChip
                      label={`$${filters.minPrice||'0'} – $${filters.maxPrice||'∞'}/day`}
                      onRemove={() => setFilters(f => ({...f, minPrice:'', maxPrice:''}))}
                    />
                  )}
                </div>
              )}

              {/* Grid */}
              {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {results.map((tool, i) => (
                    <div key={tool.id} className="animate-fade-up" style={{ animationDelay:`${i*50}ms` }}>
                      <ToolCard tool={tool} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-sand">
                  <div className="text-5xl mb-4">🔧</div>
                  <h3 className="text-lg font-semibold mb-2" style={{ fontFamily:'var(--font-display)' }}>
                    No tools found
                  </h3>
                  <p className="text-sm text-ink-subtle mb-5">Try adjusting your search or expanding the radius.</p>
                  <button
                    onClick={() => { setQuery(''); setFilters({ category:'', minPrice:'', maxPrice:'', radius:'25' }); }}
                    className="text-sm text-brand hover:underline font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-deep overflow-y-auto animate-slide-down">
            <div className="flex items-center justify-between p-4 border-b border-sand">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4">
              <SearchSidebar filters={filters} onFiltersChange={(f) => { setFilters(f); setSidebarOpen(false); }} />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand/10 text-brand-dark rounded-full text-xs font-medium capitalize">
      {label}
      <button onClick={onRemove} className="hover:text-brand transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
