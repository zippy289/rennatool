'use client';
// src/app/dashboard/renter/page.tsx
import { useState } from 'react';
import { Navbar }   from '@/components/layout/Navbar';
import { Footer }   from '@/components/layout/Footer';
import Link         from 'next/link';
import { Package, Clock, CheckCircle, Star, Search } from 'lucide-react';

const MOCK_BOOKINGS = [
  { id:'b1', tool:'DeWalt 20V Drill',   emoji:'🔧', owner:'Alice T.', dates:'Apr 15–17, 2025', status:'ACTIVE',    total:5000,  depositAmount:15000 },
  { id:'b2', tool:'Honda Generator',    emoji:'⚡', owner:'Bob M.',   dates:'Apr 20–22, 2025', status:'PAID',      total:13000, depositAmount:40000 },
  { id:'b3', tool:'Makita Miter Saw',   emoji:'🪚', owner:'Alice T.', dates:'Mar 5–7, 2025',   status:'COMPLETED', total:9000,  depositAmount:25000 },
  { id:'b4', tool:'Pressure Washer',    emoji:'💧', owner:'Bob M.',   dates:'Feb 14, 2025',     status:'COMPLETED', total:5500,  depositAmount:20000 },
  { id:'b5', tool:'Werner 8ft Ladder',  emoji:'🪜', owner:'Carol S.', dates:'Jan 28, 2025',     status:'CANCELLED', total:1200,  depositAmount:6000  },
];

const TABS = ['all', 'active', 'upcoming', 'past'] as const;
type Tab = typeof TABS[number];

const STATUS_CONFIG: Record<string,{ label:string; icon: React.ElementType; cls:string }> = {
  ACTIVE:    { label:'Active now',  icon:CheckCircle, cls:'bg-green-50 text-green-700' },
  PAID:      { label:'Upcoming',    icon:Clock,       cls:'bg-blue-50 text-blue-700' },
  COMPLETED: { label:'Completed',   icon:CheckCircle, cls:'bg-canvas text-ink-subtle' },
  CANCELLED: { label:'Cancelled',   icon:Package,     cls:'bg-red-50 text-red-400' },
  PENDING:   { label:'Pending',     icon:Clock,       cls:'bg-amber-50 text-amber-700' },
};

const fmt = (c: number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:0}).format(c/100);

export default function RenterDashboard() {
  const [tab, setTab] = useState<Tab>('all');

  const filtered = MOCK_BOOKINGS.filter((b) => {
    if (tab === 'all')      return true;
    if (tab === 'active')   return b.status === 'ACTIVE';
    if (tab === 'upcoming') return b.status === 'PAID' || b.status === 'PENDING';
    if (tab === 'past')     return b.status === 'COMPLETED' || b.status === 'CANCELLED';
    return true;
  });

  const totalSpent = MOCK_BOOKINGS
    .filter(b => b.status === 'COMPLETED')
    .reduce((s,b) => s + b.total, 0);

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 py-10">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[32px] font-bold tracking-tight" style={{ fontFamily:'var(--font-display)' }}>
                My rentals
              </h1>
              <p className="text-[13px] text-ink-subtle mt-1 font-light">
                Track your active and past tool rentals
              </p>
            </div>
            <Link href="/search"
              className="flex items-center gap-2 px-4 py-2.5 border border-sand bg-white hover:bg-canvas text-ink rounded-lg text-[13px] font-medium transition-colors">
              <Search className="w-4 h-4" /> Find tools
            </Link>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label:'Total rentals',  value: String(MOCK_BOOKINGS.filter(b=>b.status==='COMPLETED').length) },
              { label:'Active now',     value: String(MOCK_BOOKINGS.filter(b=>b.status==='ACTIVE').length) },
              { label:'Total spent',    value: fmt(totalSpent) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white border border-sand rounded-xl p-4 text-center">
                <p className="text-[22px] font-bold" style={{ fontFamily:'var(--font-display)' }}>{value}</p>
                <p className="text-[11px] text-ink-subtle mt-0.5 uppercase tracking-wide"
                  style={{ fontFamily:'var(--font-mono)' }}>
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-white border border-sand rounded-xl mb-6 w-fit">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-[13px] font-medium capitalize transition-all ${
                  tab === t ? 'bg-ink text-white' : 'text-ink-subtle hover:text-ink'
                }`}>
                {t}
              </button>
            ))}
          </div>

          {/* Bookings list */}
          {filtered.length > 0 ? (
            <div className="space-y-3">
              {filtered.map((booking) => {
                const cfg = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.PENDING;
                const StatusIcon = cfg.icon;
                return (
                  <div key={booking.id} className="bg-white border border-sand rounded-2xl p-5 hover:shadow-card transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-canvas flex items-center justify-center text-2xl flex-shrink-0">
                        {booking.emoji}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-[15px] truncate">{booking.tool}</p>
                          <span className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${cfg.cls}`}>
                            <StatusIcon className="w-3 h-3" />
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-[13px] text-ink-subtle font-light">
                          {booking.owner} · {booking.dates}
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-[15px]">{fmt(booking.total)}</p>
                        <p className="text-[11px] text-ink-subtle mt-0.5">
                          + {fmt(booking.depositAmount)} deposit
                        </p>
                      </div>
                    </div>

                    {/* Actions for active/upcoming */}
                    {(booking.status === 'ACTIVE' || booking.status === 'PAID') && (
                      <div className="flex gap-2 mt-4 pt-4 border-t border-sand">
                        <Link href={`/bookings/${booking.id}`}
                          className="px-4 py-2 bg-ink text-white rounded-lg text-[12px] font-medium hover:bg-ink-2 transition-colors">
                          View details
                        </Link>
                        {booking.status === 'ACTIVE' && (
                          <button className="px-4 py-2 border border-sand rounded-lg text-[12px] text-ink-subtle hover:bg-canvas transition-colors">
                            Report return
                          </button>
                        )}
                      </div>
                    )}

                    {/* Leave review for completed */}
                    {booking.status === 'COMPLETED' && (
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-sand">
                        <button className="flex items-center gap-1.5 px-4 py-2 border border-sand rounded-lg text-[12px] text-ink-subtle hover:bg-canvas transition-colors">
                          <Star className="w-3.5 h-3.5 text-amber-400" />
                          Leave a review
                        </button>
                        <Link href={`/tools/${booking.id}`}
                          className="px-4 py-2 text-[12px] text-brand hover:underline font-medium">
                          Rent again →
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-sand">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-[16px] font-semibold mb-2" style={{ fontFamily:'var(--font-display)' }}>
                No rentals here
              </h3>
              <p className="text-[13px] text-ink-subtle mb-5 font-light">
                {tab === 'active' ? 'You have no active rentals right now.' :
                 tab === 'upcoming' ? "You don't have any upcoming bookings." :
                 "You haven't rented any tools yet."}
              </p>
              <Link href="/search" className="text-[13px] text-brand hover:underline font-medium">
                Browse tools near you →
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
