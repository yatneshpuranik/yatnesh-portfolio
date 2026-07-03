import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, Layers, Box, Compass, Cloud, Server, Database, Workflow, Sparkles 
} from 'lucide-react';
import Reveal from '../UI/Reveal';

/**
 * BentoFocusCard: Premium asymmetrical grid item with custom tilt physics,
 * spotlight highlight followers, and silver border borders.
 */
const BentoFocusCard = ({ title, status, desc, resources, icon, progress, colSpan }) => {
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
      whileHover={{ y: -4 }}
      className={`glass-card p-8 rounded-2xl relative flex flex-col justify-between overflow-hidden group cursor-pointer spotlight-card ${colSpan}`}
    >
      {/* Background radial spotlight follower */}
      <div className="absolute inset-0 bg-white/[0.003] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Content */}
      <div className="space-y-6 relative z-10 text-left">
        
        {/* Header: Large Icon & Learning Status */}
        <div className="flex items-center justify-between">
          <span className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white shrink-0 group-hover:scale-103 transition-transform duration-300">
            {icon}
          </span>
          <span className="text-[8px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded bg-[#050505] border border-white/[0.06] text-gray-400 group-hover:border-white/20 transition-all">
            {status}
          </span>
        </div>

        {/* Title & One-Line Description */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xl font-bold text-white font-heading tracking-tight leading-none">{title}</h3>
          <p className="text-xs text-[#b5b5b5] font-light leading-relaxed font-sans">{desc}</p>
        </div>

      </div>

      {/* Progress & Labs Resources */}
      <div className="pt-6 border-t border-white/[0.04] space-y-4 relative z-10 text-left">
        
        {/* Progress Bar (monochrome white dot indicator trailing along thin line) */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[9px] font-mono text-gray-500 font-bold uppercase tracking-wider">
            <span>Modules Complete</span>
            <span className="text-white">{progress}%</span>
          </div>
          <div className="h-[2px] w-full bg-white/5 rounded-full relative overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute left-0 top-0 bottom-0 bg-white"
            />
          </div>
        </div>

        {/* Lab Resources */}
        <div className="flex justify-between items-center text-[9px] font-mono text-gray-600 uppercase">
          <span>Source:</span>
          <span className="text-gray-400 font-bold truncate max-w-[160px]">{resources}</span>
        </div>

      </div>
    </motion.div>
  );
};

const Roadmap = () => {
  const steps = [
    {
      title: 'System Design',
      status: 'Scale Tuning',
      desc: 'Reviewing rate limiters, load balancers, database scaling paradigms, and caching architectures.',
      resources: 'Whitepapers & RFCs',
      icon: <Server className="w-5 h-5 text-white" />,
      progress: 90,
      colSpan: 'md:col-span-2 lg:col-span-2'
    },
    {
      title: 'Microservices',
      status: 'Optimization',
      desc: 'Decomposing monolith architectures, handling cross-service communications, and API gateway routing.',
      resources: 'Docker Swarm Labs',
      icon: <Layers className="w-5 h-5 text-white" />,
      progress: 85,
      colSpan: 'md:col-span-1 lg:col-span-2'
    },
    {
      title: 'Kafka Streaming',
      status: 'Implementation',
      desc: 'Designing distributed messaging logs, partitioning event buffers, and managing consumers clusters.',
      resources: 'Confluent Platform',
      icon: <Cpu className="w-5 h-5 text-white" />,
      progress: 70,
      colSpan: 'md:col-span-1 lg:col-span-1'
    },
    {
      title: 'Redis Caching',
      status: 'Active Lab',
      desc: 'Configuring cache replication clusters, pub-sub messaging networks, and session data invalidation streams.',
      resources: 'Redis Cluster Specs',
      icon: <Database className="w-5 h-5 text-white" />,
      progress: 95,
      colSpan: 'md:col-span-2 lg:col-span-2'
    },
    {
      title: 'Kubernetes',
      status: 'Orchestration',
      desc: 'Deploying service orchestrations, managing cluster namespaces, config maps, and container lifecycles.',
      resources: 'K8s Cluster Setup',
      icon: <Compass className="w-5 h-5 text-white" />,
      progress: 75,
      colSpan: 'md:col-span-1 lg:col-span-1'
    },
    {
      title: 'Docker Clusters',
      status: 'Virtualization',
      desc: 'Managing container clustering, overlay networks, stateful services, and localized container replication scales.',
      resources: 'Compose specifications',
      icon: <Box className="w-5 h-5 text-white" />,
      progress: 90,
      colSpan: 'md:col-span-1 lg:col-span-1'
    },
    {
      title: 'CI / CD Pipelines',
      status: 'Automation',
      desc: 'Configuring GitHub Actions workflows, container build pipelines, and automated cloud release systems.',
      resources: 'GitHub Action Hooks',
      icon: <Workflow className="w-5 h-5 text-white" />,
      progress: 85,
      colSpan: 'md:col-span-1 lg:col-span-1'
    },
    {
      title: 'Cloud Systems',
      status: 'Deployment',
      desc: 'Configuring virtual cloud environments, EC2 instances, serverless runtimes, and secured storage streams.',
      resources: 'AWS Cloud Services',
      icon: <Cloud className="w-5 h-5 text-white" />,
      progress: 80,
      colSpan: 'md:col-span-2 lg:col-span-2'
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  return (
    <section id="roadmap" className="py-28 border-t border-white/[0.08] text-left select-none relative overflow-hidden">
      
      <div className="space-y-12">
        
        {/* Title */}
        <div className="flex items-center space-x-4 mb-4">
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2 font-heading">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
            <span>Technology Focus</span>
          </h2>
          <div className="h-[1px] bg-gradient-to-r from-white/20 to-transparent flex-grow" />
        </div>

        {/* Asymmetrical Apple-style bento grid of technology focus blocks */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((step, idx) => (
            <Reveal key={idx} delay={idx * 0.05}>
              <BentoFocusCard
                title={step.title}
                status={step.status}
                desc={step.desc}
                resources={step.resources}
                icon={step.icon}
                progress={step.progress}
                colSpan={step.colSpan}
              />
            </Reveal>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Roadmap;
