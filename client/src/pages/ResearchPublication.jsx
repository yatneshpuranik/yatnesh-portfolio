import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '../layout/MainLayout';
import { fetchResearchPaperBySlug } from '../services/api';
import { ArrowLeft, BookOpen, Download, Clipboard, Check, Award, Layers, X, Sparkles, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import Reveal from '../components/UI/Reveal';

// Custom Keyboard-Accessible Dialog Modal
const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all duration-300"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border border-white/[0.08] bg-[#0d1628] p-6 md:p-8 text-[#F5F7FA] shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span>{title}</span>
        </h3>
        
        <div className="border-t border-white/[0.04] pt-4 text-xs leading-relaxed text-[#94A3B8] font-normal space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

const ResearchPublication = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Modal active triggers
  const [activeModal, setActiveModal] = useState(null);

  const { data: paper, isLoading, error } = useQuery({
    queryKey: ['research-paper', slug],
    queryFn: () => fetchResearchPaperBySlug(slug),
  });

  const handleCopyCitation = () => {
    if (paper?.citation) {
      navigator.clipboard.writeText(paper.citation);
      setCopied(true);
      toast.success('Citation copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen py-24 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-primary border-gray-800 rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-4 font-mono text-xs">Loading publication details...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !paper) {
    return (
      <MainLayout>
        <div className="min-h-screen py-24 text-center space-y-4">
          <h2 className="text-2xl font-bold">Publication Not Found</h2>
          <button 
            onClick={() => navigate('/')} 
            className="px-6 py-2 rounded-lg bg-primary text-white"
          >
            Go Back
          </button>
        </div>
      </MainLayout>
    );
  }

  const isPricePrediction = slug.includes('price');

  return (
    <MainLayout>
      <div className="py-8 space-y-8 text-left font-sans max-w-4xl mx-auto">
        
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#94A3B8] hover:text-[#F5F7FA] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Publications</span>
        </button>

        {/* Paper Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              {paper.presentedAt || 'Research Publication'}
            </span>
            <span className="text-xs font-mono text-gray-500 pl-2">Published: {paper.year}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7FA] leading-tight">
            {paper.title}
          </h1>

          <p className="text-xs font-semibold text-gray-400">
            Authors: {paper.authors.join(', ')}
          </p>
        </div>

        {/* Actions Toolbar */}
        <div className="flex flex-wrap gap-3 border-y border-white/[0.08] py-4 bg-[#08111f]/40 px-4 rounded-xl">
          <a
            href={paper.pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg bg-primary hover:bg-primary/80 text-white transition-all active:scale-95 shadow-md shadow-blue-500/10"
          >
            <Download className="w-4 h-4" />
            <span>Download Paper PDF</span>
          </a>

          {paper.citation && (
            <button
              onClick={handleCopyCitation}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg border border-white/[0.08] bg-[#0d1628] hover:bg-white/5 transition-all text-gray-300 hover:text-white"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Clipboard className="w-4 h-4" />}
              <span>{copied ? 'Citation Copied' : 'Copy Citation'}</span>
            </button>
          )}
        </div>

        {/* Grid layout for Summary blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div 
            onClick={() => setActiveModal('problem')}
            className="p-5 rounded-xl border border-white/[0.08] bg-[#0d1628] hover:border-primary/40 cursor-pointer transition-all duration-300"
          >
            <p className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest mb-2">Problem Statement</p>
            <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">{paper.problemStatement || 'Click to view details.'}</p>
          </div>

          <div 
            onClick={() => setActiveModal('methodology')}
            className="p-5 rounded-xl border border-white/[0.08] bg-[#0d1628] hover:border-primary/40 cursor-pointer transition-all duration-300"
          >
            <p className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest mb-2">Methodology & Experiments</p>
            <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">{paper.methodology || 'Click to view details.'}</p>
          </div>
        </div>

        {/* Main Details Showcase */}
        <div className="space-y-10 mt-8 font-normal">
          
          {/* Abstract */}
          <Reveal>
            <div className="space-y-3">
              <h2 className="text-xl font-extrabold text-[#F5F7FA] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> Abstract Summary
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed bg-[#08111f]/60 p-6 rounded-xl border border-white/[0.08] italic">
                {paper.abstract}
              </p>
            </div>
          </Reveal>

          {/* Results Comparison Chart */}
          <Reveal>
            <div className="space-y-4 border-t border-white/[0.08] pt-8">
              <h2 className="text-xl font-extrabold text-[#F5F7FA] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Experimental Performance Results</span>
              </h2>
              
              <div className="bg-[#08111f]/60 p-6 rounded-xl border border-white/[0.08] space-y-6">
                <p className="text-xs text-[#94A3B8]">
                  Comparative evaluation of regression error indexes and model prediction accuracy (higher is better for R-squared):
                </p>

                {isPricePrediction ? (
                  /* Price prediction chart */
                  <div className="space-y-4 max-w-md">
                    <div>
                      <div className="flex justify-between text-[10px] font-mono text-[#94A3B8] mb-1">
                        <span>Random Forest Regressor (R-squared)</span>
                        <span className="text-primary font-bold">0.91 (91%)</span>
                      </div>
                      <div className="w-full bg-[#050816] h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full" style={{ width: '91%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] font-mono text-[#94A3B8] mb-1">
                        <span>XGBoost Regressor (R-squared)</span>
                        <span className="text-primary font-bold">0.87 (87%)</span>
                      </div>
                      <div className="w-full bg-[#050816] h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full animate-pulse" style={{ width: '87%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] font-mono text-[#94A3B8] mb-1">
                        <span>Linear Regression Baseline (R-squared)</span>
                        <span className="text-primary font-bold">0.72 (72%)</span>
                      </div>
                      <div className="w-full bg-[#050816] h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-[#3b82f6]/40 rounded-full" style={{ width: '72%' }} />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* HydroBloom chart */
                  <div className="space-y-4 max-w-md">
                    <div>
                      <div className="flex justify-between text-[10px] font-mono text-[#94A3B8] mb-1">
                        <span>Irrigation Waste Reduction</span>
                        <span className="text-green-500 font-bold">30% Save</span>
                      </div>
                      <div className="w-full bg-[#050816] h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-600 to-emerald-400 rounded-full" style={{ width: '30%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] font-mono text-[#94A3B8] mb-1">
                        <span>Harvesting Survival Velocity</span>
                        <span className="text-green-500 font-bold">100% Rate</span>
                      </div>
                      <div className="w-full bg-[#050816] h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-600 to-emerald-400 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Reveal>

          {/* Model Architecture */}
          {paper.architecture && (
            <Reveal>
              <div 
                onClick={() => setActiveModal('architecture')}
                className="space-y-3 border-t border-white/[0.08] pt-8 cursor-pointer group"
              >
                <h2 className="text-xl font-extrabold text-[#F5F7FA] flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-primary" /> Model Architecture
                  </span>
                  <span className="text-xs font-mono text-primary group-hover:underline">Explore Details</span>
                </h2>
                <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">
                  {paper.architecture}
                </p>
              </div>
            </Reveal>
          )}

          {/* Citation Reference Card */}
          {paper.citation && (
            <Reveal>
              <div className="p-5 rounded-xl border border-white/[0.08] bg-[#08111f]/40 space-y-3 mt-12">
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">IEEE Citation Reference</p>
                <code className="block text-[10px] bg-black/40 p-3 rounded font-mono text-gray-300 leading-normal select-all">
                  {paper.citation}
                </code>
              </div>
            </Reveal>
          )}

        </div>

        {/* Modal Dialog Portals */}
        <Modal 
          isOpen={activeModal === 'problem'} 
          onClose={() => setActiveModal(null)}
          title="Problem Statement & Objective"
        >
          <p>{paper.problemStatement}</p>
        </Modal>

        <Modal 
          isOpen={activeModal === 'methodology'} 
          onClose={() => setActiveModal(null)}
          title="Experimental Methodology"
        >
          <p>{paper.methodology}</p>
          {paper.results && (
            <div className="mt-4 pt-4 border-t border-white/[0.04]">
              <p className="font-extrabold uppercase tracking-wider text-white text-[10px] mb-2">Experimental Results</p>
              <p>{paper.results}</p>
            </div>
          )}
        </Modal>

        <Modal 
          isOpen={activeModal === 'architecture'} 
          onClose={() => setActiveModal(null)}
          title="Model System Architecture"
        >
          <p>{paper.architecture}</p>
          {paper.conclusion && (
            <div className="mt-4 pt-4 border-t border-white/[0.04]">
              <p className="font-extrabold uppercase tracking-wider text-white text-[10px] mb-2">Conclusion</p>
              <p>{paper.conclusion}</p>
            </div>
          )}
        </Modal>

      </div>
    </MainLayout>
  );
};

export default ResearchPublication;
