'use client';
// src/app/auth/register/page.tsx
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Wrench, Eye, EyeOff, Check } from 'lucide-react';

const REQUIREMENTS = [
  { test: (p: string) => p.length >= 8,            label: 'At least 8 characters' },
  { test: (p: string) => /[A-Z]/.test(p),          label: 'One uppercase letter' },
  { test: (p: string) => /[0-9]/.test(p),          label: 'One number' },
];

export default function RegisterPage() {
  const router = useRouter();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/users/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Registration failed'); return; }
      // Auto sign in
      await signIn('credentials', { email, password, redirect: false });
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px]">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-300">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <span className="text-[20px] font-bold text-ink" style={{ fontFamily:'var(--font-display)' }}>
              renna<span className="text-brand">tool</span>
            </span>
          </Link>
        </div>

        <div className="bg-white border border-sand rounded-2xl p-8 shadow-card">
          <h1 className="text-[26px] font-bold mb-1 tracking-tight" style={{ fontFamily:'var(--font-display)' }}>
            Create your account
          </h1>
          <p className="text-[13px] text-ink-subtle font-light mb-7">
            Free to join. Start renting or listing tools today.
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium mb-1.5" htmlFor="name">Full name</label>
              <input
                id="name" type="text" required
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                autoComplete="name"
                className="w-full px-3.5 py-2.5 border border-sand rounded-lg text-[14px] outline-none focus:border-brand transition-colors placeholder:text-ink-subtle/50"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium mb-1.5" htmlFor="reg-email">Email address</label>
              <input
                id="reg-email" type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full px-3.5 py-2.5 border border-sand rounded-lg text-[14px] outline-none focus:border-brand transition-colors placeholder:text-ink-subtle/50"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium mb-1.5" htmlFor="reg-password">Password</label>
              <div className="relative">
                <input
                  id="reg-password" type={showPw ? 'text' : 'password'} required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className="w-full pl-3.5 pr-10 py-2.5 border border-sand rounded-lg text-[14px] outline-none focus:border-brand transition-colors placeholder:text-ink-subtle/50"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password requirements */}
              {password && (
                <div className="mt-2 space-y-1">
                  {REQUIREMENTS.map(({ test, label }) => (
                    <div key={label} className={`flex items-center gap-1.5 text-[11px] ${test(password) ? 'text-green-600' : 'text-ink-subtle'}`}>
                      <Check className={`w-3 h-3 ${test(password) ? 'text-green-500' : 'text-sand'}`} />
                      {label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3 bg-brand hover:bg-brand-dark text-white rounded-lg text-[14px] font-medium transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-[11px] text-center text-ink-subtle mt-5 leading-relaxed">
            By signing up you agree to our{' '}
            <Link href="/terms" className="underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </p>

          <p className="text-center text-[13px] text-ink-subtle mt-4">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brand hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
