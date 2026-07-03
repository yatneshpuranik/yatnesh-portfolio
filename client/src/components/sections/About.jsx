import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles, MessageSquare, Mic } from 'lucide-react';
import Reveal from '../UI/Reveal';

// Custom CountUp helper triggered on viewport scroll
const CountUp = ({ to, suffix = "" }) => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const increment = to / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= to) {
        setCount(to);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [to]);
  return <span>{count}{suffix}</span>;
};

/**
 * About: Premium editorial magazine layout.
 * Re-themed to Minimal Premium Monochrome.
 */
const About = ({ settings }) => {
  const [hasScrolledIntoView, setHasScrolledIntoView] = useState(false);

  if (!settings?.aboutMe) return null;

  const handleOrbClick = () => {
    window.dispatchEvent(new CustomEvent('open-ai-chat'));
  };

  return (
    <section id="about" className="py-28 border-t border-white/[0.08] text-left select-none relative overflow-hidden">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Column: Heading, Biography and Stats */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* Header */}
          <div className="flex items-center space-x-4">
            <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2 font-heading">
              <User className="w-6 h-6 text-white" /> About Me
            </h2>
            <div className="h-[1px] bg-gradient-to-r from-white/20 to-transparent flex-grow" />
          </div>

          {/* Narrative bio */}
          <Reveal delay={0.1}>
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-[#B5B5B5] font-light font-sans">
                I'm <span className="font-semibold text-white">Yatnesh Puranik</span>, a Full Stack Developer building production-grade SaaS applications. Currently contributing to a Multi-Tenant CRM at <span className="text-white font-semibold">Three Syntax</span>, I focus on engineering secure tenant isolation models and highly optimized distributed backend architectures.
              </p>
              <p className="text-base leading-relaxed text-[#7C7C7C] font-normal font-sans">
                My approach combines clean architectural patterns, deep database query optimization, and interactive client integrations to construct robust web products that scale effortlessly.
              </p>
            </div>
          </Reveal>

          {/* Stats Section with CountUp trigger */}
          <motion.div 
            onViewportEnter={() => setHasScrolledIntoView(true)}
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10"
          >
            {/* Stat 1 */}
            <div className="space-y-1 text-left">
              <div className="text-3xl sm:text-4xl font-mono font-black text-white">
                {hasScrolledIntoView ? <CountUp to={1} suffix="+" /> : "0"}
              </div>
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">Years Experience</div>
            </div>

            {/* Stat 2 */}
            <div className="space-y-1 text-left">
              <div className="text-3xl sm:text-4xl font-mono font-black text-white">
                {hasScrolledIntoView ? <CountUp to={15} suffix="+" /> : "0"}
              </div>
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">Projects Built</div>
            </div>

            {/* Stat 3 */}
            <div className="space-y-1 text-left">
              <div className="text-3xl sm:text-4xl font-mono font-black text-white">
                {hasScrolledIntoView ? <CountUp to={100} suffix="%" /> : "0"}
              </div>
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">Dedication</div>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Orbiting Planet SVG & Sticky AI Chat Widget */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[420px] space-y-6">
          
          {/* Planet SVG and floating particles */}
          <div className="absolute inset-0 z-0 flex items-center justify-center lg:-translate-y-8">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="w-48 h-48 relative flex items-center justify-center opacity-30 lg:opacity-40"
            >
              <svg width="200" height="200" viewBox="0 0 200 200" className="absolute">
                <circle cx="100" cy="100" r="24" fill="#050505" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.3" />
                <ellipse cx="100" cy="100" rx="70" ry="16" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.15" transform="rotate(-15 100 100)" />
              </svg>

              {/* Floating cubes/particles around the ring */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-8 left-12 w-2 h-2 bg-white/10 rounded-sm"
              />
              <motion.div 
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-8 right-12 w-1.5 h-1.5 bg-zinc-700/20 rotate-45"
              />
            </motion.div>

            {/* Floating glass caption card */}
            <div className="absolute top-6 px-3 py-1.5 rounded-lg border border-white/[0.04] bg-[#101010]/75 backdrop-blur-sm text-[9px] font-mono text-gray-500 shadow-md">
              "Building the future, one line of code at a time."
            </div>
          </div>

          {/* Floating AI Chat Widget card */}
          <div className="w-full max-w-[285px] rounded-xl border border-[#2a2a2a] bg-[#101010]/85 backdrop-blur-md shadow-2xl p-5 space-y-4 relative z-10 hover:border-white/20 transition-all duration-300 lg:translate-y-8 lg:translate-x-4">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
              <div className="flex items-center gap-2">
                <div className="relative w-7 h-7 rounded-full overflow-hidden bg-white/[0.02] border border-white/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#4da3ff] border border-[#101010] animate-ping" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#4da3ff] border border-[#101010]" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-xs text-white font-heading">Yatnesh AI</p>
                  <p className="text-[8px] text-gray-500 uppercase tracking-widest font-bold font-mono">Agent standby</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="space-y-3 text-left">
              <div className="p-3.5 rounded-lg bg-[#050505] border border-white/[0.04]">
                <p className="text-[10px] leading-relaxed text-[#B5B5B5] font-normal">
                  "Hello! Ask me about Yatnesh's experience with multi-tenant architectures or check his case studies."
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2">
              <button 
                onClick={handleOrbClick}
                className="flex-1 py-2 rounded-lg bg-white text-[#050505] hover:bg-zinc-200 text-[10px] font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Text chat</span>
              </button>

              <button 
                onClick={handleOrbClick}
                className="py-2 px-3.5 rounded-lg border border-[#2a2a2a] hover:bg-white/[0.03] hover:border-white/30 text-gray-400 hover:text-white transition-all flex items-center justify-center shrink-0 cursor-pointer"
                title="Voice Interface"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default About;
