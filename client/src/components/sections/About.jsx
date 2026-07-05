import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, MessageSquare, Mic, Briefcase, FolderOpen, Award } from 'lucide-react';
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
                My approach combines clean architectural patterns, database optimization, and interactive client integrations to construct robust web products that scale effortlessly.
              </p>

              {/* Working Philosophy Pull-quote */}
              <div className="pl-4 border-l-2 border-zinc-500 italic my-6 space-y-1">
                <p className="text-lg text-white font-sans font-light leading-relaxed">
                  "I build independently, not because I have to, but because I want to understand systems deeply — from architecture to edge cases. Every project I build, I ask: how would this hold up at real-world scale?"
                </p>
                <p className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-bold">WORKING PHILOSOPHY</p>
              </div>
            </div>
          </Reveal>

          {/* Stats Section with CountUp trigger */}
          <motion.div
            onViewportEnter={() => setHasScrolledIntoView(true)}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10"
          >
            {/* Stat 1 */}
            <div className="space-y-1.5 text-left flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.04] text-white mt-1">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <div className="space-y-0.5">
                <div className="text-3xl sm:text-4xl font-heading font-black text-white">
                  {hasScrolledIntoView ? <CountUp to={1} /> : "0"}
                </div>
                <div className="text-[10px] font-heading text-gray-550 uppercase tracking-widest font-bold">Internship</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="space-y-1.5 text-left flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.04] text-white mt-1">
                <FolderOpen className="w-4 h-4 text-white" />
              </div>
              <div className="space-y-0.5">
                <div className="text-3xl sm:text-4xl font-heading font-black text-white">
                  {hasScrolledIntoView ? <CountUp to={9} /> : "0"}
                </div>
                <div className="text-[10px] font-heading text-gray-550 uppercase tracking-widest font-bold">Projects Built</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="space-y-1.5 text-left flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.04] text-white mt-1">
                <Award className="w-4 h-4 text-white" />
              </div>
              <div className="space-y-0.5">
                <div className="text-3xl sm:text-4xl font-heading font-black text-white">
                  {hasScrolledIntoView ? <CountUp to={2} /> : "0"}
                </div>
                <div className="text-[10px] font-heading text-gray-550 uppercase tracking-widest font-bold">Research Papers</div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Arc Reactor Core & Sticky AI Chat Widget */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[420px] space-y-6">

          {/* Large Glowing Arc Reactor Core (z-0) */}
          <div className="absolute inset-0 z-0 flex items-center justify-center lg:-translate-y-8 select-none pointer-events-none">
            {/* Ambient breathing glow */}
            <div className="absolute w-44 h-44 rounded-full bg-cyan-500/5 blur-[40px] animate-pulse" />

            <div className="w-48 h-48 relative flex items-center justify-center">
              {/* Inner glowing white-cyan core */}
              <div />


            </div>
          </div>

          {/* Floating AI Chat Widget card */}
          <div className="w-full max-w-[285px] rounded-xl border border-[#2a2a2a] bg-[#101010]/85 backdrop-blur-md shadow-2xl p-5 space-y-4 relative z-10 hover:border-white/20 transition-all duration-300 lg:translate-y-8 lg:translate-x-4">

            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
              <div className="flex items-center gap-2">
                <div className="relative w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.3)] animate-pulse">
                  <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_6px_#00d8ff]" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-xs text-white font-heading">Yatnesh AI</p>
                  <p className="text-[8px] text-gray-500 uppercase tracking-widest font-bold font-mono">Speaker</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="space-y-3 text-left">
              <div className="p-3.5 rounded-lg bg-[#050505] border border-white/[0.04]">
                <p className="text-[10px] leading-relaxed text-[#B5B5B5] font-normal">
                  "Hello! Ask me about Yatnesh's experience and work."
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
