'use client';
// src/app/list-tool/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar }  from '@/components/layout/Navbar';
import { Footer }  from '@/components/layout/Footer';
import { Check, ChevronRight, Upload, DollarSign, MapPin, Info } from 'lucide-react';

const CATEGORIES = [
  { key:'POWER_TOOLS',         label:'Power Tools',          icon:'⚡' },
  { key:'HAND_TOOLS',          label:'Hand Tools',           icon:'🔨' },
  { key:'GARDEN_LANDSCAPING',  label:'Garden & Landscaping', icon:'🌿' },
  { key:'CONSTRUCTION',        label:'Construction',         icon:'🏗️' },
  { key:'AUTOMOTIVE',          label:'Automotive',           icon:'🚗' },
  { key:'PLUMBING',            label:'Plumbing',             icon:'💧' },
  { key:'ELECTRICAL',          label:'Electrical',           icon:'🔌' },
  { key:'CLEANING',            label:'Cleaning',             icon:'🧹' },
  { key:'PAINTING',            label:'Painting',             icon:'🎨' },
  { key:'MOVING',              label:'Moving',               icon:'📦' },
  { key:'OUTDOOR_RECREATION',  label:'Outdoor & Recreation', icon:'⛺' },
  { key:'OTHER',               label:'Other',                icon:'🔧' },
];

const CONDITIONS = [
  { key:'LIKE_NEW',  label:'Like New',  desc:'Barely used, no visible wear' },
  { key:'EXCELLENT', label:'Excellent', desc:'Minor wear, fully functional' },
  { key:'GOOD',      label:'Good',      desc:'Normal wear, works perfectly' },
  { key:'FAIR',      label:'Fair',      desc:'Visible wear, fully functional' },
];

const STEPS = ['Details', 'Pricing', 'Location', 'Review'];

type FormData = {
  name: string; description: string; category: string; brand: string;
  model: string; condition: string; dailyRate: string; depositAmount: string;
  weeklyDiscount: string; minRentalDays: string; maxRentalDays: string;
  zipCode: string; deliveryAvailable: boolean; deliveryFee: string; notes: string;
};

const INITIAL: FormData = {
  name:'', description:'', category:'', brand:'', model:'', condition:'',
  dailyRate:'', depositAmount:'', weeklyDiscount:'', minRentalDays:'1',
  maxRentalDays:'30', zipCode:'', deliveryAvailable:false, deliveryFee:'', notes:'',
};

export default function ListToolPage() {
  const router       = useRouter();
  const [step,       setStep]       = useState(0);
  const [form,       setForm]       = useState<FormData>(INITIAL);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  const set = (patch: Partial<FormData>) => setForm((f) => ({ ...f, ...patch }));

  const canProceed = () => {
    if (step === 0) return form.name && form.description && form.category && form.condition;
    if (step === 1) return form.dailyRate && form.depositAmount;
    if (step === 2) return /^\d{5}$/.test(form.zipCode);
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/tools', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          dailyRate:     parseFloat(form.dailyRate),
          depositAmount: parseFloat(form.depositAmount),
          weeklyDiscount: form.weeklyDiscount ? parseFloat(form.weeklyDiscount) : undefined,
          minRentalDays:  parseInt(form.minRentalDays),
          maxRentalDays:  parseInt(form.maxRentalDays),
          deliveryFee:    form.deliveryFee ? parseFloat(form.deliveryFee) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/tools/${data.toolId}?listed=true`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-6 lg:px-10 py-12">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-[36px] font-bold tracking-tight mb-2" style={{ fontFamily:'var(--font-display)' }}>
              List your tool
            </h1>
            <p className="text-[14px] text-ink-subtle font-light">
              Takes about 5 minutes. Start earning as soon as today.
            </p>
          </div>

          {/* Step progress */}
          <div className="flex items-center gap-2 mb-10">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-7 h-7 rounded-full text-[12px] font-semibold transition-all ${
                  i < step  ? 'bg-brand text-white' :
                  i === step ? 'bg-ink text-white' :
                  'bg-sand-light text-ink-subtle border border-sand'
                }`}>
                  {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className={`text-[13px] font-medium ${i === step ? 'text-ink' : 'text-ink-subtle'}`}>{s}</span>
                {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-sand ml-1" />}
              </div>
            ))}
          </div>

          <div className="bg-white border border-sand rounded-2xl p-8 shadow-card">

            {/* ── Step 0: Details ─────────────────────────────────────── */}
            {step === 0 && (
              <div className="space-y-6">
                <h2 className="text-[20px] font-bold" style={{ fontFamily:'var(--font-display)' }}>Tool details</h2>

                <Field label="Tool name" required>
                  <input value={form.name} onChange={(e) => set({ name:e.target.value })}
                    placeholder="e.g. DeWalt 20V MAX Drill/Driver Kit"
                    className={inputCls} />
                </Field>

                <Field label="Description" required>
                  <textarea value={form.description} onChange={(e) => set({ description:e.target.value })}
                    placeholder="Describe the tool, what's included, and any relevant details…"
                    rows={4}
                    className={inputCls + ' resize-none'} />
                </Field>

                <Field label="Category" required>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {CATEGORIES.map(({ key, label, icon }) => (
                      <button key={key} type="button"
                        onClick={() => set({ category:key })}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[12px] font-medium transition-all ${
                          form.category === key
                            ? 'border-brand bg-brand/5 text-brand-dark'
                            : 'border-sand hover:border-ink-subtle text-ink-subtle'
                        }`}>
                        <span className="text-lg">{icon}</span>
                        {label}
                      </button>
                    ))}
                  </div>
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Brand">
                    <input value={form.brand} onChange={(e) => set({ brand:e.target.value })}
                      placeholder="e.g. DeWalt" className={inputCls} />
                  </Field>
                  <Field label="Model">
                    <input value={form.model} onChange={(e) => set({ model:e.target.value })}
                      placeholder="e.g. DCD771C2" className={inputCls} />
                  </Field>
                </div>

                <Field label="Condition" required>
                  <div className="grid grid-cols-2 gap-2">
                    {CONDITIONS.map(({ key, label, desc }) => (
                      <button key={key} type="button"
                        onClick={() => set({ condition:key })}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          form.condition === key
                            ? 'border-brand bg-brand/5'
                            : 'border-sand hover:border-ink-subtle'
                        }`}>
                        <p className={`text-[13px] font-medium ${form.condition===key ? 'text-brand-dark' : 'text-ink'}`}>{label}</p>
                        <p className="text-[11px] text-ink-subtle mt-0.5 font-light">{desc}</p>
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {/* ── Step 1: Pricing ─────────────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-[20px] font-bold" style={{ fontFamily:'var(--font-display)' }}>Set your pricing</h2>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Daily rate" required hint="You keep 85% after platform fee">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
                      <input type="number" min="1" step="0.01"
                        value={form.dailyRate} onChange={(e) => set({ dailyRate:e.target.value })}
                        placeholder="0.00" className={inputCls + ' pl-9'} />
                    </div>
                  </Field>

                  <Field label="Refundable deposit" required hint="Returned to renter if no damage">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
                      <input type="number" min="0" step="0.01"
                        value={form.depositAmount} onChange={(e) => set({ depositAmount:e.target.value })}
                        placeholder="0.00" className={inputCls + ' pl-9'} />
                    </div>
                  </Field>
                </div>

                {form.dailyRate && (
                  <div className="bg-brand/5 border border-brand/20 rounded-xl p-4 text-[13px]">
                    <p className="font-medium text-brand-dark mb-2">Your earnings estimate</p>
                    <div className="space-y-1 text-ink-subtle">
                      <div className="flex justify-between">
                        <span>Daily rate</span>
                        <span>${parseFloat(form.dailyRate || '0').toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-red-500">
                        <span>Platform fee (15%)</span>
                        <span>−${(parseFloat(form.dailyRate||'0') * 0.15).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-ink pt-1 border-t border-brand/20">
                        <span>You earn per day</span>
                        <span>${(parseFloat(form.dailyRate||'0') * 0.85).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <Field label="Weekly discount (optional)" hint="Discount for 7+ day rentals">
                  <div className="relative">
                    <input type="number" min="0" max="50"
                      value={form.weeklyDiscount} onChange={(e) => set({ weeklyDiscount:e.target.value })}
                      placeholder="e.g. 10" className={inputCls + ' pr-8'} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle text-[13px]">%</span>
                  </div>
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Minimum rental">
                    <select value={form.minRentalDays} onChange={(e) => set({ minRentalDays:e.target.value })}
                      className={inputCls + ' cursor-pointer'} style={{ fontFamily:'var(--font-body)' }}>
                      {[1,2,3,5,7].map(n => <option key={n} value={n}>{n} day{n>1?'s':''}</option>)}
                    </select>
                  </Field>
                  <Field label="Maximum rental">
                    <select value={form.maxRentalDays} onChange={(e) => set({ maxRentalDays:e.target.value })}
                      className={inputCls + ' cursor-pointer'} style={{ fontFamily:'var(--font-body)' }}>
                      {[7,14,21,30,60,90].map(n => <option key={n} value={n}>{n} days</option>)}
                    </select>
                  </Field>
                </div>

                <div className="flex items-center gap-3 p-4 border border-sand rounded-xl">
                  <input type="checkbox" id="delivery"
                    checked={form.deliveryAvailable}
                    onChange={(e) => set({ deliveryAvailable:e.target.checked })}
                    className="w-4 h-4 accent-brand cursor-pointer" />
                  <label htmlFor="delivery" className="text-[14px] cursor-pointer flex-1">
                    I can deliver this tool
                  </label>
                  {form.deliveryAvailable && (
                    <div className="relative w-28">
                      <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-subtle" />
                      <input type="number" placeholder="Fee"
                        value={form.deliveryFee} onChange={(e) => set({ deliveryFee:e.target.value })}
                        className="w-full pl-7 pr-2 py-2 border border-sand rounded-lg text-[13px] outline-none focus:border-brand" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Step 2: Location ────────────────────────────────────── */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-[20px] font-bold" style={{ fontFamily:'var(--font-display)' }}>Location</h2>
                <p className="text-[13px] text-ink-subtle font-light">
                  Renters will see the general area — your exact address is never shown publicly.
                </p>

                <Field label="ZIP code" required>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
                    <input
                      value={form.zipCode}
                      onChange={(e) => set({ zipCode: e.target.value.replace(/\D/g,'').slice(0,5) })}
                      placeholder="e.g. 90210"
                      maxLength={5}
                      className={inputCls + ' pl-9'}
                    />
                  </div>
                </Field>

                <Field label="Additional notes (optional)" hint="Pickup instructions, parking notes, etc.">
                  <textarea value={form.notes} onChange={(e) => set({ notes:e.target.value })}
                    placeholder="e.g. Ring doorbell, street parking available on Oak St"
                    rows={3} className={inputCls + ' resize-none'} />
                </Field>

                <div className="flex items-start gap-3 p-4 bg-canvas rounded-xl border border-sand text-[12px] text-ink-subtle">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand" />
                  <p className="font-light leading-relaxed">
                    Your listing will show the city and state but not your street address.
                    Renters only get pickup details after a confirmed booking.
                  </p>
                </div>
              </div>
            )}

            {/* ── Step 3: Review ──────────────────────────────────────── */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-[20px] font-bold" style={{ fontFamily:'var(--font-display)' }}>Review your listing</h2>

                {[
                  { label:'Tool name',   value: form.name },
                  { label:'Category',    value: CATEGORIES.find(c=>c.key===form.category)?.label },
                  { label:'Condition',   value: CONDITIONS.find(c=>c.key===form.condition)?.label },
                  { label:'Daily rate',  value: form.dailyRate ? `$${parseFloat(form.dailyRate).toFixed(2)}/day` : '' },
                  { label:'Deposit',     value: form.depositAmount ? `$${parseFloat(form.depositAmount).toFixed(2)}` : '' },
                  { label:'ZIP code',    value: form.zipCode },
                  { label:'Delivery',    value: form.deliveryAvailable ? `Yes (+$${form.deliveryFee||0})` : 'No' },
                ].filter(d => d.value).map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-3 border-b border-sand last:border-0 text-[14px]">
                    <span className="text-ink-subtle">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}

                {error && (
                  <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-600">
                    {error}
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-sand">
              {step > 0 ? (
                <button onClick={() => setStep(s => s-1)}
                  className="px-5 py-2.5 border border-sand rounded-lg text-[14px] font-medium hover:bg-canvas transition-colors">
                  ← Back
                </button>
              ) : <div />}

              {step < STEPS.length - 1 ? (
                <button
                  onClick={() => setStep(s => s+1)}
                  disabled={!canProceed()}
                  className="px-6 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-lg text-[14px] font-medium transition-colors disabled:opacity-50"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-lg text-[14px] font-medium transition-colors disabled:opacity-60"
                >
                  {loading ? 'Publishing…' : 'Publish listing →'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const inputCls = 'w-full px-3.5 py-2.5 border border-sand rounded-lg text-[14px] outline-none focus:border-brand transition-colors placeholder:text-ink-subtle/50 bg-white';

function Field({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium mb-1.5">
        {label}{required && <span className="text-brand ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-ink-subtle mt-1.5 font-light">{hint}</p>}
    </div>
  );
}
