'use client';
// src/app/dashboard/owner/page.tsx
import { useState }   from 'react';
import { Navbar }     from '@/components/layout/Navbar';
import { Footer }     from '@/components/layout/Footer';
import Link           from 'next/link';
import { Package, TrendingUp, Star, Clock, CheckCircle, AlertCircle, Plus, ChevronRight } from 'lucide-react';

const MOCK_STATS = {
  totalEarnings:   184500,  // cents
  pendingEarnings: 27500,
  activeRentals:   2,
  totalRentals:    34,
  avgRating:       4.8,
  totalTools:      5,
};

const MOCK_TOOLS = [
  { id:'1', name:'DeWalt 20V MAX Drill/Driver', category:'Power Tools', dailyRate:2500, available:true,  rentals:12, emoji:'🔧' },
  { id:'2', name:'Makita 10" Miter Saw',         category:'Power Tools', dailyRate:4500, available:false, rentals:8,  emoji:'🪚' },
  { id:'3', name:'Honda Pressure Washer',         category:'Cleaning',    dailyRate:5500, available:true,  rentals:9,  emoji:'💧' },
  { id:'4', name:'Honda 3000W Generator',          category:'Construction',dailyRate:6500, available:true,  rentals:5,  emoji:'⚡' },
];

const MOCK_BOOKINGS = [
  { id:'b1', renter:'Marcus L.', tool:'DeWalt 20V Drill', dates:'Apr 15–17', status:'PAID',    total:5000 },
  { id:'b2', renter:'Sarah K.',  tool:'Honda Generator',  dates:'Apr 20–22', status:'PENDING', total:13000 },
  { id:'b3', renter:'Tom B.',    tool:'Makita Miter Saw', dates:'Apr 8–10',  status:'COMPLETED',total:9000 },
  { id:'b4', renter:'Lisa M.',   tool:'Pressure Washer',  dates:'Mar 30',    status:'COMPLETED',total:5500 },
];

const STATUS_STYLES: Record<string, { label:string; cls:string }> = {
  PENDING:   { label:'Pending',   cls:'bg-amber-50 text-amber-700' },
  APPROVED:  { label:'Approved',  cls:'bg-blue-50 text-blue-700' },
  PAID:      { label:'Confirmed', cls:'bg-green-50 text-green-700' },
  ACTIVE:    { label:'Active',    cls:'bg-green-100 text-green-800' },
  COMPLETED: { label:'Completed', cls:'bg-canvas text-ink-subtle' },
  CANCELLED: { label:'Cancelled', cls:'bg-red-50 text-red-500' },
};

const fmt = (c: number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:0}).format(c/100);

export default function OwnerDashboard() {
  const [tab, setTab] = useState<'overview'|'listings'|'bookings'>('overview');

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[32px] font-bold tracking-tight" style={{ fontFamily:'var(--font-display)' }}>
                My listings
              </h1>
              <p className="text-[13px] text-ink-subtle mt-1 font-light">Manage your tools and track earnings</p>
            </div>
            <Link href="/list-tool"
              className="flex items-center gap-2 px-4 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-lg text-[13px] font-medium transition-colors">
              <Plus className="w-4 h-4" /> List a tool
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-white border border-sand rounded-xl mb-8 w-fit">
            {(['overview','listings','bookings'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-[13px] font-medium capitalize transition-all ${
                  tab === t ? 'bg-ink text-white' : 'text-ink-subtle hover:text-ink'
                }`}>
                {t}
              </button>
            ))}
          </div>

          {/* ── Overview ─────────────────────────────────────────────── */}
          {tab === 'overview' && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: TrendingUp, label:'Total earned',    value: fmt(MOCK_STATS.totalEarnings),   sub:'all time', color:'text-green-600' },
                  { icon: Clock,      label:'Pending payout',  value: fmt(MOCK_STATS.pendingEarnings), sub:'processing', color:'text-amber-600' },
                  { icon: Package,    label:'Active rentals',  value: String(MOCK_STATS.activeRentals),sub:'right now', color:'text-blue-600' },
                  { icon: Star,       label:'Avg rating',      value: String(MOCK_STATS.avgRating),    sub:`${MOCK_STATS.totalRentals} reviews`, color:'text-brand' },
                ].map(({ icon:Icon, label, value, sub, color }) => (
                  <div key={label} className="bg-white border border-sand rounded-2xl p-5">
                    <Icon className={`w-5 h-5 mb-3 ${color}`} />
                    <p className="text-[11px] text-ink-subtle uppercase tracking-wide mb-1" style={{ fontFamily:'var(--font-mono)' }}>
                      {label}
                    </p>
                    <p className="text-[26px] font-bold leading-tight" style={{ fontFamily:'var(--font-display)' }}>
                      {value}
                    </p>
                    <p className="text-[11px] text-ink-subtle mt-0.5">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Recent bookings preview */}
              <div className="bg-white border border-sand rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-sand">
                  <h3 className="font-semibold text-[15px]">Recent bookings</h3>
                  <button onClick={() => setTab('bookings')} className="text-[12px] text-brand hover:underline">
                    View all →
                  </button>
                </div>
                <div className="divide-y divide-sand">
                  {MOCK_BOOKINGS.slice(0,3).map((b) => (
                    <BookingRow key={b.id} booking={b} />
                  ))}
                </div>
              </div>

              {/* Stripe Connect prompt if needed */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[14px] font-semibold text-amber-900">Connect your bank account</p>
                    <p className="text-[12px] text-amber-700 font-light mt-0.5">
                      Set up payouts to start receiving earnings from your rentals.
                    </p>
                  </div>
                </div>
                <button className="flex-shrink-0 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap">
                  Connect Stripe →
                </button>
              </div>
            </div>
          )}

          {/* ── Listings ─────────────────────────────────────────────── */}
          {tab === 'listings' && (
            <div className="bg-white border border-sand rounded-2xl overflow-hidden">
              <div className="divide-y divide-sand">
                {MOCK_TOOLS.map((tool) => (
                  <div key={tool.id} className="flex items-center gap-4 px-6 py-4 hover:bg-canvas transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-canvas flex items-center justify-center text-2xl flex-shrink-0">
                      {tool.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[14px] truncate">{tool.name}</p>
                      <p className="text-[12px] text-ink-subtle mt-0.5">{tool.category} · {tool.rentals} rentals</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[14px] font-semibold">{fmt(tool.dailyRate)}/day</p>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${
                        tool.available ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {tool.available ? 'Available' : 'Rented out'}
                      </span>
                    </div>
                    <Link href={`/tools/${tool.id}`} className="flex-shrink-0 p-2 hover:bg-canvas rounded-lg transition-colors">
                      <ChevronRight className="w-4 h-4 text-ink-subtle" />
                    </Link>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-sand">
                <Link href="/list-tool"
                  className="flex items-center gap-2 text-[13px] text-brand hover:underline font-medium">
                  <Plus className="w-4 h-4" /> Add another tool
                </Link>
              </div>
            </div>
          )}

          {/* ── Bookings ─────────────────────────────────────────────── */}
          {tab === 'bookings' && (
            <div className="bg-white border border-sand rounded-2xl overflow-hidden">
              <div className="divide-y divide-sand">
                {MOCK_BOOKINGS.map((b) => (
                  <BookingRow key={b.id} booking={b} showActions />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function BookingRow({ booking, showActions }: { booking: typeof MOCK_BOOKINGS[0]; showActions?: boolean }) {
  const status = STATUS_STYLES[booking.status] ?? STATUS_STYLES.PENDING;
  const fmt    = (c: number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:0}).format(c/100);

  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[14px]">{booking.renter}</p>
        <p className="text-[12px] text-ink-subtle mt-0.5">{booking.tool} · {booking.dates}</p>
      </div>
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium flex-shrink-0 ${status.cls}`}>
        {status.label}
      </span>
      <span className="text-[14px] font-semibold flex-shrink-0">{fmt(booking.total)}</span>
      {showActions && booking.status === 'PENDING' && (
        <div className="flex gap-2 flex-shrink-0">
          <button className="px-3 py-1.5 bg-brand text-white rounded-lg text-[12px] font-medium hover:bg-brand-dark transition-colors">
            Approve
          </button>
          <button className="px-3 py-1.5 border border-sand rounded-lg text-[12px] text-ink-subtle hover:bg-canvas transition-colors">
            Decline
          </button>
        </div>
      )}
    </div>
  );
}
