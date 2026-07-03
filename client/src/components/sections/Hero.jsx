import React from 'react';
import { FileText, ArrowRight, Github, Linkedin, Mail, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Hero3D from './Hero3D';

const Hero = React.memo(({ profile, settings, socials }) => {
  const activeResume = settings?.resumeUrl;

  const handleTalkToAI = () => {
    // Trigger custom event to open AI voice console
    window.dispatchEvent(new CustomEvent('open-ai-chat'));
  };

  const getSocialIcon = (name) => {
    switch (name.toLowerCase()) {
      case 'github':
        return <Github className="w-4 h-4 text-white" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4 text-white" />;
      case 'email':
      case 'mail':
        return <Mail className="w-4 h-4 text-white" />;
      default:
        return null;
    }
  };

  const summaryText = "Full Stack Software Engineer building production-grade SaaS products, AI-powered platforms and secure backend systems.";

  // Staggered layout animation configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const buttonVariants = {
    hidden: { scale: 0.96, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <section id="hero" className="min-h-[calc(100vh-6rem)] flex items-center relative pt-10 pb-16 lg:pt-12 lg:pb-20 select-none overflow-hidden">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full relative z-10">

        {/* Left Column: Info details (6 cols) */}
        <div className="lg:col-span-6 flex flex-col space-y-8 pr-4">

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Pill Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[9px] font-mono text-white/80 font-bold uppercase tracking-widest w-fit"
            >
              <Sparkles className="w-3 h-3 text-white animate-pulse" />
              <span>Full Stack Software Engineer</span>
            </motion.div>

            {/* Title / Name (Reveal effect) */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-7xl font-extrabold tracking-tight leading-none font-heading"
            >
              Hi, I'm <br className="sm:hidden" />
              <span className="text-gradient-shimmer">
                Yatnesh Puranik
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg leading-relaxed text-[#B5B5B5] max-w-xl font-light font-sans"
            >
              {summaryText}
            </motion.p>

            {/* Tech Stack List */}
            <motion.div
              variants={itemVariants}
              className="flex items-center flex-wrap gap-x-3 gap-y-1.5 text-[10px] font-mono text-gray-500 font-bold uppercase tracking-wider"
            >
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-white/40" /> React</span>
              <span>·</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-white/40" /> Node.js</span>
              <span>·</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-white/40" /> MongoDB</span>
              <span>·</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-white/40" /> AWS</span>
              <span>·</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-white/40" /> Next.js</span>
            </motion.div>

            {/* Staggered buttons entrance */}
            <motion.div
              variants={containerVariants}
              className="flex flex-wrap gap-4 pt-2"
            >
              <motion.a
                variants={buttonVariants}
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-premium btn-premium-primary text-xs flex items-center gap-1.5 shadow-md"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
              </motion.a>

              <motion.button
                variants={buttonVariants}
                onClick={handleTalkToAI}
                className="btn-premium btn-premium-secondary text-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Talk with AI</span>
              </motion.button>

              {activeResume && (
                <motion.a
                  variants={buttonVariants}
                  href={activeResume}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-premium btn-premium-secondary text-xs flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span>Resume</span>
                </motion.a>
              )}
            </motion.div>

            {/* Socials Connection */}
            {socials && socials.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="flex items-center space-x-4 pt-6 border-t border-white/[0.06] max-w-md"
              >
                <span className="text-[9px] font-mono tracking-widest text-gray-500 uppercase font-bold">Secure Ports:</span>
                <div className="flex items-center space-x-3">
                  {socials.map((link) => (
                    <a
                      key={link._id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-lg border border-[#2a2a2a] bg-[#101010] text-gray-400 hover:text-white hover:border-white/30 hover:bg-white/[0.02] transition-all duration-300 cursor-pointer"
                      title={link.name}
                    >
                      {getSocialIcon(link.name) || <span className="font-mono text-xs">{link.name[0]}</span>}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

        </div>

        {/* Right Column: Premium Glassmorphic Portrait Frame (6 cols) */}
        <div className="lg:col-span-6 w-full flex justify-center items-center relative z-0 h-[480px] lg:h-[550px]">

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1.2 }}
            className="w-full h-full"
          >
            <Hero3D avatarUrl={profile?.avatarUrl} />
          </motion.div>

        </div>

      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
