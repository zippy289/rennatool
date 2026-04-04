// src/app/tools/[id]/page.tsx
'use client';
import { useState } from 'react';
import { Navbar }        from '@/components/layout/Navbar';
import { Footer }        from '@/components/layout/Footer';
import { BookingWidget } from '@/components/bookings/BookingWidget';
import { MapPin, Star, Shield, ChevronLeft, Package, Award, Clock } from 'lucide-react';
import Link from 'next/link';

// ─── Mock tool (replace with real DB fetch via params.id) ─────────────────────
const MOCK_TOOL = {
  id:            '1',
  name:          'DeWalt 20V MAX Drill/Driver Kit',
  description:   `Heavy-duty 20V MAX cordless drill with 2 batteries, charger, and carrying bag. Perfect for home renovations and construction projects.

Includes a full 40-piece bit set. Batteries fully charged before every pickup. I've used this for several projects and keep it in excellent condition.

What's included:
• DeWalt DCD771C2 drill/driver
• Two 1.5Ah 20V MAX batteries
• 12V–20V MAX charger
• Contractor's bag
• 40-piece bit set`,
  category:      'POWER_TOOLS',
  brand:         'DeWalt',
  model:         'DCD771C2',
  condition:     'EXCELLENT',
  dailyRate:     2500,
  depositAmount: 15000,
  weeklyDiscount: 10,
  city:          'Beverly Hills',
  state:         'CA',
  zipCode:       '90210',
  available:      true,
  minRentalDays:  1,
  maxRentalDays:  14,
  deliveryAvailable: false,
  imageEmoji:    '🔧',
  imageBg:       '#EDE5D5',
  images:        [] as string[],
  owner: {
    id:        'owner1',
    name:      'Alice Thompson',
    memberSince: 'Jan 2024',
    totalRentals: 34,
    verified:  true,
  },
  reviews: [
    { id:'r1', reviewer:'Marcus L.', rating:5, comment:'Drill worked perfectly, Alice was super responsive. Will rent again!', date:'Mar 2025' },
    { id:'r2', reviewer:'Sarah K.',  rating:5, comment:'Great condition, exactly as described. Easy pickup.', date:'Feb 2025' },
    { id:'r3', reviewer:'Tom B.',    rating:4, comment:'Good tool, one of the bits was missing but not a big deal.', date:'Jan 2025' },
  ],
  bookedRanges: [
    { start: new Date('2025-04-10'), end: new Date('2025-04-12') },
    { start: new Date('2025-04-20'), end: new Date('2025-04-22') },
  ],
};

function formatCents(cents: number) {
  return new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', minimumFractionDigits:0 }).format(cents/100);
}

const CONDITION_LABELS: Record<string,string> = {
  LIKE_NEW:'Like New', EXCELLENT:'Excellent', GOOD:'Good', FAIR:'Fair'
};
const CATEGORY_LABELS: Record<string,string> = {
  POWER_TOOLS:'Power Tools', HAND_TOOLS:'Hand Tools', GARDEN_LANDSCAPING:'Garden & Landscaping',
  CONSTRUCTION:'Construction', AUTOMOTIVE:'Automotive', CLEANING:'Cleaning',
};

export default function ToolDetailPage({ params }: { params: { id: string } }) {
  const tool = MOCK_TOOL; // replace with: await prisma.tool.findUnique({ where:{ id:params.id } })
  const avgRating = tool.reviews.reduce((s,r) => s+r.rating, 0) / tool.reviews.length;

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[13px] text-ink-subtle mb-6">
            <Link href="/search" className="flex items-center gap-1 hover:text-brand transition-colors">
              <ChevronLeft className="w-3.5 h-3.5" /> Back to search
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* ── Left col ─────────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Image */}
              <div
                className="relative w-full aspect-video rounded-2xl overflow-hidden flex items-center justify-center"
                style={{ background: tool.imageBg }}
              >
                {tool.images.length > 0 ? (
                  <img src={tool.images[0]} alt={tool.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-8xl">{tool.imageEmoji}</span>
                )}
                {/* Condition badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1.5 bg-white/90 rounded-full text-[11px] font-medium text-ink-subtle backdrop-blur-sm">
                    {CONDITION_LABELS[tool.condition] ?? tool.condition}
                  </span>
                </div>
              </div>

              {/* Title & meta */}
              <div>
                <div className="flex items-start gap-4 justify-between mb-2">
                  <h1 className="text-[32px] font-bold tracking-tight leading-tight" style={{ fontFamily:'var(--font-display)' }}>
                    {tool.name}
                  </h1>
                  {!tool.available && (
                    <span className="flex-shrink-0 mt-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[12px] font-medium">
                      Unavailable
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[13px] text-ink-subtle">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {tool.city}, {tool.state} {tool.zipCode}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {avgRating.toFixed(1)} ({tool.reviews.length} reviews)
                  </span>
                  <span className="px-2.5 py-1 bg-canvas border border-sand rounded-full text-[11px]">
                    {CATEGORY_LABELS[tool.category] ?? tool.category}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl border border-sand p-6">
                <h2 className="text-[18px] font-bold mb-3" style={{ fontFamily:'var(--font-display)' }}>About this tool</h2>
                <p className="text-[14px] text-ink-subtle leading-relaxed whitespace-pre-line font-light">
                  {tool.description}
                </p>
              </div>

              {/* Details grid */}
              <div>
                <h2 className="text-[18px] font-bold mb-4" style={{ fontFamily:'var(--font-display)' }}>Details</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label:'Brand',       value: tool.brand },
                    { label:'Model',       value: tool.model },
                    { label:'Condition',   value: CONDITION_LABELS[tool.condition] },
                    { label:'Min rental',  value: `${tool.minRentalDays} day${tool.minRentalDays>1?'s':''}` },
                    { label:'Max rental',  value: `${tool.maxRentalDays} days` },
                    { label:'Delivery',    value: tool.deliveryAvailable ? 'Available' : 'Pickup only' },
                  ].filter(d => d.value).map(({ label, value }) => (
                    <div key={label} className="bg-white border border-sand rounded-xl p-4">
                      <p className="text-[11px] text-ink-subtle uppercase tracking-wide mb-1"
                        style={{ fontFamily:'var(--font-mono)' }}>
                        {label}
                      </p>
                      <p className="text-[14px] font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-2xl border border-sand p-6">
                <h2 className="text-[18px] font-bold mb-4" style={{ fontFamily:'var(--font-display)' }}>Pricing</h2>
                <div className="space-y-3 text-[14px]">
                  <div className="flex justify-between">
                    <span className="text-ink-subtle">Daily rate</span>
                    <span className="font-semibold">{formatCents(tool.dailyRate)}/day</span>
                  </div>
                  {tool.weeklyDiscount && (
                    <div className="flex justify-between text-green-600">
                      <span>7+ day discount</span>
                      <span>−{tool.weeklyDiscount}%</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-sand">
                    <span className="text-ink-subtle flex items-center gap-1.5">
                      <Shield className="w-4 h-4" /> Refundable deposit
                    </span>
                    <span className="font-semibold">{formatCents(tool.depositAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Owner */}
              <div className="bg-white rounded-2xl border border-sand p-6">
                <h2 className="text-[18px] font-bold mb-4" style={{ fontFamily:'var(--font-display)' }}>Meet the owner</h2>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-brand/10 flex items-center justify-center text-xl font-bold text-brand flex-shrink-0">
                    {tool.owner.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-[15px]">{tool.owner.name}</p>
                    <p className="text-[13px] text-ink-subtle mt-0.5">Member since {tool.owner.memberSince}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {tool.owner.verified && (
                        <span className="flex items-center gap-1 text-[11px] bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium">
                          <Shield className="w-3 h-3" /> Verified
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[11px] text-ink-subtle">
                        <Package className="w-3 h-3" /> {tool.owner.totalRentals} rentals
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div>
                <h2 className="text-[18px] font-bold mb-5" style={{ fontFamily:'var(--font-display)' }}>
                  Reviews ({tool.reviews.length})
                </h2>
                <div className="space-y-4">
                  {tool.reviews.map((review) => (
                    <div key={review.id} className="bg-white border border-sand rounded-xl p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-canvas flex items-center justify-center text-[13px] font-semibold text-ink-subtle">
                            {review.reviewer.charAt(0)}
                          </div>
                          <span className="text-[14px] font-medium">{review.reviewer}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length:5 }).map((_,i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-sand'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[13px] text-ink-subtle leading-relaxed font-light">{review.comment}</p>
                      <p className="text-[11px] text-ink-subtle/60 mt-2">{review.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right col: sticky booking widget ─────────────────────── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <BookingWidget
                  tool={{
                    id:            tool.id,
                    dailyRate:     tool.dailyRate,
                    depositAmount: tool.depositAmount,
                    weeklyDiscount: tool.weeklyDiscount,
                    minRentalDays: tool.minRentalDays,
                    maxRentalDays: tool.maxRentalDays,
                    available:     tool.available,
                    ownerId:       tool.owner.id,
                  }}
                  bookedRanges={tool.bookedRanges}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
