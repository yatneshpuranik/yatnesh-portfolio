import React from 'react';
import { motion } from 'framer-motion';

const learningData = [
  {
    name: 'Docker',
    desc: 'Uniform container builds enclosing services to run environments everywhere without dependency drift.',
    glowColor: 'rgba(36, 150, 237, 0.22)',
    borderGlow: 'border-[#2496ed]/20 hover:border-[#2496ed]/50',
    logo: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#2496ed] fill-current">
        <path d="M2 11h2v2H2zm3 0h2v2H5zm3 0h2v2H8zm3 0h2v2h-2zm3 0h2v2h-2zm3-3h2v2h-2zm-3 0h2v2h-2zm-3 0h2v2h-2zm-3 0h2v2H5zm8-3h2v2h-2z" />
        <path d="M22 13c0-3.3-2.7-6-6-6h-1v2h1c2.2 0 4 1.8 4 4s-1.8 4-4 4H2v2h14c3.3 0 6-2.7 6-6z" />
      </svg>
    )
  },
  {
    name: 'Kubernetes',
    desc: 'Container management and service orchestrations for automated scaling and self-healing systems.',
    glowColor: 'rgba(50, 108, 229, 0.22)',
    borderGlow: 'border-[#326ce5]/20 hover:border-[#326ce5]/50',
    logo: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#326ce5] fill-current">
        <path d="M12 2L2 7.8v8.4L12 22l10-5.8V7.8L12 2zm0 3.2l6.5 3.8v7.6L12 20.4l-6.5-3.8V9L12 5.2z" />
      </svg>
    )
  },
  {
    name: 'NestJS',
    desc: 'Modular TypeScript node framework supporting clean model dependency injections and API decorators.',
    glowColor: 'rgba(224, 35, 78, 0.22)',
    borderGlow: 'border-[#e0234e]/20 hover:border-[#e0234e]/50',
    logo: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#e0234e] fill-current">
        <path d="M12 2L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-3zm0 18c-3.9-1-6.7-4.8-6.9-8.8h13.8c-.2 4-3 7.8-6.9 8.8z" />
      </svg>
    )
  },
  {
    name: 'Next.js',
    desc: 'React framework delivering server-side hydration pipelines and static render routes.',
    glowColor: 'rgba(255, 255, 255, 0.15)',
    borderGlow: 'border-white/10 hover:border-white/30',
    logo: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-white stroke-current fill-none stroke-[1.5]">
        <circle cx="12" cy="12" r="10" />
        <path d="M9 16V8l8 8V8" />
      </svg>
    )
  },
  {
    name: 'Redis',
    desc: 'Ultra-low latency in-memory database utilized for key-value caching and session isolation.',
    glowColor: 'rgba(216, 44, 32, 0.22)',
    borderGlow: 'border-[#d82c20]/20 hover:border-[#d82c20]/50',
    logo: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#d82c20] fill-current">
        <path d="M12 2L2 7l10 5 10-5-10-5zm0 18.25l-8-4v-3l8 4 8-4v3l-8 4zm0-5.5l-8-4v-3l8 4 8-4v3l-8 4z" />
      </svg>
    )
  },
  {
    name: 'TanStack Query',
    desc: 'Advanced client state manager syncing remote queries, garbage collections, and mutations.',
    glowColor: 'rgba(255, 65, 84, 0.22)',
    borderGlow: 'border-[#ff4154]/20 hover:border-[#ff4154]/50',
    logo: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#ff4154] fill-current">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  },
  {
    name: 'System Design',
    desc: 'High-availability infrastructure patterns, load balancers, proxies, and storage replications.',
    glowColor: 'rgba(255, 255, 255, 0.12)',
    borderGlow: 'border-white/10 hover:border-white/30',
    logo: (
      <div className="w-6 h-6 flex items-center justify-center font-heading font-extrabold text-[10px] text-zinc-400 tracking-tighter">sd</div>
    )
  },
  {
    name: 'Microservices',
    desc: 'Decomposing application components into isolated domains linked over HTTP or RPC channels.',
    glowColor: 'rgba(255, 255, 255, 0.12)',
    borderGlow: 'border-white/10 hover:border-white/30',
    logo: (
      <div className="w-6 h-6 flex items-center justify-center font-heading font-extrabold text-[10px] text-zinc-400 tracking-tighter">ms</div>
    )
  },
  {
    name: 'Message Queues',
    desc: 'Asynchronous publish-subscribe messaging systems decoupling API pipelines.',
    glowColor: 'rgba(255, 255, 255, 0.12)',
    borderGlow: 'border-white/10 hover:border-white/30',
    logo: (
      <div className="w-6 h-6 flex items-center justify-center font-heading font-extrabold text-[10px] text-zinc-400 tracking-tighter">mq</div>
    )
  },
  {
    name: 'AWS',
    desc: 'Cloud services management including EC2 computing, S3 stores, and IAM policies.',
    glowColor: 'rgba(255, 153, 0, 0.22)',
    borderGlow: 'border-orange-500/20 hover:border-orange-500/50',
    logo: (
      <div className="w-6 h-6 flex items-center justify-center font-heading font-extrabold text-[10px] text-orange-400 tracking-tighter">aws</div>
    )
  },
  {
    name: 'Advanced PostgreSQL',
    desc: 'Database tuning, index partitioning, query planning, and transactional isolation limits.',
    glowColor: 'rgba(51, 103, 145, 0.22)',
    borderGlow: 'border-[#336791]/20 hover:border-[#336791]/50',
    logo: (
      <div className="w-6 h-6 flex items-center justify-center font-heading font-extrabold text-[9px] text-[#336791] tracking-tighter">apg</div>
    )
  },
  {
    name: 'Authentication Architecture',
    desc: 'Structuring multi-tier credentials, session storages, tokens caching, and cryptographies.',
    glowColor: 'rgba(255, 255, 255, 0.12)',
    borderGlow: 'border-white/10 hover:border-white/30',
    logo: (
      <div className="w-6 h-6 flex items-center justify-center font-heading font-extrabold text-[9px] text-zinc-400 tracking-tighter">auth</div>
    )
  },
  {
    name: 'JWT + OAuth',
    desc: 'Secure stateless authorization claims and delegated third-party access providers.',
    glowColor: 'rgba(255, 255, 255, 0.12)',
    borderGlow: 'border-white/10 hover:border-white/30',
    logo: (
      <div className="w-6 h-6 flex items-center justify-center font-heading font-extrabold text-[9px] text-zinc-400 tracking-tighter">jwt</div>
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

const CurrentlyLearning = () => {
  return (
    <section id="currently-learning" className="py-28 border-t border-white/[0.08] text-left select-none relative">
      <div className="space-y-16">
        
        {/* Title */}
        <div className="flex items-center space-x-4">
          <h2 className="text-3xl font-bold tracking-tight text-white font-heading">CURRENTLY LEARNING</h2>
          <div className="h-[1px] bg-gradient-to-r from-white/20 to-transparent flex-grow" />
        </div>

        {/* Staggered Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {learningData.map((tech) => (
            <motion.div
              key={tech.name}
              variants={cardVariants}
              whileHover={{ 
                y: -4,
                boxShadow: `0 12px 30px -5px ${tech.glowColor}, 0 0 15px rgba(255,255,255,0.01)`
              }}
              className={`p-6 rounded-xl border bg-[#101010]/45 backdrop-blur-md flex flex-col gap-4 text-left transition-all duration-300 relative overflow-hidden group border-white/[0.08] ${tech.borderGlow}`}
            >
              {/* Radial gradient background light */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(150px circle at 30px 30px, ${tech.glowColor}, transparent 80%)`
                }}
              />

              {/* Top Row: Logo capsule + animated status dot indicator */}
              <div className="flex justify-between items-start relative z-10">
                <div className="w-11 h-11 rounded-lg bg-black border border-white/[0.04] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                  {tech.logo}
                </div>
                {/* Tiny glowing status dot indicator */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#050505] border border-white/[0.06] select-none text-[8px] font-mono tracking-widest text-[#4da3ff]">
                  <span className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_4px_#4da3ff]" />
                  <span>ACTIVE_LAB</span>
                </div>
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

      </div>
    </section>
  );
};

export default CurrentlyLearning;
