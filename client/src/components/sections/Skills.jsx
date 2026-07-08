import React from 'react';
import { motion } from 'framer-motion';

const techData = [
  {
    name: 'React',
    desc: 'Declarative, component-based library for building highly interactive single-page frontends.',
    glowColor: 'rgba(0, 216, 255, 0.28)',
    borderGlow: 'border-[#00d8ff]/30 hover:border-[#00d8ff]/60',
    logo: (
      <svg viewBox="-11.5 -10.23 23 20.46" className="w-6 h-6 text-[#00d8ff] fill-none stroke-current stroke-[1.5]">
        <circle cx="0" cy="0" r="2.05" className="fill-current" />
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </svg>
    )
  },
  {
    name: 'JavaScript',
    desc: 'High-level, dynamic language powering asynchronous loops and robust client-side execution.',
    glowColor: 'rgba(247, 223, 30, 0.22)',
    borderGlow: 'border-[#f7df1e]/30 hover:border-[#f7df1e]/60',
    logo: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#f7df1e] fill-current">
        <path d="M3 3h18v18H3V3zm10.57 14.28c.36.63.78 1.16 1.48 1.16.66 0 1.08-.33 1.08-.84 0-.58-.45-.78-1.22-1.11l-.42-.18c-1.23-.51-2.04-1.17-2.04-2.61 0-1.35 1.05-2.4 2.76-2.4 1.32 0 2.13.54 2.58 1.41l-1.32.84c-.3-.54-.69-.81-1.23-.81-.6 0-.87.33-.87.75 0 .51.36.72 1.08 1.02l.42.18c1.47.63 2.22 1.26 2.22 2.73 0 1.59-1.23 2.64-3.12 2.64-1.89 0-2.91-1.02-3.39-2.13l1.41-.88zm-5.91-.04c.15.39.48.69.96.69.45 0 .72-.21.72-.81V9.5h1.74v7.71c0 1.95-1.14 2.79-2.82 2.79-1.62 0-2.49-.87-2.85-1.89l1.41-.8c.24.48.51.69.84.69z" />
      </svg>
    )
  },
  {
    name: 'TypeScript',
    desc: 'Statically typed superset of JavaScript adding type safety and scalable interface definitions.',
    glowColor: 'rgba(49, 120, 198, 0.28)',
    borderGlow: 'border-[#3178c6]/30 hover:border-[#3178c6]/60',
    logo: (
      <div className="w-6 h-6 flex items-center justify-center font-heading font-extrabold text-[12px] text-[#3178c6] tracking-tighter">ts</div>
    )
  },
  {
    name: 'Node.js',
    desc: 'Asynchronous event-driven JavaScript engine running on Chrome\'s V8 engine.',
    glowColor: 'rgba(51, 153, 51, 0.28)',
    borderGlow: 'border-[#339933]/30 hover:border-[#339933]/60',
    logo: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#339933] fill-current">
        <path d="M12.42 21h-.84c-.45 0-.9-.23-1.12-.62l-6-10.4a1.29 1.29 0 0 1 0-1.28l6-10.4c.22-.39.67-.62 1.12-.62h.84c.45 0 .9.23 1.12.62l6 10.4a1.29 1.29 0 0 1 0 1.28l-6 10.4c-.22.39-.67.62-1.12.62zm-5.26-11.23l4.84 8.39V8.58l-4.84 1.19zm10.52 0l-4.84-1.19v10.78l4.84-8.39-.01.01z" />
      </svg>
    )
  },
  {
    name: 'Express.js',
    desc: 'Minimalist web application framework for structuring modular REST API gateways.',
    glowColor: 'rgba(255, 255, 255, 0.22)',
    borderGlow: 'border-white/20 hover:border-white/50',
    logo: (
      <div className="w-6 h-6 flex items-center justify-center font-heading font-extrabold text-[12px] text-white tracking-tighter">ex</div>
    )
  },
  {
    name: 'MongoDB',
    desc: 'Document NoSQL database for rapid schema mapping and horizontal shard clustering.',
    glowColor: 'rgba(19, 170, 82, 0.28)',
    borderGlow: 'border-[#13aa52]/30 hover:border-[#13aa52]/60',
    logo: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#13aa52] fill-current">
        <path d="M17.15 11.2c-.3-.4-2.8-3.4-3.5-4.2-.7-.8-1.1-1.6-1.3-2.3a8.9 8.9 0 0 1-.3-1.8 8.8 8.8 0 0 1-.3 1.8c-.2.7-.6 1.5-1.3 2.3-.7.8-3.2 3.8-3.5 4.2C6 12.3 5.4 13.7 5.4 15.2c0 3.7 3 6.7 6.6 6.7s6.6-3 6.6-6.7c0-1.5-.6-2.9-1.5-4zM12 20.3c-2.8 0-5.1-2.3-5.1-5.1 0-.9.2-1.7.7-2.4l4.4-5.6V20.3z" />
      </svg>
    )
  },
  {
    name: 'PostgreSQL',
    desc: 'Object-relational SQL database focused on strict compliance and schema integrity.',
    glowColor: 'rgba(51, 103, 145, 0.28)',
    borderGlow: 'border-[#336791]/30 hover:border-[#336791]/60',
    logo: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#336791] fill-current">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5c-3.03 0-5.5-2.47-5.5-5.5s2.47-5.5 5.5-5.5c2.43 0 4.47 1.57 5.17 3.75h-2.14C13.43 9.4 12.3 8.7 11 8.7c-1.82 0-3.3 1.48-3.3 3.3s1.48 3.3 3.3 3.3c1.3 0 2.43-.7 3.03-1.75H17.2c-.7 2.18-2.74 3.75-5.2 3.75z" />
      </svg>
    )
  },
  {
    name: 'C++',
    desc: 'General-purpose systems compiler language providing low-level memory management.',
    glowColor: 'rgba(0, 89, 156, 0.28)',
    borderGlow: 'border-[#00599c]/30 hover:border-[#00599c]/60',
    logo: (
      <div className="w-6 h-6 flex items-center justify-center font-heading font-extrabold text-[12px] text-[#00599c] tracking-tighter">c++</div>
    )
  },
  {
    name: 'C',
    desc: 'Procedural programming language laying the foundation for core hardware abstractions.',
    glowColor: 'rgba(168, 185, 204, 0.22)',
    borderGlow: 'border-[#a8b9cc]/30 hover:border-[#a8b9cc]/60',
    logo: (
      <div className="w-6 h-6 flex items-center justify-center font-heading font-extrabold text-[12px] text-[#a8b9cc] tracking-tighter">c</div>
    )
  },
  {
    name: 'OOP',
    desc: 'Design paradigm mapping logic to objects, encapsulation, polymorphism, and inheritance.',
    glowColor: 'rgba(255, 255, 255, 0.15)',
    borderGlow: 'border-white/10 hover:border-white/30',
    logo: (
      <div className="w-6 h-6 flex items-center justify-center font-heading font-extrabold text-[10px] text-zinc-400 tracking-tighter">oop</div>
    )
  },
  {
    name: 'Operating Systems',
    desc: 'Kernel configurations managing process schedules, CPU thread memory, and paging storage.',
    glowColor: 'rgba(255, 255, 255, 0.15)',
    borderGlow: 'border-white/10 hover:border-white/30',
    logo: (
      <div className="w-6 h-6 flex items-center justify-center font-heading font-extrabold text-[9px] text-zinc-400 tracking-tighter">os</div>
    )
  },
  {
    name: 'Computer Networks',
    desc: 'TCP/IP routing, socket networks, packets transmission, and DNS load architectures.',
    glowColor: 'rgba(255, 255, 255, 0.15)',
    borderGlow: 'border-white/10 hover:border-white/30',
    logo: (
      <div className="w-6 h-6 flex items-center justify-center font-heading font-extrabold text-[9px] text-zinc-400 tracking-tighter">cn</div>
    )
  },
  {
    name: 'DBMS',
    desc: 'Database relational modeling, normalizations, SQL optimization, and indexing transactions.',
    glowColor: 'rgba(255, 255, 255, 0.15)',
    borderGlow: 'border-white/10 hover:border-white/30',
    logo: (
      <div className="w-6 h-6 flex items-center justify-center font-heading font-extrabold text-[9px] text-zinc-400 tracking-tighter">dbms</div>
    )
  },
  {
    name: 'DSA',
    desc: 'Asymptotic analysis, trees, dynamic programming structures, and optimal algorithmic workflows.',
    glowColor: 'rgba(255, 255, 255, 0.15)',
    borderGlow: 'border-white/10 hover:border-white/30',
    logo: (
      <div className="w-6 h-6 flex items-center justify-center font-heading font-extrabold text-[9px] text-zinc-400 tracking-tighter">dsa</div>
    )
  },
  {
    name: 'Git',
    desc: 'Distributed version control engine managing staging, commits tree histories, and merging.',
    glowColor: 'rgba(240, 80, 50, 0.28)',
    borderGlow: 'border-[#f05032]/30 hover:border-[#f05032]/60',
    logo: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#f05032] fill-current">
        <path d="M23.3 10.9L13.1 0.7c-.9-.9-2.4-.9-3.3 0L7.2 3.3l2.8 2.8c.7-.2 1.5.1 2 .6.5.5.7 1.3.5 2l2.9 2.9c.7-.2 1.5.1 2 .6.7.7.7 1.8 0 2.5s-1.8.7-2.5 0c-.5-.5-.7-1.2-.6-1.9l-2.9-2.9c-.2.1-.4.2-.6.2s-.4-.1-.6-.2L7.3 13c.2.7-.1 1.5-.6 2-.7.7-1.8.7-2.5 0s-.7-1.8 0-2.5c.5-.5 1.2-.7 1.9-.6l2.8-2.8-2.8-2.8L0.7 10.9c-.9.9-.9 2.4 0 3.3l10.2 10.2c.9.9 2.4.9 3.3 0l10.2-10.2c.9-.9.9-2.4 0-3.3z"/>
      </svg>
    )
  },
  {
    name: 'GitHub',
    desc: 'Cloud repository platform hosting collaboration releases, pull updates, and pipeline actions.',
    glowColor: 'rgba(255, 255, 255, 0.22)',
    borderGlow: 'border-white/20 hover:border-white/50',
    logo: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    )
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04
    }
  }
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 130, damping: 22 }
  }
};

const Skills = () => {
  return (
    <section id="skills" className="py-28 border-t border-white/[0.08] text-left select-none relative">
      <div className="space-y-16">
        
        {/* Title */}
        <div className="flex items-center space-x-4">
          <h2 className="text-3xl font-bold tracking-tight text-white font-heading mobile-section-title">Technology Focus</h2>
          <div className="h-[1px] bg-gradient-to-r from-white/20 to-transparent flex-grow" />
        </div>

        {/* 1. Desktop Layout (With description) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="hidden md:grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {techData.map((tech) => (
            <motion.div
              key={tech.name}
              variants={cardVariants}
              whileHover={{ 
                y: -4,
                boxShadow: `0 12px 30px -5px ${tech.glowColor}, 0 0 15px rgba(255,255,255,0.01)`
              }}
              className={`p-6 rounded-xl border bg-[#101010]/45 backdrop-blur-md flex flex-col items-center md:items-start gap-4 text-center md:text-left transition-all duration-300 relative overflow-hidden group border-white/[0.08] ${tech.borderGlow}`}
            >
              {/* Radial gradient background light */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(150px circle at 30px 30px, ${tech.glowColor}, transparent 80%)`
                }}
              />

              {/* Logo capsule */}
              <div className="w-11 h-11 rounded-lg bg-black border border-white/[0.04] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300 relative z-10">
                {tech.logo}
              </div>

              {/* Title & Desc */}
              <div className="space-y-1 relative z-10">
                <h3 className="font-heading font-extrabold text-sm text-white">{tech.name}</h3>
                <p className="text-[11px] text-[#b5b5b5] leading-relaxed font-sans font-light mt-1">
                  {tech.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 2. Mobile Layout (No description, compact 2-column cards) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:hidden grid-cols-2 gap-4"
        >
          {techData.map((tech) => (
            <motion.div
              key={tech.name}
              variants={cardVariants}
              className={`p-4 rounded-xl border bg-[#101010]/45 backdrop-blur-md flex items-center gap-3 transition-all duration-300 border-white/[0.08] ${tech.borderGlow}`}
            >
              <div className="w-8 h-8 rounded-lg bg-black border border-white/[0.04] flex items-center justify-center shrink-0">
                {tech.logo}
              </div>
              <span className="font-heading font-extrabold text-xs text-white truncate">{tech.name}</span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Skills;
