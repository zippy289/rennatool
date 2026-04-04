import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';

export interface ToolCardData {
  id: string;
  name: string;
  description: string;
  category: string;
  city: string;
  state: string;
  dailyRate: number;
  depositAmount: number;
  imageUrl?: string;
  imageEmoji?: string;
  imageBg?: string;
  rating?: number;
  reviewCount?: number;
  distanceMiles?: number;
}

function formatCents(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(cents / 100);
}

function categoryLabel(cat: string) {
  const map: Record<string, string> = {
    POWER_TOOLS: 'Power Tools', HAND_TOOLS: 'Hand Tools', GARDEN_LANDSCAPING: 'Garden',
    CONSTRUCTION: 'Construction', AUTOMOTIVE: 'Automotive', PLUMBING: 'Plumbing',
    ELECTRICAL: 'Electrical', CLEANING: 'Cleaning', PAINTING: 'Painting',
    MOVING: 'Moving', OUTDOOR_RECREATION: 'Outdoor', OTHER: 'Other',
  };
  return map[cat] ?? cat;
}

export function ToolCard({ tool }: { tool: ToolCardData }) {
  return (
    <Link href={`/tools/${tool.id}`} className="group block bg-white border border-sand rounded-2xl overflow-hidden shadow-card hover:shadow-hover hover:-translate-y-0.5 transition-all duration-200">
      <div className="relative h-[180px] overflow-hidden flex items-center justify-center" style={{ background: tool.imageBg ?? '#F5F0E8' }}>
        {tool.imageUrl
          ? <img src={tool.imageUrl} alt={tool.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <span className="text-5xl">{tool.imageEmoji ?? '🔧'}</span>}
        <div className="absolute top-2.5 left-2.5">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-md text-[11px] font-medium text-ink-subtle">{categoryLabel(tool.category)}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-[15px] font-medium text-ink truncate mb-1 group-hover:text-brand transition-colors">{tool.name}</h3>
        {tool.rating && tool.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.round(tool.rating!) ? 'fill-amber-400 text-amber-400' : 'text-sand'}`} />
            ))}
            {tool.reviewCount && <span className="text-[11px] text-ink-subtle ml-0.5">({tool.reviewCount})</span>}
          </div>
        )}
        <div className="flex items-center gap-1 text-[12px] text-ink-subtle mb-3">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          {tool.distanceMiles !== undefined ? `${tool.distanceMiles.toFixed(1)} mi away` : `${tool.city}, ${tool.state}`}
        </div>
        <div className="flex items-baseline justify-between pt-3 border-t border-sand-light">
          <div>
            <span className="text-[19px] font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>{formatCents(tool.dailyRate)}</span>
            <span className="text-[12px] text-ink-subtle ml-1">/day</span>
          </div>
          <span className="text-[12px] text-ink-subtle">{formatCents(tool.depositAmount)} deposit</span>
        </div>
      </div>
    </Link>
  );
}
