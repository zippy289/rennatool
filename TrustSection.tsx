'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [zip,   setZip]   = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (query.trim()) p.set('q',   query.trim());
    if (zip.trim())   p.set('zip', zip.trim());
    router.push(`/search?${p.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      {/* Tool search */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5E52] pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What tool are you looking for?"
          className="
            w-full pl-10 pr-4 py-3.5 rounded-lg
            bg-ink-2 border border-ink-3 text-[#F5F0E8]
            placeholder:text-[#6B5E52] text-sm outline-none
            focus:border-brand transition-colors duration-150
          "
        />
      </div>

      {/* ZIP */}
      <div className="relative sm:w-[120px]">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5E52] pointer-events-none" />
        <input
          type="text"
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
          placeholder="ZIP code"
          maxLength={5}
          className="
            w-full pl-9 pr-3 py-3.5 rounded-lg
            bg-ink-2 border border-ink-3 text-[#F5F0E8]
            placeholder:text-[#6B5E52] text-sm outline-none
            focus:border-brand transition-colors duration-150
          "
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="
          px-6 py-3.5 bg-brand hover:bg-brand-dark text-white
          rounded-lg text-sm font-medium whitespace-nowrap
          transition-colors duration-150 active:scale-[0.98]
        "
      >
        Search
      </button>
    </form>
  );
}
