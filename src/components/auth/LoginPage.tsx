import React, { useState } from 'react';
import { GraduationCap, LockKeyhole, Mail, ArrowUpRight, BookOpen, ShieldCheck, Languages, Sparkles, Eye, EyeOff, AlertCircle, LoaderCircle, Orbit, Atom, AudioWaveform, BrainCircuit, Stars } from 'lucide-react';
import type { User, UserRole } from '../../types';

interface LoginPageProps {
  onLoginSuccess: (user: User, role: UserRole) => void;
  onRegisterClick: () => void;
}

const DEMO_ACCOUNTS: { role: UserRole; label: string; identifier: string; password: string; name: string }[] = [
  { role: 'student', label: 'Student', identifier: 'subha@pathashala.edu', password: 'password123', name: 'Subhashree Nayak' },
  { role: 'teacher', label: 'Teacher', identifier: 'priya.sharma@pathashala.edu', password: 'password123', name: 'Smt. Priya Sharma' },
  { role: 'parent', label: 'Parent', identifier: 'ananya.nayak@pathashala.edu', password: 'password123', name: 'Ananya Nayak' }
];

const ROLE_COPY: Record<UserRole, { eyebrow: string; title: string; accent: string; soft: string; description: string }> = {
  student: { eyebrow: 'YOUR SPACE TO GROW', title: 'Curiosity has\nno limits.', accent: '#A3FFCB', soft: '#1B8C68', description: 'Explore ideas, ask anything, and make learning yours.' },
  teacher: { eyebrow: 'YOUR SPACE TO INSPIRE', title: 'Every lesson\ncan spark.', accent: '#FFE49A', soft: '#B88731', description: 'Bring your classroom to life with a little help from AI.' },
  parent: { eyebrow: 'YOUR SPACE TO CONNECT', title: 'Be part of\nthe journey.', accent: '#B8D9FF', soft: '#4387D6', description: 'Celebrate progress and support every next step.' }
};

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onRegisterClick }) => {
  const [role, setRole] = useState<UserRole>('student');
  const [identifier, setIdentifier] = useState('subha@pathashala.edu');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(false);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
  const [clickPulse, setClickPulse] = useState(0);
  const [clickPoint, setClickPoint] = useState({ x: 50, y: 50 });
  const copy = ROLE_COPY[role];

  const handlePointerMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 });
  };

  const handlePointerDown = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setClickPoint({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 });
    setClickPulse((pulse) => pulse + 1);
  };

  const chooseRole = (nextRole: UserRole) => {
    const account = DEMO_ACCOUNTS.find((item) => item.role === nextRole);
    setRole(nextRole);
    setError('');
    if (account) {
      setIdentifier(account.identifier);
      setPassword(account.password);
    }
  };

  const chooseDemo = (account: typeof DEMO_ACCOUNTS[number]) => {
    setRole(account.role);
    setIdentifier(account.identifier);
    setPassword(account.password);
    setError('');
    setShowDemo(false);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Vercel hosts the frontend while the Express API runs separately on Render.
      // VITE_API_URL is configured in the Vercel project environment variables.
      const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
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
    <main
      onMouseMove={handlePointerMove}
      onMouseDown={handlePointerDown}
      className="pathashala-login relative min-h-screen overflow-hidden bg-[#061D17] text-white selection:bg-emerald-200 selection:text-[#06271C]"
      style={{ '--role-accent': copy.accent, '--role-soft': copy.soft, '--pointer-x': pointer.x + '%', '--pointer-y': pointer.y + '%', '--click-x': clickPoint.x + '%', '--click-y': clickPoint.y + '%' } as React.CSSProperties}
    >
      <style>{`
        @keyframes orbit-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes orbit-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes breathe { 0%,100% { transform: scale(.96); opacity:.72; } 50% { transform: scale(1.06); opacity:1; } }
        @keyframes rise { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes reveal { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }
        @keyframes scan { 0% { transform: translateY(-120%); } 100% { transform: translateY(380%); } }
        @keyframes cursor-orbit { from { transform: translate(-50%,-50%) rotate(0deg); } to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes cursor-bloom { 0% { transform:translate(-50%,-50%) scale(.35); opacity:.72; } 75% { opacity:.22; } 100% { transform:translate(-50%,-50%) scale(1.8); opacity:0; } }
        @keyframes cursor-dot { 0%,100% { transform:scale(.8); opacity:.35; } 50% { transform:scale(1.25); opacity:.85; } }
        .pl-cursor-aura { position:absolute; left:var(--pointer-x); top:var(--pointer-y); width:250px; height:250px; transform:translate(-50%,-50%); border-radius:9999px; background:radial-gradient(circle, color-mix(in srgb, var(--role-accent) 13%, transparent) 0%, color-mix(in srgb, var(--role-accent) 5%, transparent) 34%, transparent 70%); transition:left .08s linear,top .08s linear; }
        .pl-cursor-ring { position:absolute; left:var(--pointer-x); top:var(--pointer-y); width:46px; height:46px; transform:translate(-50%,-50%); border:1px solid color-mix(in srgb, var(--role-accent) 50%, transparent); border-radius:9999px; transition:left .07s linear,top .07s linear; }
        .pl-cursor-ring::before { content:''; position:absolute; inset:5px; border:1px dashed color-mix(in srgb, var(--role-accent) 55%, transparent); border-radius:inherit; animation:cursor-orbit 9s linear infinite; }
        .pl-cursor-ring::after { content:''; position:absolute; width:4px; height:4px; left:2px; top:50%; border-radius:9999px; background:var(--role-accent); box-shadow:0 0 12px var(--role-accent); animation:cursor-dot 2s ease-in-out infinite; }
        .pl-cursor-click { position:absolute; left:var(--click-x); top:var(--click-y); width:42px; height:42px; border:1px solid var(--role-accent); border-radius:9999px; pointer-events:none; animation:cursor-bloom .65s ease-out forwards; }
        @media (hover: none), (pointer: coarse) { .pl-cursor-aura,.pl-cursor-ring { display:none; } }
        .pl-orbit { animation: orbit-spin 24s linear infinite; }
        .pl-orbit-reverse { animation: orbit-reverse 30s linear infinite; }
        .pl-breathe { animation: breathe 6s ease-in-out infinite; }
        .pl-rise { animation: rise 5s ease-in-out infinite; }
        .pl-reveal { animation: reveal .65s cubic-bezier(.2,.8,.2,1) both; }
        .pl-scan { animation: scan 7s ease-in-out infinite; }
        .pl-stage { background: radial-gradient(600px circle at var(--pointer-x) var(--pointer-y), color-mix(in srgb, var(--role-soft) 22%, transparent), transparent 70%), #061D17; }
        .pl-role-active { color:#06271C; background:var(--role-accent); box-shadow:0 8px 35px color-mix(in srgb, var(--role-accent) 24%, transparent); }
        .pl-role-idle { color:#91A69C; background:transparent; }
        .pl-role-idle:hover { color:white; background:rgba(255,255,255,.07); }
        .pl-input { background:rgba(255,255,255,.045); border:1px solid rgba(206,231,219,.14); transition:all .25s ease; }
        .pl-input:focus-within { border-color:var(--role-accent); background:rgba(255,255,255,.075); box-shadow:0 0 0 4px color-mix(in srgb, var(--role-accent) 12%, transparent); transform:translateY(-1px); }
        .pl-submit { background:var(--role-accent); color:#06271C; transition:transform .25s ease, box-shadow .25s ease; }
        .pl-submit:hover { transform:translateY(-2px); box-shadow:0 14px 40px color-mix(in srgb, var(--role-accent) 20%, transparent); }
        .pl-submit:active { transform:translateY(0) scale(.99); }
        @media (prefers-reduced-motion: reduce) { .pl-orbit,.pl-orbit-reverse,.pl-breathe,.pl-rise,.pl-reveal,.pl-scan,.pl-cursor-ring::before,.pl-cursor-ring::after,.pl-cursor-click { animation:none !important; } .pl-cursor-aura,.pl-cursor-ring { transition:none !important; } }
      `}</style>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[60] overflow-hidden">
        <div className="pl-cursor-aura" />
        <div className="pl-cursor-ring" />
        <div key={clickPulse} className="pl-cursor-click" />
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-[0.12]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.13) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.13) 1px, transparent 1px)', backgroundSize: '64px 64px', maskImage: 'linear-gradient(to bottom, black, transparent 88%)' }} />
      <div className="pointer-events-none absolute -left-44 -top-40 h-[32rem] w-[32rem] rounded-full blur-[110px] transition-colors duration-700" style={{ background: copy.soft, opacity: .28 }} />
      <div className="pointer-events-none absolute -bottom-48 right-[20%] h-[35rem] w-[35rem] rounded-full bg-emerald-700/20 blur-[120px]" />

      <header className="relative z-20 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-14">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/15 bg-white/[0.07] shadow-lg backdrop-blur-xl"><Sparkles className="h-5 w-5" style={{ color: copy.accent }} /></div>
          <div><p className="text-sm font-black tracking-[.18em]">PATHASHALA <span style={{ color: copy.accent }}>AI</span></p><p className="mt-0.5 text-[10px] uppercase tracking-[.2em] text-emerald-100/45">Learning, reimagined</p></div>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-emerald-50/65 sm:flex"><span className="h-1.5 w-1.5 rounded-full" style={{ background: copy.accent, boxShadow: '0 0 12px var(--role-accent)' }} /> A brighter way to learn</div>
      </header>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-88px)] max-w-[1440px] items-center gap-10 px-5 pb-10 sm:px-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-14 lg:px-14 lg:pb-14">
        <section className="relative flex min-h-[440px] flex-col justify-center py-5 lg:min-h-[650px] lg:py-12">
          <div className="absolute left-[9%] top-[8%] h-[25rem] w-[25rem] max-w-[75vw] rounded-full border border-white/[0.07] pl-orbit" />
          <div className="absolute left-[9%] top-[8%] h-[25rem] w-[25rem] max-w-[75vw] rounded-full border border-dashed border-white/[0.09] pl-orbit-reverse" style={{ transform: 'scale(.78)' }} />
          <div className="absolute left-[13%] top-[14%] h-[21rem] w-[21rem] max-w-[65vw] rounded-full blur-3xl pl-breathe" style={{ background: copy.soft, opacity: .2 }} />
          <div className="relative z-10 max-w-2xl pl-2 sm:pl-6">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-2 text-[10px] font-bold tracking-[.2em] text-white/70 backdrop-blur-xl"><Orbit className="h-3.5 w-3.5" style={{ color: copy.accent }} /> {copy.eyebrow}</div>
            <h1 key={role} className="pl-reveal whitespace-pre-line text-[3.8rem] font-semibold leading-[.98] tracking-[-.065em] sm:text-7xl xl:text-[6.3rem]">{copy.title.split('\n')[0]}<br /><span style={{ color: copy.accent }}>{copy.title.split('\n')[1]}</span></h1>
            <p className="mt-7 max-w-md text-base leading-7 text-emerald-50/60 sm:text-lg">{copy.description}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <div className="pl-rise flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 backdrop-blur-xl"><div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: copy.accent + '20', color: copy.accent }}><BrainCircuit className="h-5 w-5" /></div><div><p className="text-xs font-bold">AI-powered</p><p className="mt-1 text-[10px] text-white/45">Support that adapts</p></div></div>
              <div className="pl-rise flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 backdrop-blur-xl" style={{ animationDelay: '-2s' }}><div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: copy.accent + '20', color: copy.accent }}><Languages className="h-5 w-5" /></div><div><p className="text-xs font-bold">Made for everyone</p><p className="mt-1 text-[10px] text-white/45">Learn in your own way</p></div></div>
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-[9%] right-[8%] hidden h-32 w-32 items-center justify-center rounded-full border border-white/10 bg-white/[0.025] backdrop-blur-sm lg:flex pl-rise"><div className="absolute inset-3 rounded-full border border-dashed border-white/15 pl-orbit" /><Atom className="h-9 w-9" style={{ color: copy.accent }} /><span className="absolute -right-2 top-5 h-3 w-3 rounded-full" style={{ background: copy.accent, boxShadow: '0 0 20px var(--role-accent)' }} /></div>
          <p className="relative z-10 mt-12 pl-2 text-[10px] tracking-[.12em] text-white/30 sm:pl-6">ONE AI · EVERY LANGUAGE · EVERY LEARNER</p>
        </section>

        <section className="relative mx-auto w-full max-w-[470px] py-4 lg:py-10">
          <div className="pointer-events-none absolute -inset-5 rounded-[2.5rem] blur-2xl transition-colors duration-700" style={{ background: copy.soft, opacity: .12 }} />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.13] bg-[#0B2921]/85 p-6 shadow-[0_30px_100px_rgba(0,0,0,.35)] backdrop-blur-2xl sm:p-9">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--role-accent), transparent)' }} />
            <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full blur-3xl" style={{ background: copy.soft, opacity: .18 }} />
            <div className="relative">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div><p className="text-[10px] font-extrabold tracking-[.25em]" style={{ color: copy.accent }}>WELCOME TO YOUR WORLD</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-[2.2rem]">Let's begin<span style={{ color: copy.accent }}>.</span></h2><p className="mt-2 text-sm text-emerald-50/45">Sign in to your dedicated {role === 'student' ? 'student learning portal' : role === 'teacher' ? 'teacher classroom portal' : 'parent family portal'}.</p></div>
                <div className="pl-breathe grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.05]" style={{ color: copy.accent }}><Stars className="h-5 w-5" /></div>
              </div>

              <div className="mb-7 rounded-2xl border border-white/[0.08] bg-black/15 p-1.5">
                <div className="grid grid-cols-3 gap-1">
                  {([{ id: 'student', icon: GraduationCap, label: 'Student' }, { id: 'teacher', icon: BookOpen, label: 'Teacher' }, { id: 'parent', icon: ShieldCheck, label: 'Parent' }] as const).map((item) => (
                    <button key={item.id} type="button" onClick={() => chooseRole(item.id)} className={`flex flex-col items-center gap-2 rounded-xl px-2 py-3 text-xs font-bold transition-all duration-300 ${role === item.id ? 'pl-role-active scale-[1.02]' : 'pl-role-idle'}`}><item.icon className="h-4 w-4" /><span>{item.label}</span></button>
                  ))}
                </div>
              </div>

              <form onSubmit={submit} className="space-y-4">
                <label className="block"><span className="mb-2 block text-[11px] font-bold tracking-wide text-emerald-50/70">EMAIL OR SCHOOL ID</span><span className="pl-input flex items-center gap-3 rounded-2xl px-4"><Mail className="h-4 w-4 shrink-0" style={{ color: copy.accent }} /><input autoComplete="username" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="you@pathashala.edu" className="h-[3.65rem] min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25" /></span></label>
                <label className="block"><span className="mb-2 block text-[11px] font-bold tracking-wide text-emerald-50/70">PASSWORD</span><span className="pl-input flex items-center gap-3 rounded-2xl px-4"><LockKeyhole className="h-4 w-4 shrink-0" style={{ color: copy.accent }} /><input autoComplete="current-password" required type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="h-[3.65rem] min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="rounded-lg p-1 text-white/45 transition hover:text-white">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></span></label>
                {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{error}</span></div>}
                <button disabled={loading} type="submit" className="pl-submit group flex h-[3.7rem] w-full items-center justify-between rounded-2xl px-5 text-sm font-extrabold disabled:cursor-not-allowed disabled:opacity-60"><span className="flex items-center gap-2">{loading ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Entering your space…</> : <>Open {role === 'student' ? 'Student Dashboard' : role === 'teacher' ? 'Teacher Dashboard' : 'Parent Dashboard'} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></>}</span><span className="text-[10px] font-bold tracking-[.12em] opacity-60">LET'S GO</span></button>
              </form>

              {role === 'student' && (
                <div className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.06] p-4">
                  <p className="text-sm font-bold text-white">New student?</p>
                  <p className="mt-1 text-xs leading-5 text-white/50">Create your own account to save your learning preferences and progress.</p>
                  <button type="button" onClick={onRegisterClick} className="mt-3 flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-extrabold transition hover:brightness-110" style={{ background: copy.accent, color: '#06271C' }}>
                    Create Student Account <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="mt-6 border-t border-white/[0.09] pt-5">
                <button type="button" onClick={() => setShowDemo(!showDemo)} className="flex w-full items-center justify-between text-left text-xs font-bold text-white/55 transition hover:text-white"><span className="flex items-center gap-2"><AudioWaveform className="h-4 w-4" style={{ color: copy.accent }} /> Explore a demo account</span><span>{showDemo ? '−' : '+'}</span></button>
                {showDemo && <div className="mt-4 space-y-2 pl-reveal">{DEMO_ACCOUNTS.map((account) => <button type="button" key={account.role} onClick={() => chooseDemo(account)} className="flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-3 text-left transition hover:border-white/20 hover:bg-white/[0.07]"><span><span className="block text-xs font-bold text-white/85">{account.label}</span><span className="mt-1 block text-[10px] text-white/40">{account.identifier}</span></span><ArrowUpRight className="h-4 w-4" style={{ color: copy.accent }} /></button>)}<p className="pt-1 text-[10px] text-white/35">Demo password: <span className="font-semibold text-white/55">password123</span></p></div>}
              </div>
              <p className="mt-6 flex items-center justify-center gap-2 text-[10px] text-white/30"><ShieldCheck className="h-3.5 w-3.5" /> Your learning space starts here</p>
            </div>
          </div>
          <p className="mt-5 text-center text-[10px] tracking-wide text-white/25">Move your cursor. Change your role. Watch your space respond.</p>
        </section>
      </div>
    </main>
  );
};
