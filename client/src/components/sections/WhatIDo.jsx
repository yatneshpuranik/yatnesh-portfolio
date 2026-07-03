import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Globe, Server, Brain, Cloud, ArrowUpRight } from 'lucide-react';

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 18 }
  }
};

/**
 * BentoCard: Asymmetrical grid card with custom mouse spotlight glow follower.
 * Re-themed to Minimal Premium Monochrome.
 */
const BentoCard = ({ title, desc, icon, badgeBg, colSpan }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      variants={cardVariants}
      whileHover={{ y: -4 }}
      className={`glass-card p-8 rounded-2xl relative flex flex-col justify-between h-full min-h-[250px] overflow-hidden group cursor-pointer spotlight-card ${colSpan}`}
    >
      {/* Content */}
      <div className="space-y-4 text-left relative z-10">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${badgeBg} border border-white/[0.04] transition-transform duration-300 group-hover:scale-105`}>
          {icon}
        </div>
        
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-white group-hover:text-white transition-colors font-heading">{title}</h3>
          <p className="text-xs text-[#b5b5b5] leading-relaxed font-normal font-sans">{desc}</p>
        </div>
      </div>

      {/* Action link */}
      <div className="flex justify-end pt-4 relative z-10">
        <div className="p-1.5 rounded bg-white/[0.02] border border-white/[0.04] text-gray-500 group-hover:text-white group-hover:bg-white/[0.04] group-hover:border-white/20 transition-all">
          <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};

const WhatIDo = () => {
  const services = [
    {
      title: 'Web Engineering',
      desc: 'Building responsive, premium frontends using React, Next.js, and modern CSS libraries with micro-interactions and smooth kinetic routing.',
      icon: <Globe className="w-5 h-5 text-white" />,
      badgeBg: 'bg-white/[0.03]',
      colSpan: 'lg:col-span-3'
    },
    {
      title: 'Backend Systems',
      desc: 'Engineering robust REST and GraphQL API services, row-level tenant database separation models, and caching pipelines.',
      icon: <Server className="w-5 h-5 text-white" />,
      badgeBg: 'bg-white/[0.03]',
      colSpan: 'lg:col-span-3'
    },
    {
      title: 'AI Architectures',
      desc: 'Developing conversational voice engines, AI agents, and integrating Large Language Models like Gemini for custom SaaS applications.',
      icon: <Brain className="w-5 h-5 text-white" />,
      badgeBg: 'bg-white/[0.03]',
      colSpan: 'lg:col-span-2'
    },
    {
      title: 'Cloud & Infrastructure',
      desc: 'Deploying dockerized multi-service networks, configuring load balancer rules, and orchestrating server clusters on AWS.',
      icon: <Cloud className="w-5 h-5 text-white" />,
      badgeBg: 'bg-white/[0.03]',
      colSpan: 'lg:col-span-4'
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section id="what-i-do" className="py-28 border-t border-white/[0.08] text-left relative overflow-hidden select-none">
      
      {/* Title */}
      <div className="flex items-center space-x-4 mb-16">
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2 font-heading">
          <span>What I Do</span>
        </h2>
        <div className="h-[1px] bg-gradient-to-r from-white/20 to-transparent flex-grow" />
      </div>

      {/* Asymmetric Bento Grid Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6"
      >
        {services.map((svc, idx) => (
          <BentoCard
            key={idx}
            title={svc.title}
            desc={svc.desc}
            icon={svc.icon}
            badgeBg={svc.badgeBg}
            colSpan={svc.colSpan}
          />
        ))}
      </motion.div>
      
    </section>
  );
};

export default WhatIDo;
