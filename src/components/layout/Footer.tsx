import Link from 'next/link';
import { Wrench } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-ink text-[#9A8E80]">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center"><Wrench className="w-3.5 h-3.5 text-white" /></div>
              <span className="text-[18px] font-bold text-[#F5F0E8]" style={{ fontFamily: 'var(--font-display)' }}>renna<span className="text-brand">tool</span></span>
            </Link>
            <p className="text-sm leading-relaxed max-w-[220px] font-light">The neighborhood tool library. Rent what you need, earn from what you own.</p>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold text-[#F5F0E8] uppercase tracking-widest mb-5" style={{ fontFamily: 'var(--font-mono)' }}>Explore</h4>
            <ul className="space-y-2.5">
              {[{ href: '/search', label: 'Browse tools' }, { href: '/list-tool', label: 'List a tool' }, { href: '/search?category=POWER_TOOLS', label: 'Power tools' }, { href: '/search?category=GARDEN_LANDSCAPING', label: 'Garden & landscaping' }].map(({ href, label }) => (
                <li key={href}><Link href={href} className="text-sm hover:text-[#F5F0E8] transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold text-[#F5F0E8] uppercase tracking-widest mb-5" style={{ fontFamily: 'var(--font-mono)' }}>Company</h4>
            <ul className="space-y-2.5">
              {[{ href: '/about', label: 'About' }, { href: '/how-it-works', label: 'How it works' }, { href: '/terms', label: 'Terms of service' }, { href: '/privacy', label: 'Privacy policy' }].map(({ href, label }) => (
                <li key={href}><Link href={href} className="text-sm hover:text-[#F5F0E8] transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-ink-3 mt-14 pt-8 flex flex-col sm:flex-row justify-between gap-3 text-xs text-[#4A3E34]">
          <p>&copy; {new Date().getFullYear()} Rennatool. All rights reserved.</p>
          <p>Made for builders, weekend warriors & neighbors.</p>
        </div>
      </div>
    </footer>
  );
}
