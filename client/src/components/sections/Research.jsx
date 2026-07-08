import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, FileText, ArrowUpRight, X, Sparkles, Award } from 'lucide-react';
import Reveal from '../UI/Reveal';
import { stripMarkdown } from '../../utils/markdown';

/**
 * Research: Research paper presentation redesigned as "Classified Secure Documents".
 * Re-themed to Minimal Premium Monochrome.
 */
const Research = ({ papers }) => {
  const navigate = useNavigate();
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [mobileVisible, setMobileVisible] = useState(2);

  if (!papers || papers.length === 0) return null;

  const handleOpenPaperPage = (slug) => {
    setSelectedPaper(null);
    navigate(`/research/${slug}`);
  };

  return (
    <section id="research" className="py-28 border-t border-white/[0.08] text-left select-none relative">
      <div className="space-y-12">
        
        {/* Title */}
        <div className="flex items-center space-x-4">
          <h2 className="text-3xl font-bold tracking-tight text-white font-heading mobile-section-title">Research & Publications</h2>
          <div className="h-[1px] bg-gradient-to-r from-white/20 to-transparent flex-grow" />
        </div>

        {/* 1. Desktop Layout (Timeline with modal details) */}
        <div className="hidden md:block">
          <div className="relative border-l border-white/10 ml-8 pl-10 space-y-12 py-2">
            {papers.map((paper, index) => (
              <Reveal key={paper._id} delay={index * 0.08}>
                <div className="relative group/timeline">
                  
                  {/* Timeline node year bubble */}
                  <div className="absolute top-2 -left-[58px] -translate-x-1/2 flex flex-col items-center z-10">
                    <div className="w-11 h-11 rounded-lg bg-[#101010] border border-white/10 flex flex-col items-center justify-center shadow-lg transition-all duration-300 group-hover/timeline:border-white/40 select-none">
                      <BookOpen className="w-3 h-3 text-zinc-400 mb-0.5" />
                      <span className="text-[9px] font-heading font-black text-white leading-none">{paper.year}</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setSelectedPaper(paper)}
                    className="group cursor-pointer p-8 rounded-2xl border border-white/[0.08] bg-[#101010]/80 backdrop-blur-md hover:border-white/30 hover:shadow-[0_20px_45px_rgba(249,115,22,0.06)] transition-all duration-400 relative overflow-hidden mt-14 md:mt-0"
                  >
                    
                    {/* Visual Accent Hover Bar */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-white/40 opacity-70 group-hover:opacity-100 transition-opacity" />

                    {/* Secure watermark label */}
                    <div className="absolute top-3 right-4 text-[7px] font-mono text-gray-555 tracking-widest uppercase select-none">
                      CLASSIFIED // MODULE_0{index + 1}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pl-4 text-center md:text-left items-center md:items-start">
                      
                      {/* Paper details */}
                      <div className="space-y-4 flex-1">
                        <div className="space-y-2">
                          <div className="flex items-center justify-center md:justify-start gap-1.5 text-[10px] font-mono text-white uppercase font-bold tracking-widest">
                            <BookOpen className="w-3.5 h-3.5 text-white" />
                            <span>Published in {paper.year}</span>
                          </div>
                          
                          <h3 className="text-xl font-extrabold text-white group-hover:text-white transition-colors flex flex-col md:flex-row md:items-center justify-between font-heading leading-snug w-full">
                            <span>{paper.title}</span>
                            <ArrowUpRight className="w-5 h-5 text-gray-550 group-hover:text-white transition-colors shrink-0 mx-auto md:mx-0 mt-2 md:mt-0" />
                          </h3>
                          
                          <p className="text-xs text-gray-400 font-semibold font-mono">
                            Authors: {paper.authors.join(', ')}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-[10px] font-extrabold tracking-widest text-gray-555 uppercase font-mono">Abstract Summary</p>
                          <p className="text-xs leading-relaxed text-[#b5b5b5] font-light font-sans">
                            {stripMarkdown(paper.abstract)}
                          </p>
                        </div>

                        {paper.journal && (
                          <p className="text-[10px] font-mono text-gray-555">
                            Journal/Conference: <span className="font-semibold text-gray-400">{paper.journal}</span>
                          </p>
                        )}
                      </div>

                      {/* Actions Column */}
                      <div className="flex md:flex-col gap-2 shrink-0 md:items-end w-full md:w-auto pt-2 md:pt-0">
                        <span className="px-4 py-2 rounded-lg border border-white/[0.08] bg-black text-gray-450 group-hover:text-white group-hover:border-white/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 w-full md:w-44 shadow-sm font-mono">
                          <FileText className="w-4 h-4 text-white" />
                          <span>SECURE PREVIEW</span>
                        </span>
                      </div>

                    </div>

                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* 2. Mobile Layout (No Modals, Opens PDF Directly) */}
        <div className="block md:hidden space-y-6">
          <div className="flex flex-col gap-6">
            <AnimatePresence mode="popLayout">
              {papers.slice(0, mobileVisible).map((paper, index) => {
                const cardContent = (
                  <div className="p-6 rounded-xl border border-white/[0.08] bg-[#101010]/80 relative overflow-hidden active:scale-[0.98] transition-transform duration-300">
                    <div className="absolute top-0 left-0 w-1 h-full bg-white/30" />
                    
                    <div className="space-y-3 text-left">
                      <div className="space-y-1">
                        <span className="text-[8px] font-mono tracking-widest font-extrabold text-gray-555 block">PUBLISHED {paper.year}</span>
                        <h3 className="text-sm font-extrabold text-white font-heading leading-snug">{paper.title}</h3>
                      </div>
                      
                      <p className="text-[11px] text-gray-450 leading-relaxed font-sans line-clamp-2">
                        {stripMarkdown(paper.abstract)}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-[10px] font-mono font-bold text-gray-400">
                        <span>Authors: {paper.authors[0] || 'Yatnesh'}</span>
                        <span className="flex items-center gap-0.5 text-white">
                          Read Research <ArrowUpRight className="w-3 h-3 text-white" />
                        </span>
                      </div>
                    </div>
                  </div>
                );

                return (
                  <motion.div
                    key={paper._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: 'easeOut', delay: (index % 2) * 0.05 }}
                  >
                    {paper.pdfUrl ? (
                      <a
                        href={paper.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block cursor-pointer select-none"
                      >
                        {cardContent}
                      </a>
                    ) : (
                      cardContent
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Consistent Load More Button */}
          {mobileVisible < papers.length && (
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

      {/* Beautiful Research Dialog Modal (Desktop Only) */}
      <AnimatePresence>
        {selectedPaper && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#101010]/95 p-8 text-[#F8FAFC] shadow-2xl space-y-6 scrollbar"
            >
              
              {/* Close trigger */}
              <button
                onClick={() => setSelectedPaper(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header details */}
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-white font-bold uppercase tracking-widest flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-white" />
                    {selectedPaper.presentedAt || 'Research Paper'}
                  </span>
                  <span className="text-[10px] font-mono text-gray-550">• Published in {selectedPaper.year}</span>
                </div>
                <h2 className="text-2xl font-bold flex items-center gap-2 font-heading text-white">
                  <Sparkles className="w-5 h-5 text-white animate-pulse" />
                  {selectedPaper.title}
                </h2>
                <p className="text-xs font-semibold text-gray-400 font-mono">
                  Authors: {selectedPaper.authors.join(', ')}
                </p>
              </div>

              {/* Abstract details */}
              <div className="space-y-2 pt-4 border-t border-white/[0.04] text-left">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-555 font-mono">Abstract Overview</p>
                <p className="text-xs text-[#b5b5b5] leading-relaxed font-light italic bg-black/40 p-4 rounded-xl border border-white/[0.08] font-sans">
                  {stripMarkdown(selectedPaper.abstract)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-white/[0.04]">
                {selectedPaper.pdfUrl && (
                  <a
                    href={selectedPaper.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/[0.08] bg-black hover:bg-white/[0.02] hover:border-white/35 text-gray-300 hover:text-white text-xs font-bold transition-all font-mono"
                  >
                    <FileText className="w-4 h-4 text-white" /> DOWNLOAD PDF
                  </a>
                )}

                <button
                  onClick={() => handleOpenPaperPage(selectedPaper.slug)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-all shadow-md active:scale-95 font-mono"
                >
                  <span>VIEW FULL PUBLICATION</span>
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

export default Research;
