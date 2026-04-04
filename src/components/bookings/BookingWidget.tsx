'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, startOfDay, differenceInCalendarDays } from 'date-fns';

interface BookingWidgetProps {
  tool: { id: string; dailyRate: number; depositAmount: number; weeklyDiscount?: number | null; minRentalDays: number; maxRentalDays: number; available: boolean; ownerId: string; };
  bookedRanges: { start: Date; end: Date }[];
}

const PLATFORM_FEE = 0.15;
const fmt = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(cents / 100);

function isBooked(date: Date, ranges: { start: Date; end: Date }[]) {
  return ranges.some(({ start, end }) => date >= start && date <= end);
}

function calcPricing(dailyRate: number, deposit: number, days: number, weeklyDiscount?: number | null) {
  const subtotal = dailyRate * days;
  const discountPct = weeklyDiscount && days >= 7 ? weeklyDiscount / 100 : 0;
  const discounted = subtotal * (1 - discountPct);
  const platformFee = Math.round(discounted * PLATFORM_FEE);
  return { subtotal: Math.round(discounted), discountAmount: Math.round(subtotal * discountPct), platformFee, total: Math.round(discounted) + deposit };
}

export function BookingWidget({ tool, bookedRanges }: BookingWidgetProps) {
  const router = useRouter();
  const today = startOfDay(new Date());
  const [month, setMonth] = useState(new Date());
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [hovered, setHovered] = useState<Date | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const leadBlanks = monthStart.getDay();
  const rangeEnd = end ?? hovered;
  const inRange = (d: Date) => !!(start && rangeEnd && d > start && d < rangeEnd);
  const isStart = (d: Date) => !!(start && isSameDay(d, start));
  const isEnd = (d: Date) => !!(rangeEnd && isSameDay(d, rangeEnd));
  const isDisabled = (d: Date) => isBefore(d, today) || isBooked(d, bookedRanges);
  const totalDays = start && end ? differenceInCalendarDays(end, start) + 1 : 0;
  const pricing = totalDays > 0 ? calcPricing(tool.dailyRate, tool.depositAmount, totalDays, tool.weeklyDiscount) : null;

  const handleDayClick = (d: Date) => {
    if (isDisabled(d)) return;
    if (!start || (start && end)) { setStart(d); setEnd(null); return; }
    if (isBefore(d, start)) { setStart(d); setEnd(null); return; }
    const span = eachDayOfInterval({ start, end: d });
    if (span.some((day) => isBooked(day, bookedRanges))) { setStart(d); setEnd(null); } else { setEnd(d); }
  };

  const handleBook = async () => {
    if (!start || !end) return;
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ toolId: tool.id, startDate: start.toISOString(), endDate: end.toISOString(), renterNotes: notes }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/bookings/${data.bookingId}/pay`);
    } catch (err) { alert(err instanceof Error ? err.message : 'Something went wrong'); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-white border border-sand rounded-2xl overflow-hidden shadow-card">
      <div className="px-5 pt-5 pb-4 border-b border-sand">
        <div className="flex items-baseline gap-1">
          <span className="text-[24px] font-bold" style={{ fontFamily: 'var(--font-display)' }}>{fmt(tool.dailyRate)}</span>
          <span className="text-[13px] text-ink-subtle">/day</span>
        </div>
        {tool.weeklyDiscount && <p className="text-[12px] text-green-600 mt-0.5 font-medium">{tool.weeklyDiscount}% off 7+ day rentals</p>}
      </div>
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setMonth(subMonths(month, 1))} className="p-1.5 rounded-lg hover:bg-canvas transition-colors"><ChevronLeft className="w-4 h-4 text-ink-subtle" /></button>
          <span className="text-[13px] font-semibold">{format(month, 'MMMM yyyy')}</span>
          <button onClick={() => setMonth(addMonths(month, 1))} className="p-1.5 rounded-lg hover:bg-canvas transition-colors"><ChevronRight className="w-4 h-4 text-ink-subtle" /></button>
        </div>
        <div className="grid grid-cols-7 mb-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => <div key={d} className="text-center text-[11px] text-ink-subtle py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-y-0.5">
          {Array.from({ length: leadBlanks }).map((_, i) => <div key={`b${i}`} />)}
          {days.map((day) => {
            const disabled = isDisabled(day);
            const selected = isStart(day) || isEnd(day);
            const inSel = inRange(day);
            return (
              <button key={day.toISOString()} disabled={disabled} onClick={() => handleDayClick(day)}
                onMouseEnter={() => start && !end && setHovered(day)} onMouseLeave={() => setHovered(null)}
                className={`relative h-8 w-full text-[12px] rounded-lg transition-all ${disabled ? 'text-ink-subtle/40 cursor-not-allowed line-through' : 'cursor-pointer'} ${selected ? 'bg-brand text-white font-semibold' : ''} ${inSel ? 'bg-brand/15 text-brand-dark rounded-none' : ''} ${!disabled && !selected && !inSel ? 'hover:bg-canvas' : ''} ${isToday(day) && !selected ? 'font-bold text-brand' : ''}`}>
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
        {start && end && <p className="text-[12px] text-center text-ink-subtle mt-2">{format(start, 'MMM d')} – {format(end, 'MMM d')} · {totalDays} day{totalDays !== 1 ? 's' : ''}</p>}
      </div>
      {pricing && (
        <div className="px-5 py-4 border-t border-sand space-y-2 text-[13px]">
          <div className="flex justify-between text-ink-subtle"><span>{fmt(tool.dailyRate)} × {totalDays} days</span><span>{fmt(tool.dailyRate * totalDays)}</span></div>
          {pricing.discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Weekly discount</span><span>−{fmt(pricing.discountAmount)}</span></div>}
          <div className="flex justify-between text-ink-subtle"><span>Platform fee (15%)</span><span>{fmt(pricing.platformFee)}</span></div>
          <div className="flex justify-between text-ink-subtle pt-2 border-t border-sand"><span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Refundable deposit</span><span>{fmt(tool.depositAmount)}</span></div>
          <div className="flex justify-between font-semibold text-[14px] pt-2 border-t border-sand"><span>Total due</span><span>{fmt(pricing.total)}</span></div>
        </div>
      )}
      <div className="px-5 pb-4">
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Message for the owner (optional)" rows={2}
          className="w-full text-[13px] p-2.5 rounded-lg border border-sand resize-none outline-none focus:border-brand transition-colors placeholder:text-ink-subtle/60 font-light" />
      </div>
      <div className="px-5 pb-5">
        <button onClick={handleBook} disabled={!tool.available || !start || !end || loading || totalDays < tool.minRentalDays || totalDays > tool.maxRentalDays}
          className="w-full py-3.5 rounded-xl text-[15px] font-medium transition-all bg-brand hover:bg-brand-dark text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]">
          {loading ? 'Processing…' : !tool.available ? 'Currently unavailable' : !start || !end ? 'Select dates to continue' : totalDays < tool.minRentalDays ? `Minimum ${tool.minRentalDays} days` : totalDays > tool.maxRentalDays ? `Maximum ${tool.maxRentalDays} days` : 'Request to book'}
        </button>
        <p className="text-[11px] text-center text-ink-subtle mt-2">You won't be charged until the owner approves.</p>
      </div>
    </div>
  );
}
