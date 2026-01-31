import React from 'react';
import Head from 'next/head';
import { Target, Settings, Sword } from 'lucide-react';

const Layout = ({ children, theme = 'zen' }) => {
  const navItems = [
    { name: 'Mission', icon: <Target size={20} />, id: 'arena', active: true },
    { name: 'Settings', icon: <Settings size={20} />, id: 'config' },
  ];

  const colors = theme === 'zen' ? {
    bg: 'bg-emerald-50/20',
    primary: 'text-emerald-600',
    accent: 'bg-emerald-600',
    navActive: 'bg-white text-emerald-700 border-emerald-100 shadow-sm',
    headerLogo: 'from-emerald-600 to-teal-500'
  } : {
    bg: 'bg-slate-50',
    primary: 'text-indigo-600',
    accent: 'bg-indigo-600',
    navActive: 'bg-white text-indigo-700 border-indigo-100 shadow-sm',
    headerLogo: 'from-slate-900 to-indigo-600'
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 font-sans selection:bg-emerald-500/30">
      <Head>
        <title>MindTussle | Focus Guardian</title>
        <meta name="description" content="AI-driven focus protection." />
      </Head>

      <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 ${colors.accent} rounded-xl flex items-center justify-center shadow-lg`}>
              <Sword className="text-white" size={18} fill="currentColor" />
            </div>
            <span className={`text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r ${colors.headerLogo} uppercase italic`}>mindtussle</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System Active</span>
          </div>
        </div>
      </header>

      <div className={`max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-16 mb-24 lg:mb-0`}>
        <aside className="hidden lg:block space-y-10">
          <div className="space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-black transition-all border-2 ${item.active ? colors.navActive : 'text-slate-400 border-transparent hover:text-slate-600'}`}
              >
                {item.icon}
                <span className="uppercase tracking-[0.2em]">{item.name}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="animate-in fade-in duration-1000">
          {children}
        </main>
      </div>

      <footer className="py-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
        Focus Guardian &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Layout;
