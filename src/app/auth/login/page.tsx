'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Wrench, Eye, EyeOff } from 'lucide-react';

// useSearchParams must live inside a component wrapped by <Suspense>
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/';

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      // Replace with: await signIn('credentials', { email, password, redirect: false })
      await new Promise(r => setTimeout(r, 800));
      router.push(next);
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-sand rounded-2xl p-8 shadow-card">
      <h1 className="text-[26px] font-bold mb-1 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
        Welcome back
      </h1>
      <p className="text-[13px] text-ink-subtle font-light mb-7">Sign in to your account</p>

      {error && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-600">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[13px] font-medium mb-1.5" htmlFor="email">Email address</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com" autoComplete="email"
            className="w-full px-3.5 py-2.5 border border-sand rounded-lg text-[14px] outline-none focus:border-brand transition-colors placeholder:text-ink-subtle/50" />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[13px] font-medium" htmlFor="password">Password</label>
            <Link href="/auth/forgot-password" className="text-[12px] text-brand hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <input id="password" type={showPw ? 'text' : 'password'} required value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password"
              className="w-full pl-3.5 pr-10 py-2.5 border border-sand rounded-lg text-[14px] outline-none focus:border-brand transition-colors placeholder:text-ink-subtle/50" />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink transition-colors">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3 bg-brand hover:bg-brand-dark text-white rounded-lg text-[14px] font-medium transition-colors disabled:opacity-60 mt-2">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="text-center text-[13px] text-ink-subtle mt-6">
        Don't have an account?{' '}
        <Link href="/auth/register" className="text-brand hover:underline font-medium">Create one free</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-300">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <span className="text-[20px] font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>
              renna<span className="text-brand">tool</span>
            </span>
          </Link>
        </div>
        <Suspense fallback={
          <div className="bg-white border border-sand rounded-2xl p-8 h-64 animate-pulse rounded-2xl" />
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
