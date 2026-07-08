import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  Search, ArrowUpRight, X, 
  Sparkles, CheckCircle2, Layers, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { stripMarkdown } from '../../utils/markdown';

// Live Status Ticker Variable: easily editable status update
const CURRENT_STATUS = "Redis-backed session cache storage & real-time webhook payload validation metrics for multi-tenant Monorepo CRM";

/**
 * ProjectCard: Premium glass card with elastic 3D mouse parallax tilt,
 * image scale previews, skew shimmers, and outline hover glows.
 * Re-structured as a structured case study narrative.
 */
const ProjectCard = ({ project, onClick, getTagColor }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 100, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), springConfig);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(normX);
    y.set(normY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d'
      }}
      whileHover={{ y: -6 }}
      className="w-full md:w-[380px] md:shrink-0 snap-start bg-[#101010]/80 backdrop-blur-xl rounded-2xl overflow-hidden cursor-pointer flex flex-col group/card border border-white/[0.08] hover:border-[#2d4fc7]/30 hover:shadow-[0_20px_45px_rgba(226,54,54,0.02)] transition-all duration-500"
    >
      {/* Banner Thumbnail */}
      <div className="h-44 overflow-hidden relative border-b border-white/[0.06] bg-[#090909] shrink-0 select-none">
        <img 
          src={project.bannerImage} 
          alt={project.title}
          className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700 ease-out"
        />
        <span className={`absolute top-4 left-4 text-[9px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded bg-[#050505]/95 border border-white/10 text-white ${getTagColor(project.category)}`}>
          {project.category || 'Saas'}
        </span>
        {/* Subtle skew shimmer sweep on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none group-hover/card:translate-x-full transition-transform duration-1000" />
      </div>

      {/* Details */}
      <div className="p-6 flex-1 flex flex-col justify-between text-left space-y-5">
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-white transition-colors flex items-center justify-between font-heading">
            <span className="truncate">{project.title}</span>
            <motion.div
              whileHover={{ scale: 1.12, rotate: 12 }}
              className="transition-transform shrink-0"
            >
              <ArrowUpRight className="w-4.5 h-4.5 text-[#B5B5B5] group-hover/card:text-white transition-colors" />
            </motion.div>
          </h3>

          {/* Structured Case Study Narrative block */}
          <div className="space-y-3 font-sans text-xs">
            {project.problem && (
              <div>
                <span className="text-[8px] font-mono tracking-widest font-extrabold text-[#e23636] block mb-0.5">PROBLEM</span>
                <p className="text-[#b5b5b5] font-light leading-relaxed line-clamp-2">{project.problem}</p>
              </div>
            )}
            {project.solution && (
              <div>
                <span className="text-[8px] font-mono tracking-widest font-extrabold text-[#2d4fc7] block mb-0.5">APPROACH</span>
                <p className="text-[#b5b5b5] font-light leading-relaxed line-clamp-2">{project.solution}</p>
              </div>
            )}
            {project.challenges && (
              <div>
                <span className="text-[8px] font-mono tracking-widest font-extrabold text-[#e23636] block mb-0.5">CHALLENGE</span>
                <p className="text-[#b5b5b5] font-light leading-relaxed line-clamp-1">{project.challenges}</p>
              </div>
            )}
            {project.learned && (
              <div>
                <span className="text-[8px] font-mono tracking-widest font-extrabold text-[#2d4fc7] block mb-0.5">ENGINEERING DEPTH</span>
                <p className="text-[#b5b5b5] font-light leading-relaxed line-clamp-1">{project.learned}</p>
              </div>
            )}
          </div>
        </div>

        {/* Stacks badges */}
        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.04]">
          {project.technologies.slice(0, 3).map((tech) => (
            <span key={tech} className="px-2.5 py-1 rounded-md text-[9px] font-mono bg-[#050505] border border-white/[0.08] text-gray-400 group-hover/card:border-white/20 transition-all flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2d4fc7] shadow-[0_0_4px_rgba(45,79,199,0.8)]" />
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-[9px] font-mono text-gray-500 self-center font-bold">
              +{project.technologies.length - 3} more
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Projects = ({ projects }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [mobileVisible, setMobileVisible] = useState(2);
  
  // Carousel State
  const carouselRef = useRef(null);

  if (!projects || projects.length === 0) return null;

  // Extract categories
  const categories = ['All', ...new Set(projects.map(p => p.category).filter(Boolean))];

  // Filter projects
  const filtered = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.technologies.some(tech => tech.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenCaseStudy = (slug) => {
    setSelectedProject(null);
    navigate(`/project/${slug}`);
  };

  // Carousel controls
  const handleScroll = (direction) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const scrollVal = direction === 'left' ? -400 : 400;
    container.scrollBy({ left: scrollVal, behavior: 'smooth' });
  };

  const getTagColor = () => {
    return 'border-white/10 text-white';
  };

  return (
    <section id="projects" className="py-28 border-t border-white/[0.08] text-left select-none relative overflow-hidden">
      
      <div className="space-y-12">
        
        {/* Title */}
        <div className="flex items-center space-x-4">
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2 font-heading mobile-section-title">
            <span>Featured Projects</span>
          </h2>
          <div className="h-[1px] bg-gradient-to-r from-[#2d4fc7]/40 via-[#e23636]/20 to-transparent flex-grow" />
        </div>

        {/* 1. Desktop Layout (Carousel with filters & case studies modal) */}
        <div className="hidden md:block space-y-12">
          {/* Search Toolbar */}
          <div className="flex flex-row items-center justify-between gap-6">
            <div className="grow" />
            <div className="relative w-80 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-550" />
              <input
                type="text"
                placeholder="Search by tech or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-lg border border-white/[0.08] bg-black text-[#F8FAFC] focus:outline-none focus:border-white/40 transition-colors font-mono"
              />
            </div>
          </div>

          {/* Live Status Ticker */}
          <div className="flex items-center space-x-2.5 px-4 py-2 rounded-xl bg-[#111116] border border-white/[0.06] w-fit font-mono text-[9px] text-zinc-300 select-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Currently building: <span className="text-white font-bold">{CURRENT_STATUS}</span></span>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer
                  ${activeCategory === cat 
                    ? 'bg-white text-black border border-white' 
                    : 'border border-white/[0.08] bg-[#101010]/80 text-gray-400 hover:border-white/35 hover:text-white'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Carousel Slider with snap controls */}
          <div className="relative group/carousel w-full">
            
            {/* Left Arrow */}
            <button 
              onClick={() => handleScroll('left')}
              className="absolute -left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white hover:border-white/50 transition-all z-20 opacity-0 group-hover/carousel:opacity-100 shadow-xl cursor-pointer hidden md:flex"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Arrow */}
            <button 
              onClick={() => handleScroll('right')}
              className="absolute -right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white hover:border-white/50 transition-all z-20 opacity-0 group-hover/carousel:opacity-100 shadow-xl cursor-pointer hidden md:flex"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Carousel container */}
            <div 
              ref={carouselRef}
              className="flex flex-row gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 relative z-10 w-full"
            >
              {filtered.map((project) => (
                <ProjectCard 
                  key={project._id} 
                  project={project} 
                  onClick={() => setSelectedProject(project)}
                  getTagColor={getTagColor}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 2. Mobile Layout (Summary cards with Load More - No Modal) */}
        <div className="block md:hidden space-y-6">
          <div className="flex flex-col gap-6">
            <AnimatePresence mode="popLayout">
              {projects.slice(0, mobileVisible).map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: 'easeOut', delay: (index % 2) * 0.05 }}
                  onClick={() => navigate(`/project/${project.slug}`)}
                  className="bg-[#101010]/80 border border-white/[0.08] rounded-xl overflow-hidden cursor-pointer flex flex-col active:scale-[0.98] transition-all duration-300"
                >
                  {/* Project Thumbnail */}
                  <div className="h-40 overflow-hidden relative bg-[#090909]">
                    <img 
                      src={project.bannerImage} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/80 border border-white/10 text-white">
                      {project.category || 'Saas'}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-5 space-y-4 text-left">
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-white flex items-center justify-between font-heading">
                        <span>{project.title}</span>
                      </h3>
                      <p className="text-xs text-gray-400 font-light leading-relaxed font-sans line-clamp-2">
                        {project.summary || (project.problem ? stripMarkdown(project.problem) : '')}
                      </p>
                    </div>

                    {/* Technologies & CTA Row */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies && project.technologies.slice(0, 2).map((tech) => (
                          <span key={tech} className="px-2 py-0.5 rounded text-[9px] font-mono bg-black border border-white/[0.06] text-gray-400">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#b5b5b5] flex items-center gap-0.5">
                        View Details <ArrowUpRight className="w-3 h-3 text-[#b5b5b5]" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Consistent Load More Button */}
          {mobileVisible < projects.length && (
            <div className="flex justify-center pt-8">
              <button
                onClick={() => setMobileVisible(prev => prev + 2)}
                className="px-6 py-3 rounded-full border border-white/10 bg-[#111116] active:scale-95 text-[#F8FAFC] text-xs font-mono font-bold uppercase tracking-widest transition-all duration-300 shadow-lg cursor-pointer hover:border-white"
              >
                Load More
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Carousel details modal (Desktop only) */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#101010]/95 backdrop-blur-xl p-8 text-[#F8FAFC] shadow-2xl space-y-8 scrollbar"
            >
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Banner Thumbnail */}
              <div className="rounded-xl overflow-hidden h-52 sm:h-72 border border-white/[0.08] bg-[#050505] relative">
                <img src={selectedProject.bannerImage} alt={selectedProject.title} className="w-full h-full object-cover" />
              </div>

              {/* Header detail info */}
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded bg-[#050505] border border-white/10 text-white">
                    {selectedProject.category}
                  </span>
                  {selectedProject.timeline && (
                    <span className="text-[10px] font-mono text-gray-550">{selectedProject.timeline}</span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-white font-heading">
                  <Sparkles className="w-5 h-5 text-white animate-pulse" />
                  {selectedProject.title}
                </h2>
                <p className="text-sm text-[#94A3B8] leading-relaxed font-light font-sans">
                  {selectedProject.summary}
                </p>
              </div>

              {/* Stacks badges */}
              <div className="space-y-2 text-left">
                <p className="text-[10px] font-mono text-gray-555 uppercase tracking-widest font-bold">Tech Stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.technologies.map(tech => (
                    <span key={tech} className="px-2.5 py-1 rounded-md text-[10px] font-mono bg-black border border-white/[0.08] text-[#B5B5B5]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Details layout grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/[0.04] text-left">
                <div className="space-y-2">
                  <p className="text-[10px] font-mono text-white uppercase tracking-widest font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-white" /> Problem
                  </p>
                  <p className="text-xs text-[#b5b5b5] leading-relaxed font-light font-sans">
                    {stripMarkdown(selectedProject.problem) || 'N/A'}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-mono text-white uppercase tracking-widest font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-white" /> Solution
                  </p>
                  <p className="text-xs text-[#b5b5b5] leading-relaxed font-light font-sans">
                    {stripMarkdown(selectedProject.solution) || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Architecture */}
              {selectedProject.architecture && (
                <div className="space-y-2 pt-6 border-t border-white/[0.04] text-left">
                  <p className="text-[10px] font-mono text-white uppercase tracking-widest font-bold flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-white" /> Architecture overview
                  </p>
                  <p className="text-xs text-[#b5b5b5] leading-relaxed font-light whitespace-pre-line font-sans">
                    {stripMarkdown(selectedProject.architecture)}
                  </p>
                </div>
              )}

              {/* Core Case Study CTA */}
              <div className="pt-6 flex justify-end">
                <button
                  onClick={() => handleOpenCaseStudy(selectedProject.slug)}
                  className="px-5 py-2.5 rounded bg-white text-black text-xs font-bold font-mono tracking-wider uppercase hover:bg-zinc-200 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Explore Case Study</span>
                  <ArrowUpRight className="w-4 h-4 text-black" />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
