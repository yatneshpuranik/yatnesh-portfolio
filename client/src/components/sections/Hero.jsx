import React from 'react';
import { FileText, ArrowRight, Github, Linkedin, Mail, Sparkles, ArrowDown } from 'lucide-react';
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
        return <Github className="w-5 h-5" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />;
      case 'email':
      case 'mail':
        return <Mail className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const summaryText = profile?.bio || "Full Stack Software Engineer building production-grade SaaS products, AI-powered platforms and secure backend systems.";

  // Staggered layout animation configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 90, damping: 14 }
    }
  };

  const buttonVariants = {
    hidden: { scale: 0.96, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 90, damping: 14 }
    }
  };

  return (
    <section id="hero" className="relative pt-20 pb-12 sm:pb-16 lg:pb-20 select-none overflow-hidden w-full">
      {/* Inject custom media-query stylesheet for the precise 3-column grid structure */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media (min-width: 1024px) {
          .hero-grid-custom {
            display: grid !important;
            grid-template-columns: minmax(0, 32fr) minmax(0, 36fr) minmax(0, 32fr) !important;
            gap: 40px !important;
            box-sizing: border-box !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}} />

      {/* Grid container spanning max-width 1400px and px-20 on desktop (0 80px margins) */}
      <div className="grid grid-cols-1 hero-grid-custom items-start w-full relative z-10">

        {/* COLUMN 1: LEFT SIDE (Text Info, CTAs) - Top-aligned pt-0 */}
        <div className="flex flex-col justify-start h-full pt-0 space-y-0 text-center lg:text-left items-center lg:items-start order-1 w-full max-w-full lg:max-w-md box-border px-4 sm:px-6 lg:px-0">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full space-y-0"
          >
            {/* Accent Line: 60px wide, 3px tall, margin-bottom 24px */}
            <div className="w-[60px] h-[3px] bg-[#4FA3FF] rounded-full mb-6 mx-auto lg:mx-0" />

            {/* Eyebrow text: uppercase, letter-spaced, margin-bottom 16px */}
            <motion.span
              variants={itemVariants}
              className="text-xs sm:text-sm font-mono tracking-widest text-[#B5B5B5] uppercase block font-bold mb-4"
            >
              I'M YATNESH, A
            </motion.span>

            {/* Name Heading: 2 lines, large, margin-bottom 20px */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] font-heading mb-5"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E5E5E5] to-zinc-400 block font-extrabold">
                Full Stack <br />Developer
              </span>
            </motion.h1>

            {/* Tagline Paragraph: max 3 lines, margin-bottom 24px */}
            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base leading-relaxed text-gray-400 max-w-md font-light font-sans mx-auto lg:mx-0 mb-6 w-full box-border"
            >
              3+ years building web systems — from a self-initiated Multi-Tenant SaaS CRM project engineered to production-grade scalability standards, to advanced interactive AI tools. I ship fast and think in systems.
            </motion.p>

            {/* Buttons Row: margin-bottom 16px */}
            <motion.div
              variants={containerVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-4"
            >
              <motion.a
                variants={buttonVariants}
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-premium btn-premium-primary text-xs flex items-center justify-center gap-1.5 shadow-md w-full sm:w-auto cursor-pointer whitespace-nowrap px-6 py-3 min-w-[160px]"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
              </motion.a>

              <motion.button
                variants={buttonVariants}
                onClick={handleTalkToAI}
                className="btn-premium btn-premium-secondary text-xs flex items-center justify-center gap-1.5 w-full sm:w-auto cursor-pointer whitespace-nowrap px-6 py-3 min-w-[160px]"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Talk with AI</span>
              </motion.button>
            </motion.div>

            {/* Resume button */}
            {activeResume && (
              <motion.div variants={itemVariants} className="flex justify-center lg:justify-start">
                <a
                  href={activeResume}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-premium btn-premium-secondary text-xs flex items-center gap-1.5 w-full sm:w-fit cursor-pointer justify-center"
                >
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span>Resume</span>
                </a>
              </motion.div>
            )}
          </motion.div>


        </div>

        {/* COLUMN 2: CENTER (Cutout Photo) - Top-aligned pt-0, fills column height */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.0 }}
          className="flex items-start justify-center pointer-events-none order-2 h-[400px] sm:h-[480px] lg:h-full relative overflow-visible pt-0"
          style={{ backgroundImage: 'none', boxShadow: 'none', border: 'none' }}
        >
          <Hero3D avatarUrl={profile?.avatarUrl} />
        </motion.div>

        {/* COLUMN 3: FAR RIGHT (Info stacks) - Top-aligned pt-0, borderless plain text */}
        <div className="flex flex-col justify-start h-full pt-0 space-y-6 order-3 text-center lg:text-left items-center lg:items-start z-10 w-full max-w-full lg:max-w-sm box-border px-4 sm:px-6 lg:px-0">

          <div className="w-full space-y-6 max-w-sm lg:max-w-none">
            {/* ABOUT ME block */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-widest text-[#B5B5B5] uppercase block font-bold">
                About Me
              </span>
              <p className="text-xs text-gray-400 font-sans leading-relaxed pl-3">
                3+ years engineering web systems. Currently building a production-ready multi-tenant SaaS CRM project, engineering microservices, and designing interactive AI-powered dashboards with JavaScript/MERN.
              </p>
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-mono font-bold text-white hover:underline inline-flex items-center gap-1 pt-1 cursor-pointer"
              >
                <span>Learn More</span>
                <span className="text-xs">→</span>
              </a>
            </div>

            {/* Thin plain gray divider */}
            <div className="w-full h-[1px] bg-white/[0.08]" />

            {/* MY WORK block */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-widest text-[#B5B5B5] uppercase block font-bold">
                My Work
              </span>
              <p className="text-xs text-gray-400 font-sans leading-relaxed pl-3">
                5+ full-stack projects engineered to production standards — from multi-tenant SaaS CRM architectures to AI mock interview simulators. Real engineering, serious code.
              </p>
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-mono font-bold text-white hover:underline inline-flex items-center gap-1 pt-1 cursor-pointer"
              >
                <span>Browse Portfolio</span>
                <span className="text-xs">→</span>
              </a>
            </div>

            {/* Thin plain gray divider */}
            <div className="w-full h-[1px] bg-white/[0.08]" />

            {/* FOLLOW ME block */}
            {socials && socials.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase block font-bold">
                  Follow Me
                </span>
                <div className="flex items-center justify-center lg:justify-start space-x-5 pt-1">
                  {socials.map((link) => (
                    <a
                      key={link._id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                      title={link.name}
                    >
                      {getSocialIcon(link.name) || <span className="font-mono text-xs">{link.name[0]}</span>}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
