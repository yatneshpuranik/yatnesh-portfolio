import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';

// Skills node specifications around the portrait coordinates (0-500 viewBox space)
const skillNodes = [
  { 
    name: 'React', 
    color: '#00d8ff', 
    projects: '8+', 
    experience: 'Modern Frontend',
    x: 90, y: 90,
    anchorX: 160, anchorY: 160,
    icon: (
      <svg viewBox="-11.5 -10.23 23 20.46" className="w-8 h-8">
        <circle cx="0" cy="0" r="1.8" fill="#00d8ff" />
        <g stroke="#00d8ff" strokeWidth="0.8" fill="none">
          <ellipse rx="10" ry="3.8" />
          <ellipse rx="10" ry="3.8" transform="rotate(60)" />
          <ellipse rx="10" ry="3.8" transform="rotate(120)" />
        </g>
      </svg>
    )
  },
  { 
    name: 'MongoDB', 
    color: '#13aa52', 
    projects: '5+', 
    experience: 'NoSQL Databases',
    x: 410, y: 90,
    anchorX: 340, anchorY: 160,
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#13aa52" strokeWidth="1.8">
        <path d="M12 2C12 2 7 7 7 12C7 16 10 19 12 22C14 19 17 16 17 12C17 7 12 2 12 2Z" fill="#13aa52" fillOpacity="0.2" />
        <path d="M12 2V22" />
      </svg>
    )
  },
  { 
    name: 'Node.js', 
    color: '#339933', 
    projects: '6+', 
    experience: 'Backend Engine',
    x: 440, y: 250,
    anchorX: 340, anchorY: 250,
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#339933" strokeWidth="1.8">
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="#339933" fillOpacity="0.15" />
        <circle cx="12" cy="12" r="3" fill="#339933" />
      </svg>
    )
  },
  { 
    name: 'Express', 
    color: '#828282', 
    projects: '7+', 
    experience: 'REST Endpoints',
    x: 410, y: 410,
    anchorX: 340, anchorY: 340,
    icon: (
      <div className="text-zinc-400 font-extrabold text-[13px] font-mono leading-none tracking-tighter">ex</div>
    )
  },
  { 
    name: 'Git', 
    color: '#f03c2e', 
    projects: '12+', 
    experience: 'VCS Operations',
    x: 90, y: 410,
    anchorX: 160, anchorY: 340,
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#f03c2e" strokeWidth="1.8">
        <path d="M12 2L2 12L12 22L22 12L12 2Z" fill="#f03c2e" fillOpacity="0.15" />
        <circle cx="12" cy="12" r="3.5" fill="#f03c2e" />
        <path d="M12 7V17" />
      </svg>
    )
  },
  { 
    name: 'JavaScript', 
    color: '#f7df1e', 
    projects: '9+', 
    experience: 'Dynamic Logic',
    x: 60, y: 250,
    anchorX: 160, anchorY: 250,
    icon: (
      <div className="text-[#f7df1e] font-black text-[15px] font-mono leading-none tracking-tighter">JS</div>
    )
  }
];

const getOptimizedCloudinaryUrl = (url, transformations = 'q_auto,f_auto') => {
  if (!url) return '';
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;
  const insertPosition = uploadIndex + '/upload/'.length;
  return `${url.slice(0, insertPosition)}${transformations}/${url.slice(insertPosition)}`;
};

const Hero3D = ({ avatarUrl }) => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [portraitHovered, setPortraitHovered] = useState(false);
  const [activePulseIndex, setActivePulseIndex] = useState(null);

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
  const logoX = useTransform(smoothX, [-250, 250], [-6, 6]);
  const logoY = useTransform(smoothY, [-250, 250], [-6, 6]);

  // Mouse 3D tilt transformations
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

  // Periodic network pulse animation trigger
  useEffect(() => {
    const pulseTimer = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * skillNodes.length);
      setActivePulseIndex(randomIndex);
      setTimeout(() => {
        setActivePulseIndex(null);
      }, 1600);
    }, 4500);

    return () => clearInterval(pulseTimer);
  }, []);

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full max-w-[500px] aspect-square relative flex items-center justify-center select-none z-10 mx-auto cursor-default"
      style={{ perspective: 1000 }}
    >
      
      {/* Layer 1: Background Drifting Particles / Soft Ambient Spotlight (z-0) */}
      <motion.div 
        style={{ x: bgX, y: bgY }}
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      >
        {/* Soft Spotlight behind image */}
        <div className="absolute w-[300px] h-[300px] rounded-full bg-radial from-white/[0.015] to-transparent blur-[60px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        {/* Drifting Dust Particles */}
        {Array.from({ length: 10 }).map((_, idx) => (
          <motion.div
            key={idx}
            animate={{
              y: [0, -40 - (idx * 6), 0],
              x: [0, 15 - (idx * 3), 0],
              opacity: [0.03, 0.15, 0.03]
            }}
            transition={{
              duration: 12 + idx * 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute w-[2px] h-[2px] sm:w-1 sm:h-1 rounded-full bg-white/20"
            style={{
              left: `${10 + idx * 9}%`,
              bottom: `${15 + idx * 8}%`
            }}
          />
        ))}
      </motion.div>

      {/* Layer 2: SVG Connections Canvas (z-10) */}
      <motion.svg 
        style={{ x: connX, y: connY }}
        viewBox="0 0 500 500" 
        className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
      >
        {skillNodes.map((node, index) => {
          const isNodeHovered = hoveredNode === index;
          const isPulseActive = activePulseIndex === index;
          const isHighlight = isNodeHovered || isPulseActive || portraitHovered;

          // Draw custom organic S-curves from node center (x, y) to anchor points on card
          const controlX1 = (node.x + node.anchorX) / 2;
          const controlY1 = node.y;
          const controlX2 = (node.x + node.anchorX) / 2;
          const controlY2 = node.anchorY;
          const pathData = `M ${node.x} ${node.y} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${node.anchorX} ${node.anchorY}`;

          return (
            <g key={index}>
              {/* Backing glow on active path (2px thickness, 45% opacity) */}
              <motion.path
                d={pathData}
                stroke={node.color}
                strokeWidth="2"
                strokeOpacity={isHighlight ? 0.45 : 0.15}
                fill="none"
                className="transition-all duration-500"
              />

              {/* Dynamic traveling pulse line */}
              <motion.path
                d={pathData}
                stroke={node.color}
                strokeWidth="2"
                strokeOpacity={isHighlight ? 0.95 : 0.55}
                fill="none"
                strokeDasharray="10 60"
                animate={{ strokeDashoffset: [140, 0] }}
                transition={{
                  duration: isHighlight ? 2.0 : 3.5,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />

              {/* Traveling energy particle - GPU-accelerated path follower */}
              <motion.circle
                r="2.5"
                fill={node.color}
                style={{
                  offsetPath: `path('${pathData}')`,
                  filter: `drop-shadow(0 0 4px ${node.color})`
                }}
                animate={{
                  offsetDistance: ["0%", "100%"]
                }}
                transition={{
                  duration: isHighlight ? 2.8 : 4.5,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: index * 0.35
                }}
              />
            </g>
          );
        })}
      </motion.svg>

      {/* Layer 3: Central Portrait Card with larger rounded corners & 3D tilt (z-20) */}
      <motion.div
        style={{ x: portraitX, y: portraitY, rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseEnter={() => setPortraitHovered(true)}
        onMouseLeave={() => setPortraitHovered(false)}
        animate={{
          y: [0, -3, 0],
          scale: [1, 1.015, 1]
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="w-[178px] h-[247px] sm:w-[195px] sm:h-[270px] rounded-3xl border-[0.5px] border-white/25 bg-white overflow-hidden flex items-center justify-center relative z-20 transition-all duration-500 hover:border-white/40 origin-center shadow-[0_25px_60px_-10px_rgba(0,0,0,0.95),0_0_20px_rgba(6,182,212,0.02)]"
      >
        {/* Dynamic clean portrait photo showing its original white background (using object-contain to prevent cutout) */}
        <img
          src={imageUrl}
          alt="Yatnesh Puranik Portrait"
          className="w-full h-full object-contain bg-white transition-all duration-500 filter brightness-95 rounded-3xl"
          loading="lazy"
        />

        {/* Occasional eye-level shine sweep (diagonal sweep every 10 seconds) */}
        <motion.div
          animate={{ x: ['-140%', '140%'] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            repeatDelay: 8.4,
            ease: 'easeInOut'
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent skew-x-12 pointer-events-none z-20"
        />
      </motion.div>

      {/* Layer 4: Skills Network Pill Nodes (z-30) (increased size to w-16 h-16) */}
      {skillNodes.map((node, index) => {
        const isHovered = hoveredNode === index;
        const isPulse = activePulseIndex === index;
        const brightnessClass = isHovered || isPulse || portraitHovered
          ? 'border-white/25 bg-[#171717]/90 opacity-100' 
          : 'border-white/5 bg-[#111111]/70 opacity-60';

        return (
          <motion.div
            key={index}
            className="absolute z-30"
            style={{ 
              left: `${node.x / 5}%`, 
              top: `${node.y / 5}%`,
              x: logoX,
              y: logoY,
              translateX: '-50%',
              translateY: '-50%'
            }}
            onMouseEnter={() => setHoveredNode(index)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Soft breathing container */}
            <motion.div
              animate={{
                scale: isHovered ? 1.08 : [1, 1.025, 1],
                y: isHovered ? -2 : [0, -3, 0]
              }}
              transition={{
                duration: isHovered ? 0.2 : (4.0 + (index % 3) * 0.6),
                repeat: isHovered ? 0 : Infinity,
                ease: 'easeInOut'
              }}
              className={`flex items-center justify-center rounded-full border cursor-pointer transition-all duration-300 w-16 h-16 ${brightnessClass}`}
              style={{
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: isHovered || isPulse || portraitHovered 
                  ? `0 0 20px ${node.color}25, inset 0 1px 1px rgba(255, 255, 255, 0.08)` 
                  : 'inset 0 1px 1px rgba(255, 255, 255, 0.04)'
              }}
            >
              {/* SVG / HTML Colored Icon (40% larger) */}
              {node.icon}

              {/* Colored Active Pulse dot */}
              <span 
                className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-[#050505] transition-all duration-300"
                style={{ 
                  backgroundColor: node.color,
                  boxShadow: `0 0 6px ${node.color}` 
                }} 
              />
            </motion.div>

            {/* Micro details Tooltip (expand on hover) */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
                >
                  <div 
                    className="border rounded-lg px-3 py-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.9)] text-center min-w-[130px] bg-[#141414]/95 backdrop-blur-md transition-colors"
                    style={{ borderColor: `${node.color}33` }}
                  >
                    <div className="text-[9px] font-bold text-white uppercase tracking-wider font-mono">{node.name}</div>
                    <div className="text-[7.5px] text-zinc-400 mt-0.5">{node.projects} Projects</div>
                    <div className="text-[7.5px] text-zinc-500">{node.experience}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

    </div>
  );
};

export default Hero3D;
