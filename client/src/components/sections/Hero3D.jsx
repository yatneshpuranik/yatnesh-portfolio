import React, { useState, useMemo } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

const getOptimizedCloudinaryUrl = (url, transformations = 'q_auto,f_auto') => {
  if (!url) return '';
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;
  const insertPosition = uploadIndex + '/upload/'.length;
  return `${url.slice(0, insertPosition)}${transformations}/${url.slice(insertPosition)}`;
};

const Hero3D = ({ avatarUrl }) => {
  const [hoveredLogo, setHoveredLogo] = useState(null);
  const [portraitHovered, setPortraitHovered] = useState(false);

  // Parallax Mouse tracking values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring dampeners to maintain solid 60fps animations
  const springConfig = { damping: 35, stiffness: 180, mass: 0.8 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Dynamic parallax mappings
  const bgX = useTransform(smoothX, [-250, 250], [-8, 8]);
  const bgY = useTransform(smoothY, [-250, 250], [-8, 8]);
  const connX = useTransform(smoothX, [-250, 250], [-4, 4]);
  const connY = useTransform(smoothY, [-250, 250], [-4, 4]);
  const portraitX = useTransform(smoothX, [-250, 250], [-12, 12]);
  const portraitY = useTransform(smoothY, [-250, 250], [-12, 12]);

  // Mouse 3D tilt transformations for portrait
  const rotateX = useTransform(smoothY, [-250, 250], [8, -8]);
  const rotateY = useTransform(smoothX, [-250, 250], [-8, 8]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const xVal = event.clientX - rect.left - width / 2;
    const yVal = event.clientY - rect.top - height / 2;
    mouseX.set(xVal);
    mouseY.set(yVal);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const imageUrl = useMemo(() => {
    return avatarUrl ? getOptimizedCloudinaryUrl(avatarUrl) : '/yatnesh.jpg';
  }, [avatarUrl]);

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full max-w-[500px] aspect-square relative flex items-center justify-center select-none z-10 mx-auto cursor-default animate-in fade-in duration-1000"
      style={{ perspective: 1000 }}
    >
      {/* Dynamic CSS styles for animations */}
      <style>{`
        @keyframes solar-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes solar-spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes solar-portrait-breathe {
          0%, 100% {
            box-shadow: 0 0 15px rgba(6, 182, 212, 0.12), 0 0 30px rgba(168, 85, 247, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(6, 182, 212, 0.25), 0 0 60px rgba(168, 85, 247, 0.2);
          }
        }
        .animate-solar-spin-1 {
          animation: solar-spin 40s linear infinite;
        }
        .animate-solar-spin-reverse-1 {
          animation: solar-spin-reverse 40s linear infinite;
        }
        .animate-solar-spin-2 {
          animation: solar-spin 65s linear infinite;
        }
        .animate-solar-spin-reverse-2 {
          animation: solar-spin-reverse 65s linear infinite;
        }
        .animate-solar-spin-3 {
          animation: solar-spin 90s linear infinite;
        }
        .animate-solar-spin-reverse-3 {
          animation: solar-spin-reverse 90s linear infinite;
        }
      `}</style>

      {/* Layer 1: Background Drifting Particles & Ambient glow (z-0) */}
      <motion.div 
        style={{ x: bgX, y: bgY }}
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      >
        {/* Soft Spotlight behind image */}
        <div 
          className="absolute w-[320px] h-[320px] rounded-full blur-[70px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
          style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.05) 0%, rgba(168, 85, 247, 0.025) 45%, transparent 70%)' }}
        />

        {/* Drifting Dust Particles */}
        {Array.from({ length: 12 }).map((_, idx) => (
          <motion.div
            key={idx}
            animate={{
              y: [0, -40 - (idx * 5), 0],
              x: [0, 12 - (idx * 2), 0],
              opacity: [0.03, 0.12, 0.03]
            }}
            transition={{
              duration: 14 + idx * 2.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute w-[1px] h-[1px] sm:w-[2px] sm:h-[2px] rounded-full bg-white/20"
            style={{
              left: `${8 + idx * 8}%`,
              bottom: `${12 + idx * 7}%`
            }}
          />
        ))}
      </motion.div>

      {/* Layer 2: Orbit system overlay (z-10) */}
      <motion.div 
        style={{ x: connX, y: connY }}
        className="absolute inset-0 w-full h-full pointer-events-none z-10 flex items-center justify-center"
      >
        {/* Orbit 1 (Inner) */}
        <div 
          className="absolute rounded-full border border-white/[0.05] flex items-center justify-center animate-solar-spin-1"
          style={{
            width: '58%',
            height: '58%',
            animationDuration: portraitHovered ? '80s' : '40s',
            animationPlayState: hoveredLogo !== null ? 'paused' : 'running'
          }}
        >
          {/* React Node (Top) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            {/* Glowing Star/Jarvis Node */}
            <div className="w-1.5 h-1.5 rounded-full bg-[#00d8ff] shadow-[0_0_8px_rgba(0,216,255,0.8)]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#00d8ff] absolute inset-0 animate-ping opacity-60" />
            
            {/* React Capsule */}
            <div 
              className="logo-capsule pointer-events-auto cursor-pointer animate-solar-spin-reverse-1 w-11 h-11 sm:w-13 sm:h-13 rounded-full border border-[#00d8ff]/20 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-115 hover:shadow-[0_0_20px_rgba(0,216,255,0.22)] hover:border-[#00d8ff]/45 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-1 sm:mt-1.5"
              onMouseEnter={() => setHoveredLogo('react')}
              onMouseLeave={() => setHoveredLogo(null)}
              style={{
                animationDuration: portraitHovered ? '80s' : '40s',
                animationPlayState: hoveredLogo !== null ? 'paused' : 'running'
              }}
            >
              <svg viewBox="-11.5 -10.23 23 20.46" className="w-5 h-5 sm:w-6 sm:h-6 text-[#00d8ff] fill-none stroke-current stroke-[1.2]">
                <circle cx="0" cy="0" r="2.05" className="fill-current" />
                <ellipse rx="11" ry="4.2" />
                <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                <ellipse rx="11" ry="4.2" transform="rotate(120)" />
              </svg>
            </div>
          </div>

          {/* Express Node (Bottom) */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-none">
            {/* Glowing Star/Jarvis Node */}
            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            <div className="w-1.5 h-1.5 rounded-full bg-white absolute inset-0 animate-ping opacity-60" />
            
            {/* Express Capsule */}
            <div 
              className="logo-capsule pointer-events-auto cursor-pointer animate-solar-spin-reverse-1 w-11 h-11 sm:w-13 sm:h-13 rounded-full border border-white/20 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-115 hover:shadow-[0_0_20px_rgba(255,255,255,0.18)] hover:border-white/45 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 mb-1 sm:mb-1.5"
              onMouseEnter={() => setHoveredLogo('express')}
              onMouseLeave={() => setHoveredLogo(null)}
              style={{
                animationDuration: portraitHovered ? '80s' : '40s',
                animationPlayState: hoveredLogo !== null ? 'paused' : 'running'
              }}
            >
              <div className="text-white font-extrabold text-[12px] sm:text-[14px] font-mono leading-none tracking-tighter">ex</div>
            </div>
          </div>
        </div>

        {/* Orbit 2 (Middle) */}
        <div 
          className="absolute rounded-full border border-white/[0.04] flex items-center justify-center animate-solar-spin-2"
          style={{
            width: '78%',
            height: '78%',
            animationDuration: portraitHovered ? '130s' : '65s',
            animationPlayState: hoveredLogo !== null ? 'paused' : 'running'
          }}
        >
          {/* Node.js Node (Left) */}
          <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            {/* Glowing Star/Jarvis Node */}
            <div className="w-1.5 h-1.5 rounded-full bg-[#339933] shadow-[0_0_8px_rgba(51,153,51,0.8)]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#339933] absolute inset-0 animate-ping opacity-60" />
            
            {/* Node.js Capsule */}
            <div 
              className="logo-capsule pointer-events-auto cursor-pointer animate-solar-spin-reverse-2 w-11 h-11 sm:w-13 sm:h-13 rounded-full border border-[#339933]/20 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-115 hover:shadow-[0_0_20px_rgba(51,153,51,0.22)] hover:border-[#339933]/45 absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 ml-1 sm:ml-1.5"
              onMouseEnter={() => setHoveredLogo('node')}
              onMouseLeave={() => setHoveredLogo(null)}
              style={{
                animationDuration: portraitHovered ? '130s' : '65s',
                animationPlayState: hoveredLogo !== null ? 'paused' : 'running'
              }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 text-[#339933] fill-current">
                <path d="M12.42 21h-.84c-.45 0-.9-.23-1.12-.62l-6-10.4a1.29 1.29 0 0 1 0-1.28l6-10.4c.22-.39.67-.62 1.12-.62h.84c.45 0 .9.23 1.12.62l6 10.4a1.29 1.29 0 0 1 0 1.28l-6 10.4c-.22.39-.67.62-1.12.62zm-5.26-11.23l4.84 8.39V8.58l-4.84 1.19zm10.52 0l-4.84-1.19v10.78l4.84-8.39-.01.01z" />
              </svg>
            </div>
          </div>

          {/* JavaScript Node (Right) */}
          <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 pointer-events-none">
            {/* Glowing Star/Jarvis Node */}
            <div className="w-1.5 h-1.5 rounded-full bg-[#f7df1e] shadow-[0_0_8px_rgba(247,223,30,0.8)]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#f7df1e] absolute inset-0 animate-ping opacity-60" />
            
            {/* JavaScript Capsule */}
            <div 
              className="logo-capsule pointer-events-auto cursor-pointer animate-solar-spin-reverse-2 w-11 h-11 sm:w-13 sm:h-13 rounded-full border border-[#f7df1e]/20 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-115 hover:shadow-[0_0_20px_rgba(247,223,30,0.22)] hover:border-[#f7df1e]/45 absolute right-0 top-1/2 -translate-x-1/2 -translate-y-1/2 mr-1 sm:mr-1.5"
              onMouseEnter={() => setHoveredLogo('javascript')}
              onMouseLeave={() => setHoveredLogo(null)}
              style={{
                animationDuration: portraitHovered ? '130s' : '65s',
                animationPlayState: hoveredLogo !== null ? 'paused' : 'running'
              }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 text-[#f7df1e] fill-current rounded">
                <path d="M3 3h18v18H3V3zm10.57 14.28c.36.63.78 1.16 1.48 1.16.66 0 1.08-.33 1.08-.84 0-.58-.45-.78-1.22-1.11l-.42-.18c-1.23-.51-2.04-1.17-2.04-2.61 0-1.35 1.05-2.4 2.76-2.4 1.32 0 2.13.54 2.58 1.41l-1.32.84c-.3-.54-.69-.81-1.23-.81-.6 0-.87.33-.87.75 0 .51.36.72 1.08 1.02l.42.18c1.47.63 2.22 1.26 2.22 2.73 0 1.59-1.23 2.64-3.12 2.64-1.89 0-2.91-1.02-3.39-2.13l1.41-.88zm-5.91-.04c.15.39.48.69.96.69.45 0 .72-.21.72-.81V9.5h1.74v7.71c0 1.95-1.14 2.79-2.82 2.79-1.62 0-2.49-.87-2.85-1.89l1.41-.8c.24.48.51.69.84.69z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Orbit 3 (Outer) */}
        <div 
          className="absolute rounded-full border border-white/[0.03] flex items-center justify-center animate-solar-spin-3"
          style={{
            width: '98%',
            height: '98%',
            animationDuration: portraitHovered ? '180s' : '90s',
            animationPlayState: hoveredLogo !== null ? 'paused' : 'running'
          }}
        >
          {/* MongoDB Node (Top) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            {/* Glowing Star/Jarvis Node */}
            <div className="w-1.5 h-1.5 rounded-full bg-[#13aa52] shadow-[0_0_8px_rgba(19,170,82,0.8)]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#13aa52] absolute inset-0 animate-ping opacity-60" />
            
            {/* MongoDB Capsule */}
            <div 
              className="logo-capsule pointer-events-auto cursor-pointer animate-solar-spin-reverse-3 w-11 h-11 sm:w-13 sm:h-13 rounded-full border border-[#13aa52]/20 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-115 hover:shadow-[0_0_20px_rgba(19,170,82,0.22)] hover:border-[#13aa52]/45 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-1 sm:mt-1.5"
              onMouseEnter={() => setHoveredLogo('mongodb')}
              onMouseLeave={() => setHoveredLogo(null)}
              style={{
                animationDuration: portraitHovered ? '180s' : '90s',
                animationPlayState: hoveredLogo !== null ? 'paused' : 'running'
              }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 text-[#13aa52] fill-current">
                <path d="M17.15 11.2c-.3-.4-2.8-3.4-3.5-4.2-.7-.8-1.1-1.6-1.3-2.3a8.9 8.9 0 0 1-.3-1.8 8.8 8.8 0 0 1-.3 1.8c-.2.7-.6 1.5-1.3 2.3-.7.8-3.2 3.8-3.5 4.2C6 12.3 5.4 13.7 5.4 15.2c0 3.7 3 6.7 6.6 6.7s6.6-3 6.6-6.7c0-1.5-.6-2.9-1.5-4zM12 20.3c-2.8 0-5.1-2.3-5.1-5.1 0-.9.2-1.7.7-2.4l4.4-5.6V20.3z" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Layer 3: Central Circular Portrait (z-20) */}
      <motion.div
        style={{ x: portraitX, y: portraitY, rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseEnter={() => setPortraitHovered(true)}
        onMouseLeave={() => setPortraitHovered(false)}
        className="relative z-20 pointer-events-auto"
      >
        {/* circular portrait frame with neon gradient border & breathing glow */}
        <div 
          className="w-[185px] h-[185px] sm:w-[210px] sm:h-[210px] rounded-full p-[2px] bg-gradient-to-tr from-cyan-500/35 via-white/5 to-purple-500/35 transition-all duration-700 shadow-2xl relative flex items-center justify-center origin-center cursor-pointer"
          style={{
            animation: 'solar-portrait-breathe 7.5s infinite ease-in-out',
            transform: portraitHovered ? 'scale(1.06)' : 'scale(1)'
          }}
        >
          {/* Inner portrait container */}
          <div className="w-full h-full rounded-full overflow-hidden bg-white relative">
            <img
              src={imageUrl}
              alt="Yatnesh Puranik Portrait"
              className="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02] rounded-full transition-transform duration-500"
              style={{ transform: portraitHovered ? 'scale(1.04)' : 'scale(1)' }}
              loading="lazy"
            />
            {/* Stark UI diagonal shimmer sweep */}
            <motion.div
              animate={{ x: ['-140%', '140%'] }}
              transition={{
                duration: 2.0,
                repeat: Infinity,
                repeatDelay: 5.5,
                ease: 'easeInOut'
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none z-10"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero3D;
