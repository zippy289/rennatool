// src/components/search/SearchSidebar.tsx
'use client';

const CATEGORIES = [
  { key: 'POWER_TOOLS',         label: 'Power Tools' },
  { key: 'HAND_TOOLS',          label: 'Hand Tools' },
  { key: 'GARDEN_LANDSCAPING',  label: 'Garden & Landscaping' },
  { key: 'CONSTRUCTION',        label: 'Construction' },
  { key: 'AUTOMOTIVE',          label: 'Automotive' },
  { key: 'PLUMBING',            label: 'Plumbing' },
  { key: 'ELECTRICAL',          label: 'Electrical' },
  { key: 'CLEANING',            label: 'Cleaning' },
  { key: 'PAINTING',            label: 'Painting' },
  { key: 'MOVING',              label: 'Moving' },
  { key: 'OUTDOOR_RECREATION',  label: 'Outdoor & Recreation' },
  { key: 'FARMING_AGRICULTURE', label: 'Farming & Agriculture' },
  { key: 'OTHER',               label: 'Other' },
];

const RADIUS_OPTIONS = [5, 10, 25, 50, 100];

interface Filters {
  category: string;
  minPrice: string;
  maxPrice: string;
  radius:   string;
}

interface SearchSidebarProps {
  filters:         Filters;
  onFiltersChange: (f: Filters) => void;
}

export function SearchSidebar({ filters, onFiltersChange }: SearchSidebarProps) {
  const set = (patch: Partial<Filters>) => onFiltersChange({ ...filters, ...patch });

  return (
    <div className="space-y-7">

      {/* Clear */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold">Filters</span>
        <button
          onClick={() => onFiltersChange({ category:'', minPrice:'', maxPrice:'', radius:'25' })}
          className="text-[12px] text-brand hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Radius */}
      <div>
        <h4 className="text-[11px] font-semibold uppercase tracking-widest text-ink-subtle mb-3"
          style={{ fontFamily:'var(--font-mono)' }}>
          Search radius
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {RADIUS_OPTIONS.map((r) => (
            <button
              key={r}
              onClick={() => set({ radius: String(r) })}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                filters.radius === String(r)
                  ? 'bg-brand text-white'
                  : 'bg-canvas text-ink-subtle hover:bg-sand'
              }`}
            >
              {r} mi
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <h4 className="text-[11px] font-semibold uppercase tracking-widest text-ink-subtle mb-3"
          style={{ fontFamily:'var(--font-mono)' }}>
          Category
        </h4>
        <div className="space-y-0.5">
          <button
            onClick={() => set({ category: '' })}
            className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors ${
              !filters.category
                ? 'bg-brand/10 text-brand-dark font-medium'
                : 'text-ink-subtle hover:bg-canvas'
            }`}
          >
            All categories
          </button>
          {CATEGORIES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => set({ category: key })}
              className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors ${
                filters.category === key
                  ? 'bg-brand/10 text-brand-dark font-medium'
                  : 'text-ink-subtle hover:bg-canvas'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h4 className="text-[11px] font-semibold uppercase tracking-widest text-ink-subtle mb-3"
          style={{ fontFamily:'var(--font-mono)' }}>
          Daily rate
        </h4>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle text-[13px]">$</span>
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => set({ minPrice: e.target.value })}
              className="w-full pl-7 pr-3 py-2 border border-sand rounded-lg text-[13px] outline-none focus:border-brand transition-colors bg-white"
            />
          </div>
          <span className="text-ink-subtle text-sm">–</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle text-[13px]">$</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => set({ maxPrice: e.target.value })}
              className="w-full pl-7 pr-3 py-2 border border-sand rounded-lg text-[13px] outline-none focus:border-brand transition-colors bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
