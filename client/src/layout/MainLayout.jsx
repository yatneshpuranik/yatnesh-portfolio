import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, ChevronUp, User, Cpu, Home,
  FolderOpen, Terminal, Mail, Sun, Moon,
  Sparkles, FileText, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { fetchProfile, fetchSettings } from '../services/api';

const getOptimizedCloudinaryUrl = (url, transformations = 'w_80,h_80,c_fill,g_face,q_auto,f_auto') => {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;
  const insertPosition = uploadIndex + '/upload/'.length;
  return `${url.slice(0, insertPosition)}${transformations}/${url.slice(insertPosition)}`;
};

/**
 * SpaceParticles: GPU-accelerated 2D Canvas rendering 45 floating stars
 * pulsing slowly and shifting asynchronously at 60fps.
 */
const SpaceParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.0 + 0.3,
      speedX: (Math.random() - 0.5) * 0.05,
      speedY: Math.random() * 0.10 + 0.02,
      opacity: Math.random() * 0.4 + 0.1,
      pulseSpeed: Math.random() * 0.004 + 0.001,
      pulseDir: Math.random() > 0.5 ? 1 : -1
    }));

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y > height) {
          p.y = 0;
          p.x = Math.random() * width;
        }
        if (p.x < 0 || p.x > width) {
          p.speedX *= -1;
        }

        p.opacity += p.pulseSpeed * p.pulseDir;
        if (p.opacity > 0.5 || p.opacity < 0.1) {
          p.pulseDir *= -1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.shadowBlur = 1;
        ctx.shadowColor = '#ffffff';
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-40" />;
};

const sectionColorMap = {
  '#hero': {
    accent: '#06b6d4', // Cyan
    accentRgb: '6, 182, 212',
    glow1: 'rgba(6, 182, 212, 0.022)', // Cyan
    glow2: 'rgba(139, 92, 246, 0.018)' // Violet
  },
  '#about': {
    accent: '#3b82f6', // Blue
    accentRgb: '59, 130, 246',
    glow1: 'rgba(59, 130, 246, 0.02)', // Blue
    glow2: 'rgba(29, 78, 216, 0.012)'
  },
  '#skills': {
    accent: '#10b981', // Emerald
    accentRgb: '16, 185, 129',
    glow1: 'rgba(16, 185, 129, 0.022)', // Emerald
    glow2: 'rgba(13, 148, 136, 0.012)'
  },
  '#experience': {
    accent: '#f59e0b', // Amber
    accentRgb: '245, 158, 11',
    glow1: 'rgba(245, 158, 11, 0.015)',
    glow2: 'rgba(217, 119, 6, 0.008)'
  },
  '#projects': {
    accent: '#8b5cf6', // Purple
    accentRgb: '139, 92, 246',
    glow1: 'rgba(139, 92, 246, 0.022)', // Purple
    glow2: 'rgba(109, 40, 217, 0.012)'
  },
  '#research': {
    accent: '#f97316', // Warm Orange
    accentRgb: '249, 115, 22',
    glow1: 'rgba(249, 115, 22, 0.022)', // Warm Orange
    glow2: 'rgba(217, 119, 6, 0.008)'
  },
  '#certificates': {
    accent: '#cbd5e1', // Blue-white (slate-300)
    accentRgb: '203, 213, 225',
    glow1: 'rgba(203, 213, 225, 0.02)', // Blue-white
    glow2: 'rgba(148, 163, 184, 0.008)'
  },
  '#contact': {
    accent: '#06b6d4', // Cyan
    accentRgb: '6, 182, 212',
    glow1: 'rgba(6, 182, 212, 0.025)', // Cyan
    glow2: 'rgba(13, 148, 136, 0.012)'
  }
};

const MainLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: fetchProfile });
  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: fetchSettings });
  const navigate = useNavigate();
  const location = useLocation();

  const [activeSection, setActiveSection] = useState('#hero');
  const [aiOpen, setAiOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mouse coordinates
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      document.documentElement.style.setProperty('--mouse-x', `${e.pageX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.pageY}px`);
      document.documentElement.style.setProperty('--mouse-x-view', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y-view', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Listen for global AI assistant state transitions
  useEffect(() => {
    const handleAiState = (e) => {
      setAiOpen(!!e.detail?.open);
    };
    window.addEventListener('ai-assistant-state', handleAiState);
    return () => window.removeEventListener('ai-assistant-state', handleAiState);
  }, []);

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;

      if (totalScroll > 0) {
        setScrollProgress((currentScroll / totalScroll) * 100);
      }
      setShowBackToTop(currentScroll > 400);

      // Section tracker
      const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'research', 'certificates', 'contact'];
      let current = '#hero';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom >= 250) {
            current = `#${section}`;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Propagate current active colors to global style properties
  useEffect(() => {
    let colors;
    if (aiOpen) {
      colors = {
        accent: '#93c5fd', // Ice Blue
        accentRgb: '147, 197, 253',
        glow1: 'rgba(147, 197, 253, 0.022)',
        glow2: 'rgba(59, 130, 246, 0.015)'
      };
    } else {
      colors = sectionColorMap[activeSection] || {
        accent: '#94a3b8', // Neutral Grey
        accentRgb: '148, 163, 184',
        glow1: 'rgba(148, 163, 184, 0.012)',
        glow2: 'rgba(148, 163, 184, 0.006)'
      };
    }

    document.documentElement.style.setProperty('--current-accent', colors.accent);
    document.documentElement.style.setProperty('--current-accent-rgb', colors.accentRgb);
    document.documentElement.style.setProperty('--current-glow-1', colors.glow1);
    document.documentElement.style.setProperty('--current-glow-2', colors.glow2);
  }, [activeSection, aiOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (e, path) => {
    e.preventDefault();
    setActiveSection(path);
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(path);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } else {
      const element = document.querySelector(path);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinks = [
    { name: 'About', path: '#about', icon: <User className="w-4 h-4" /> },
    { name: 'Skills', path: '#skills', icon: <Cpu className="w-4 h-4" /> },
    { name: 'Experience', path: '#experience', icon: <Terminal className="w-4 h-4" /> },
    { name: 'Projects', path: '#projects', icon: <FolderOpen className="w-4 h-4" /> },
    { name: 'Research', path: '#research', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Contact', path: '#contact', icon: <Mail className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen text-white bg-[#050505] relative overflow-hidden font-sans selection:bg-white/20 selection:text-white custom-cursor-active">

      {/* 2D Canvas Floating particles layer */}
      <SpaceParticles />

      {/* Drifting ambient background lighting - CSS only, GPU-friendly slow transforms */}
      <div className="ambient-light-1" />
      <div className="ambient-light-2" />

      {/* Custom Cursor Dot & Ring (visible only on desktop) */}
      <div
        className="custom-cursor-dot hidden md:block"
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
      />
      <div
        className="custom-cursor-ring hidden md:block"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          borderColor: `rgba(var(--current-accent-rgb, 255, 255, 255), 0.28)`,
          boxShadow: `0 0 10px rgba(var(--current-accent-rgb, 255, 255, 255), 0.05)`
        }}
      />

      {/* Texture grain overlay (Subtle grain/noise) */}
      <div className="absolute inset-0 opacity-[0.015] bg-noise pointer-events-none mix-blend-overlay z-0" />

      {/* Background coordinate grid watermark (subtle blueprint) */}
      <div className="absolute inset-0 grid-lines opacity-10 pointer-events-none z-0" />

      {/* Mouse reactive lighting spotlight (very subtle white follow spotlight) */}
      <div
        className="fixed w-[500px] h-[500px] rounded-full bg-radial from-white/[0.012] to-transparent blur-[120px] pointer-events-none z-0 translate-x-[-50%] translate-y-[-50%] transition-all duration-300 ease-out hidden md:block"
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
      />

      {/* Top progress indicator bar */}
      <div
        className="fixed top-0 left-0 h-0.75 bg-white z-50 transition-all duration-100 shadow-[0_0_8px_rgba(255,255,255,0.2)]"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Floating Glassmorphic Navbar */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl h-14 rounded-full border border-white/[0.08] bg-[#090909]/60 backdrop-blur-xl z-30 select-none shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
        <div className="h-full px-8 flex items-center justify-between">

          {/* Logo brand */}
          <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center space-x-2.5 text-base font-mono font-black tracking-wider text-white hover:opacity-80 transition-opacity cursor-pointer">
            {profile?.avatarUrl && (
              <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/20 shadow shrink-0">
                <img
                  src={getOptimizedCloudinaryUrl(profile.avatarUrl)}
                  alt="Avatar Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <span>YATNESH<span className="text-white">.</span></span>
          </a>

          {/* Center Links (Tablet/Desktop) */}
          <nav className="hidden md:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive = activeSection === link.path;
              return (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className={`text-xs font-mono font-bold uppercase tracking-widest relative py-1 cursor-pointer transition-colors ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">

            {/* Theme switch (Decorative in dark theme portfolio) */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg border border-white/[0.04] bg-white/[0.01] hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {settings?.resumeUrl && (
              <a
                href={settings.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-[10px] font-mono text-white hover:bg-white hover:text-black font-bold uppercase tracking-wider transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Resume</span>
              </a>
            )}

            {isAuthenticated && (
              <Link
                to="/admin"
                className="p-2 rounded-lg border border-white/[0.04] bg-white/[0.01] hover:bg-white/5 hover:text-white transition-colors"
                title="Admin Console"
              >
                <User className="w-4 h-4" />
              </Link>
            )}

            {/* Mobile Hamburger menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-white/[0.04] bg-white/[0.01] hover:bg-white/5 text-gray-400 hover:text-white transition-colors md:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>
        </div>
      </header>

      {/* Slide-in Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-64 bg-[#101010]/95 backdrop-blur-xl border-l border-white/[0.06] z-50 p-6 flex flex-col justify-between md:hidden"
            >
              <div className="space-y-8">
                {/* Header brand */}
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-white tracking-widest uppercase">System Menu</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded hover:bg-white/5 text-gray-400 cursor-pointer"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.path}
                      onClick={(e) => handleNavClick(e, link.path)}
                      className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.02] hover:bg-white/5 text-sm font-semibold uppercase tracking-wider text-gray-400 hover:text-white transition-all cursor-pointer"
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </a>
                  ))}
                </nav>
              </div>

              {/* Bottom Resume link */}
              {settings?.resumeUrl && (
                <a
                  href={settings.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-lg bg-white text-black text-xs font-mono font-bold uppercase tracking-wider hover:bg-zinc-200 transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download Resume</span>
                </a>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main viewport */}
      <main className="pt-24 min-h-screen relative z-10 select-text pb-20 md:pb-8">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-2.5 rounded-full border border-white/[0.08] bg-[#101010]/80 backdrop-blur-sm text-gray-400 hover:text-white transition-colors cursor-pointer z-40 shadow-xl hover:border-white/40"
            title="Scroll to Top"
          >
            <ChevronUp className="w-5 h-5 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#050505] py-12 text-center text-xs text-[#94A3B8] relative z-10 select-none">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Yatnesh Puranik. Core MERN Architecture.</p>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Built with Vite × Framer Motion</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default MainLayout;
