import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Layout, Database, Terminal } from 'lucide-react';
import Reveal from '../UI/Reveal';

const Proficiency = () => {
  const categories = [
    {
      name: 'Frontend & UI/UX Design',
      pct: 90,
      icon: <Layout className="w-4 h-4 text-blue-400" />,
      colorClass: 'from-blue-500 to-cyan-400',
      glowShadow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]'
    },
    {
      name: 'Backend Architecture & APIs',
      pct: 85,
      icon: <Database className="w-4 h-4 text-purple-400" />,
      colorClass: 'from-purple-500 to-blue-500',
      glowShadow: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]'
    },
    {
      name: 'Systems Programming & Algorithms',
      pct: 80,
      icon: <Terminal className="w-4 h-4 text-cyan-400" />,
      colorClass: 'from-cyan-500 to-blue-400',
      glowShadow: 'shadow-[0_0_15px_rgba(0,229,255,0.4)]'
    }
  ];

  return (
    <section id="proficiency" className="py-20 border-t border-white/[0.08] text-left select-none relative overflow-hidden">
      
      {/* Title */}
      <div className="flex items-center space-x-4 mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
          <span>Technical Proficiency</span>
        </h2>
        <div className="h-[1px] bg-gradient-to-r from-cyan-500/50 to-transparent flex-grow" />
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {categories.map((cat, idx) => (
          <Reveal key={idx} delay={idx * 0.1}>
            <div className="space-y-3.5">
              
              {/* Row title & value percentage */}
              <div className="flex justify-between items-center text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                <span className="flex items-center gap-2">
                  {cat.icon}
                  <span>{cat.name}</span>
                </span>
                <span className="text-[#3b82f6]">{cat.pct}%</span>
              </div>

              {/* Progress track */}
              <div className="h-2.5 w-full bg-white/[0.03] border border-white/[0.06] rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${cat.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className={`h-full bg-gradient-to-r ${cat.colorClass} rounded-full relative z-10 ${cat.glowShadow}`}
                />
              </div>

            </div>
          </Reveal>
        ))}
      </div>

    </section>
  );
};

export default Proficiency;
