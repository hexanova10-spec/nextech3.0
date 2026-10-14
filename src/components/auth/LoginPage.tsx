import React, { useState } from 'react';
import { GraduationCap, LockKeyhole, Mail, ArrowRight, BookOpen, ShieldCheck, Languages, Sparkles, Eye, EyeOff, AlertCircle, LoaderCircle } from 'lucide-react';
import type { User, UserRole } from '../../types';

interface LoginPageProps {
  onLoginSuccess: (user: User, role: UserRole) => void;
}

const DEMO_ACCOUNTS: { role: UserRole; label: string; identifier: string; password: string; name: string }[] = [
  { role: 'student', label: 'Student', identifier: 'subha@pathashala.edu', password: 'password123', name: 'Subhashree Nayak' },
  { role: 'teacher', label: 'Teacher', identifier: 'priya.sharma@pathashala.edu', password: 'password123', name: 'Smt. Priya Sharma' },
  { role: 'parent', label: 'Parent', identifier: 'ananya.nayak@pathashala.edu', password: 'password123', name: 'Ananya Nayak' }
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [role, setRole] = useState<UserRole>('student');
  const [identifier, setIdentifier] = useState('subha@pathashala.edu');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(true);
  const [pointer, setPointer] = useState({ x: -200, y: -200 });
  const [heroTilt, setHeroTilt] = useState({ x: 0, y: 0 });

  const handlePointerMove = (event: React.MouseEvent<HTMLElement>) => {
    setPointer({ x: event.clientX, y: event.clientY });
    const bounds = event.currentTarget.getBoundingClientRect();
    setHeroTilt({
      x: ((event.clientY - bounds.top) / bounds.height - 0.5) * -5,
      y: ((event.clientX - bounds.left) / bounds.width - 0.5) * 5
    });
  };

  const chooseDemo = (account: typeof DEMO_ACCOUNTS[number]) => {
    setRole(account.role);
    setIdentifier(account.identifier);
    setPassword(account.password);
    setError('');
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password, role })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success || !data.user) {
        throw new Error(data.error || 'Sign in failed. Check your email/ID and selected role.');
      }
      if (data.token) localStorage.setItem('pathashala_token', data.token);
      localStorage.setItem('pathashala_user', JSON.stringify(data.user));
      onLoginSuccess(data.user as User, data.user.role as UserRole);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not connect to the Pathashala backend. Start the backend on port 3000 and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main onMouseMove={handlePointerMove} onMouseLeave={() => { setPointer({ x: -200, y: -200 }); setHeroTilt({ x: 0, y: 0 }); }} className="relative isolate min-h-screen overflow-hidden bg-[#F4FBF6] text-[#18352A] grid lg:grid-cols-[1.05fr_0.95fr]">
      <div aria-hidden="true" className="pointer-events-none fixed z-40 h-48 w-48 rounded-full opacity-40 blur-3xl transition-[left,top] duration-150" style={{ left: pointer.x, top: pointer.y, transform: 'translate(-50%, -50%)', background: role === 'teacher' ? '#F59E0B' : role === 'parent' ? '#60A5FA' : '#34D399' }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0 opacity-[0.18]" style={{ backgroundImage: 'radial-gradient(#0B8457 0.8px, transparent 0.8px)', backgroundSize: '22px 22px' }} />
      <section style={{ transform: `perspective(1200px) rotateX(${heroTilt.x}deg) rotateY(${heroTilt.y}deg)` }} className="relative z-10 hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#003627] via-[#006A4E] to-[#0B8457] p-12 xl:p-16 text-white transition-transform duration-200 ease-out">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30" style={{ background: `radial-gradient(circle at ${Math.max(0, Math.min(100, 50 + heroTilt.y * 5))}% ${Math.max(0, Math.min(100, 50 + heroTilt.x * -5))}%, rgba(255,255,255,0.45), transparent 35%)` }} />
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full border border-white/10" />
        <div className="absolute -bottom-28 -left-20 h-96 w-96 rounded-full bg-white/5 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20"><Sparkles className="h-6 w-6 text-amber-300" /></div>
          <div><p className="text-xl font-black tracking-tight">PATHASHALA AI</p><p className="text-xs text-emerald-100">One AI. Every Language. Every Learner.</p></div>
        </div>
        <div className="relative max-w-xl py-12">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-emerald-50"><Languages className="h-4 w-4" /> Learning without language barriers</div>
          <h1 className="text-5xl font-black leading-[1.12] xl:text-6xl">Your learning journey starts <span className="text-amber-300">here.</span></h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-emerald-50/85">Personalised learning, an AI tutor, schoolwork, and progress insights — designed for every learner and every language.</p>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {[{ icon: BookOpen, title: 'Learn', detail: 'Curriculum aligned' }, { icon: Sparkles, title: 'Ask AI', detail: 'Personalised help' }, { icon: ShieldCheck, title: 'Grow', detail: 'Track progress' }].map((item) => (
              <div key={item.title} style={{ transform: `translateY(${Math.sin((pointer.x + item.title.length * 35) / 90) * 5}px)` }} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-2 hover:bg-white/15"><item.icon className="mb-4 h-5 w-5 text-amber-300" /><p className="text-sm font-extrabold">{item.title}</p><p className="mt-1 text-[11px] text-emerald-100">{item.detail}</p></div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-emerald-100/70">Built for Indian learners • Multilingual • Student-first</p>
      </section>

      <section className="relative z-10 flex items-center justify-center px-5 py-10 sm:px-8">
        <div style={{ transform: `perspective(1000px) rotateX(${heroTilt.x * -0.25}deg) rotateY(${heroTilt.y * 0.25}deg)` }} className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-[0_25px_80px_-35px_rgba(0,75,56,0.28)] backdrop-blur-xl transition-transform duration-200 sm:p-7">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#006A4E] text-white"><Sparkles className="h-6 w-6 text-amber-300" /></div>
            <div><p className="font-black">PATHASHALA AI</p><p className="text-xs text-[#64776B]">Every language. Every learner.</p></div>
          </div>
          <div className="mb-7">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#0B8457]">Welcome back</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">Sign in to Pathashala<span className="inline-block animate-pulse text-[#0B8457]">.</span></h2>
            <p className="mt-2 text-sm leading-6 text-[#64776B]">Choose your portal and use your registered email or school ID.</p>
          </div>

          <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl border border-[#D5E9DC] bg-white p-1.5">
            {(['student', 'teacher', 'parent'] as UserRole[]).map((item) => (
              <button key={item} type="button" onClick={() => { setRole(item); setError(''); }} className={`rounded-xl px-2 py-3 text-sm font-bold capitalize transition ${role === item ? 'bg-[#006A4E] text-white shadow-sm' : 'text-[#64776B] hover:bg-[#F4FBF6]'}`}>{item}</button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-5">
            <label className="block"><span className="mb-2 block text-sm font-bold">Email or school ID</span><span className="flex items-center gap-3 rounded-xl border border-[#CFE2D6] bg-white px-4 focus-within:border-[#006A4E] focus-within:ring-4 focus-within:ring-[#006A4E]/10"><Mail className="h-5 w-5 shrink-0 text-[#0B8457]" /><input autoComplete="username" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="you@pathashala.edu" className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#9AA9A0]" /></span></label>
            <label className="block"><span className="mb-2 block text-sm font-bold">Password</span><span className="flex items-center gap-3 rounded-xl border border-[#CFE2D6] bg-white px-4 focus-within:border-[#006A4E] focus-within:ring-4 focus-within:ring-[#006A4E]/10"><LockKeyhole className="h-5 w-5 shrink-0 text-[#0B8457]" /><input autoComplete="current-password" required type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#9AA9A0]" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="text-[#64776B]">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></span></label>
            {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{error}</span></div>}
            <button disabled={loading} type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#006A4E] px-4 text-sm font-extrabold text-white shadow-lg shadow-[#006A4E]/20 transition hover:bg-[#004B38] disabled:cursor-not-allowed disabled:opacity-70">{loading ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Signing in…</> : <>Sign in <ArrowRight className="h-4 w-4" /></>}</button>
          </form>

          <div className="mt-6 rounded-2xl border border-[#D5E9DC] bg-white p-4">
            <button type="button" onClick={() => setShowDemo(!showDemo)} className="flex w-full items-center justify-between text-left"><span className="text-sm font-extrabold">Demo accounts</span><span className="text-xs font-bold text-[#0B8457]">{showDemo ? 'Hide' : 'Show'}</span></button>
            {showDemo && <div className="mt-3 space-y-2">{DEMO_ACCOUNTS.map((account) => <button type="button" key={account.role} onClick={() => chooseDemo(account)} className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition ${role === account.role ? 'border-[#0B8457] bg-[#F0FAF4]' : 'border-[#E2EEE6] hover:bg-[#F8FCF9]'}`}><span><span className="block text-sm font-bold">{account.label}</span><span className="mt-0.5 block text-xs text-[#64776B]">{account.identifier}</span></span><span className="text-xs font-bold text-[#0B8457]">Use</span></button>)}<p className="pt-1 text-[11px] text-[#64776B]">Demo password: <strong>password123</strong></p></div>}
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-[#64776B]"><ShieldCheck className="h-4 w-4 text-[#0B8457]" /> Sign in connects to the local Pathashala API.</p>
        </div>
      </section>
    </main>
  );
};
