'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Wrench } from 'lucide-react';

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-ink text-canvas">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 h-[60px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-300">
            <Wrench className="w-3.5 h-3.5 text-white -rotate-12 group-hover:rotate-0 transition-transform duration-300" />
          </div>
          <span className="text-[19px] font-bold tracking-tight text-[#F5F0E8]" style={{ fontFamily: 'var(--font-display)' }}>
            renna<span className="text-brand">tool</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-7">
          {[{ href: '/search', label: 'Browse' }, { href: '/list-tool', label: 'List a tool' }, { href: '/how-it-works', label: 'How it works' }].map(({ href, label }) => (
            <Link key={href} href={href} className="text-[13px] text-[#9A8E80] hover:text-[#F5F0E8] transition-colors">{label}</Link>
          ))}
          <Link href="/auth/login" className="text-[13px] text-[#9A8E80] hover:text-[#F5F0E8] transition-colors">Sign in</Link>
          <Link href="/auth/register" className="px-4 py-2 bg-brand hover:bg-brand-dark text-white text-[13px] font-medium rounded-md transition-colors">Get started</Link>
        </nav>
        <button className="md:hidden p-2 text-[#9A8E80] hover:text-[#F5F0E8]" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-ink-2 border-t border-ink-3 px-6 py-4 space-y-3 animate-slide-down">
          {[{ href: '/search', label: 'Browse tools' }, { href: '/list-tool', label: 'List a tool' }, { href: '/auth/login', label: 'Sign in' }].map(({ href, label }) => (
            <Link key={href} href={href} className="block py-2 text-sm text-[#9A8E80] hover:text-[#F5F0E8]" onClick={() => setOpen(false)}>{label}</Link>
          ))}
          <Link href="/auth/register" className="block w-full text-center py-3 bg-brand text-white text-sm font-medium rounded-lg" onClick={() => setOpen(false)}>Get started</Link>
        </div>
      )}
    </header>
  );
}
