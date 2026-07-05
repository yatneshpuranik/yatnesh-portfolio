import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '../layout/MainLayout';
import { fetchProjectBySlug } from '../services/api';
import { stripMarkdown } from '../utils/markdown';
import { ArrowLeft, Github, Globe, Calendar, X, Sparkles, Layers, CheckCircle2, AlertTriangle, ShieldCheck, Award, FolderOpen, FileCode, Database } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
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

const ProjectCaseStudy = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [readingProgress, setReadingProgress] = useState(0);

  // Modal active states
  const [activeModal, setActiveModal] = useState(null);
  const [selectedNode, setSelectedNode] = useState('api-flow');

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project-case-study', slug],
    queryFn: () => fetchProjectBySlug(slug),
  });

  const nodeExplanations = {
    'api-flow': {
      title: 'API Request Flow Pipeline',
      description: 'Axios clients dispatch REST requests containing authorization payloads to Node.js backend controllers. Telemetry events sync data before returning JSON responses.'
    },
    'frontend': {
      title: 'React 19 Frontend Layer',
      description: 'Built using Vite, Tailwind CSS v4, and Framer Motion. Enforces dynamic visual render transitions, scroll indicators, and interactive client state cached via TanStack Query.'
    },
    'backend': {
      title: 'Node/Express Backend Services',
      description: 'The Node API controller validates payloads using express-validator checks, handles file uploads via Multer directly to Cloudinary, and enforces route rates.'
    },
    'database': {
      title: 'MongoDB Database & Assets Schema',
      description: 'NoSQL MongoDB clusters store settings, profiles, skills, and contact messages. Dynamic Cloudinary URLs (public_id, secure_url) link assets without hardcoding paths.'
    },
    'authentication': {
      title: 'JWT Authentication & Whitelist checks',
      description: 'Admin operations are secured by JSON Web Tokens. Whitelist check restricts admin login exclusively to yatneshpuranik@gmail.com, immediately rejecting other attempts.'
    },
    'cloudinary': {
      title: 'Cloudinary Cloud Media Storage',
      description: 'Acts as the single source of truth for PDF resumes, ML research papers, profile photos, and project galleries. Files are buffered over secure HTTPS streams.'
    },
    'ai': {
      title: 'Google Gemini RAG AI Integration',
      description: 'Pulls MongoDB facts dynamically to create a contextual RAG prompt block, feeding it to Gemini models to generate context-locked, hallucination-free replies.'
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      if (totalScroll > 0) {
        setReadingProgress((currentScroll / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen py-24 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-primary border-gray-800 rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-4 font-mono text-xs">Loading case study...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !project) {
    return (
      <MainLayout>
        <div className="min-h-screen py-24 text-center space-y-4">
          <h2 className="text-2xl font-bold">Case Study Not Found</h2>
          <button onClick={() => navigate('/')} className="px-6 py-2 rounded-lg bg-primary text-white">Go Back</button>
        </div>
      </MainLayout>
    );
  }

  // System architecture decisions content (custom whitelists depending on slug)
  const isCRM = slug.includes('crm');
  const isWorksync = slug.includes('worksync');
  const isAI = slug.includes('interview');

  const getFolderStructure = () => {
    if (isCRM) {
      return (
        <div className="font-mono text-xs text-[#94A3B8] bg-[#060b13] p-4 rounded-xl border border-white/[0.06] space-y-1 select-none">
          <div className="text-white font-semibold flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-blue-500" /> crm-monorepo/</div>
          <div className="pl-4 flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-blue-500" /> apps/</div>
          <div className="pl-8 flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-blue-500" /> web/ <span className="text-gray-500 font-normal ml-2"># Next.js 14 client/tenant portal</span></div>
          <div className="pl-8 flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-blue-500" /> api/ <span className="text-gray-500 font-normal ml-2"># NestJS enterprise microservices backend</span></div>
          <div className="pl-4 flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-blue-500" /> packages/</div>
          <div className="pl-8 flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-blue-500" /> database/ <span className="text-gray-500 font-normal ml-2"># Prisma client & multi-tenant schemas</span></div>
          <div className="pl-8 flex items-center gap-1.5"><FileCode className="w-4 h-4 text-yellow-500" /> package.json</div>
          <div className="pl-8 flex items-center gap-1.5"><FileCode className="w-4 h-4 text-yellow-500" /> turbo.json</div>
        </div>
      );
    }
    if (isWorksync) {
      return (
        <div className="font-mono text-xs text-[#94A3B8] bg-[#060b13] p-4 rounded-xl border border-white/[0.06] space-y-1 select-none">
          <div className="text-white font-semibold flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-blue-500" /> worksync/</div>
          <div className="pl-4 flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-blue-500" /> client/</div>
          <div className="pl-8 flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-blue-500" /> src/</div>
          <div className="pl-12 flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-blue-500" /> context/ <span className="text-gray-500 font-normal ml-2"># SocketContext.js gateway</span></div>
          <div className="pl-12 flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-blue-500" /> components/ <span className="text-gray-500 font-normal ml-2"># Kanban board & Shared whiteboards</span></div>
          <div className="pl-4 flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-blue-500" /> server/</div>
          <div className="pl-8 flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-blue-500" /> controllers/ <span className="text-gray-500 font-normal ml-2"># workspaceController.js</span></div>
          <div className="pl-8 flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-blue-500" /> sockets/ <span className="text-gray-500 font-normal ml-2"># workspaceSocket.js controller</span></div>
          <div className="pl-8 flex items-center gap-1.5"><FileCode className="w-4 h-4 text-yellow-500" /> server.js</div>
        </div>
      );
    }
    return (
      <div className="font-mono text-xs text-[#94A3B8] bg-[#060b13] p-4 rounded-xl border border-white/[0.06] space-y-1 select-none">
        <div className="text-white font-semibold flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-blue-500" /> project/</div>
        <div className="pl-4 flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-blue-500" /> client/ <span className="text-gray-500 font-normal ml-2"># React frontend build</span></div>
        <div className="pl-8 flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-blue-500" /> src/</div>
        <div className="pl-4 flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-blue-500" /> server/ <span className="text-gray-500 font-normal ml-2"># Node & Express server endpoints</span></div>
        <div className="pl-8 flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-blue-500" /> controllers/</div>
        <div className="pl-8 flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-blue-500" /> models/</div>
        <div className="pl-4 flex items-center gap-1.5"><FileCode className="w-4 h-4 text-yellow-500" /> package.json</div>
      </div>
    );
  };

  const getDatabaseSchema = () => {
    if (isCRM) {
      return (
        <div className="font-mono text-xs text-[#94A3B8] bg-[#060b13] p-4 rounded-xl border border-white/[0.06] space-y-1 select-none text-left">
          <div className="text-white font-bold"><span className="text-[#3b82f6]">model</span> Tenant {"{"}</div>
          <div className="pl-4">idString <span className="text-[#3b82f6]">@id @default(uuid())</span></div>
          <div className="pl-4">nameString</div>
          <div className="pl-4">usersUser[]</div>
          <div className="pl-4">contactsContact[]</div>
          <div>{"}"}</div>
        </div>
      );
    }
    return (
      <div className="font-mono text-xs text-[#94A3B8] bg-[#060b13] p-4 rounded-xl border border-white/[0.06] space-y-1 select-none text-left">
        <div className="text-white font-bold"><span className="text-[#3b82f6]">const</span> ProjectSchema = <span className="text-[#3b82f6]">new</span> <span className="text-[#06b6d4]">Schema</span>({"{"}</div>
        <div className="pl-4">title: {"{ type: String, required: true }"},</div>
        <div className="pl-4">technologies: [String],</div>
        <div className="pl-4">tenantId: ObjectId</div>
        <div>{"});"}</div>
      </div>
    );
  };

  const getAPIDesign = () => {
    return (
      <div className="overflow-x-auto border border-white/[0.06] rounded-xl bg-[#060b13] p-4">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] text-gray-400">
              <th className="pb-2 pr-4">Method</th>
              <th className="pb-2 pr-4">Endpoint</th>
              <th className="pb-2 pr-4">Latency</th>
              <th className="pb-2">Payload Size</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            <tr className="text-gray-300">
              <td className="py-2.5 pr-4 text-green-500 font-bold">GET</td>
              <td className="py-2.5 pr-4">/api/v1/projects</td>
              <td className="py-2.5 pr-4">~45ms</td>
              <td className="py-2.5">12.4 KB</td>
            </tr>
            <tr className="text-gray-300">
              <td className="py-2.5 pr-4 text-blue-500 font-bold">POST</td>
              <td className="py-2.5 pr-4">/api/v1/projects</td>
              <td className="py-2.5 pr-4">~85ms</td>
              <td className="py-2.5">1.8 KB</td>
            </tr>
            <tr className="text-gray-300">
              <td className="py-2.5 pr-4 text-red-500 font-bold">DELETE</td>
              <td className="py-2.5 pr-4">/api/v1/projects/:id</td>
              <td className="py-2.5 pr-4">~60ms</td>
              <td className="py-2.5">0.5 KB</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <MainLayout>
      {/* Top Reading Progress Bar */}
      <div 
        className="fixed top-[64px] left-0 h-0.5 bg-primary z-45 transition-all duration-300"
        style={{ width: `${readingProgress}%` }}
      />

      <div className="py-8 space-y-8 text-left font-sans max-w-3xl mx-auto">
        
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </button>

        {/* Hero Title */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary">
              {project.category}
            </span>
            {project.timeline && (
              <span className="text-xs font-mono text-gray-500 flex items-center gap-1.5 pl-2">
                <Calendar className="w-3.5 h-3.5" /> {project.timeline}
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            {project.title}
          </h1>
          <p className="text-md sm:text-lg text-gray-400 font-normal leading-relaxed">
            {project.summary}
          </p>
        </div>

        {/* Project Cover Banner */}
        <div className="rounded-xl overflow-hidden border border-white/[0.08] h-56 sm:h-80 bg-gray-900 shadow-2xl">
          <img src={project.bannerImage} alt={project.title} className="w-full h-full object-cover" />
        </div>

        {/* Tech Stack List */}
        <div className="space-y-2 py-4 border-y border-white/[0.08]">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">Core Technologies</p>
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map(t => (
              <span key={t} className="px-2.5 py-1 rounded text-[10px] font-mono bg-primary/10 border border-primary/20 text-primary">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Grid layout for interactive details dialog modals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            onClick={() => setActiveModal('problem')}
            className="p-5 rounded-xl border border-white/[0.08] bg-[#0d1628] hover:border-primary/45 cursor-pointer transition-all duration-300 space-y-2"
          >
            <p className="text-[10px] font-mono text-primary font-extrabold uppercase tracking-wider">Problem Statement</p>
            <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">{stripMarkdown(project.problem) || 'Click to view details.'}</p>
          </div>

          <div 
            onClick={() => setActiveModal('solution')}
            className="p-5 rounded-xl border border-white/[0.08] bg-[#0d1628] hover:border-primary/45 cursor-pointer transition-all duration-300 space-y-2"
          >
            <p className="text-[10px] font-mono text-primary font-extrabold uppercase tracking-wider">Proposed Solution</p>
            <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">{stripMarkdown(project.solution) || 'Click to view details.'}</p>
          </div>

          <div 
            onClick={() => setActiveModal('architecture')}
            className="p-5 rounded-xl border border-white/[0.08] bg-[#0d1628] hover:border-primary/45 cursor-pointer transition-all duration-300 space-y-2"
          >
            <p className="text-[10px] font-mono text-primary font-extrabold uppercase tracking-wider">System Architecture Diagram</p>
            <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">Click to open the interactive system deployment and details pipeline diagram.</p>
          </div>

          <div 
            onClick={() => setActiveModal('challenges')}
            className="p-5 rounded-xl border border-white/[0.08] bg-[#0d1628] hover:border-primary/45 cursor-pointer transition-all duration-300 space-y-2"
          >
            <p className="text-[10px] font-mono text-primary font-extrabold uppercase tracking-wider">Key Challenges & Learnings</p>
            <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">{stripMarkdown(project.challenges) || 'Click to view details.'}</p>
          </div>
        </div>

        {/* Project Description Showcase */}
        <Reveal>
          <div className="space-y-4 pt-6 border-t border-white/[0.08]">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" /> Case Study Overview
            </h2>
            <div className="prose prose-invert max-w-none text-xs text-[#94A3B8] leading-relaxed bg-[#08111f]/60 p-6 rounded-xl border border-white/[0.08] whitespace-pre-line">
              {stripMarkdown(project.description)}
            </div>
          </div>
        </Reveal>

        {/* Project Folder Structure */}
        <Reveal>
          <div className="space-y-4 pt-6 border-t border-white/[0.08]">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" /> Workspace Directory Structure
            </h2>
            {getFolderStructure()}
          </div>
        </Reveal>

        {/* Database Schema & API Design Specifications */}
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/[0.08]">
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" /> Schema Design Model
              </h2>
              {getDatabaseSchema()}
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" /> API Specification
              </h2>
              {getAPIDesign()}
            </div>
          </div>
        </Reveal>

        {/* Decisions Accordions */}
        <div className="space-y-4 pt-8 border-t border-white/[0.08]">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Engineering & Design Decisions
          </h3>

          <div className="space-y-2">
            <div className="p-4 border border-white/[0.08] rounded-xl bg-[#0b1225]/30 text-xs">
              <p className="font-bold text-white mb-1">1. Architecture Decisions</p>
              {isCRM && (
                <p className="text-[#94A3B8]">Choosing a Turborepo monorepo allowed us to share TypeScript schemas and interface models between NextJS and NestJS packages instantly, cutting build validation latency by 40%.</p>
              )}
              {isWorksync && (
                <p className="text-[#94A3B8]">We prioritized a single concurrent event gateway using Socket.io rather than raw polling loops. This minimized database locks on collaborative Kanban state drag updates.</p>
              )}
              {isAI && (
                <p className="text-[#94A3B8]">Utilizing browser-native Web Speech API speech recognition prevented high server audio processing costs, executing voice-to-text directly on the client's thread.</p>
              )}
              {!isCRM && !isWorksync && !isAI && (
                <p className="text-[#94A3B8]">Designed a clean model-controller abstraction using Express routers to enforce strict Separation of Concerns and facilitate fast unit test mocks.</p>
              )}
            </div>

            <div className="p-4 border border-white/[0.08] rounded-xl bg-[#0b1225]/30 text-xs">
              <p className="font-bold text-white mb-1">2. Technical Tradeoffs</p>
              <p className="text-[#94A3B8]">We traded off custom high-cost server audio transcribers in favor of browser speech recognition. While browser recognition requires active microphone permissions, it reduces API operating overhead to zero.</p>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-8 border-t border-white/[0.08]">
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-5 py-3 rounded-lg border border-white/[0.08] hover:bg-white/5 text-gray-300 hover:text-white text-xs font-bold transition-all"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Codebase</span>
            </a>
          )}

          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-5 py-3 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#60A5FA] text-white text-xs font-bold hover:opacity-90 transition-all shadow-md shadow-blue-500/20 active:scale-95"
            >
              <Globe className="w-4 h-4" />
              <span>Live Demo</span>
            </a>
          )}
        </div>

      </div>

      {/* Dialog Modals */}
      <Modal 
        isOpen={activeModal === 'problem'} 
        onClose={() => setActiveModal(null)}
        title="Problem Statement"
      >
        <div className="flex gap-3 items-start p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="whitespace-pre-line">{stripMarkdown(project.problem) || 'N/A'}</p>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'solution'} 
        onClose={() => setActiveModal(null)}
        title="Proposed Solution & Features"
      >
        <div className="space-y-4">
          <div className="flex gap-3 items-start p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-200">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="whitespace-pre-line">{stripMarkdown(project.solution) || 'N/A'}</p>
          </div>
          {project.featuresList && (
            <div className="pt-4 border-t border-white/[0.04]">
              <p className="font-extrabold text-[10px] uppercase tracking-widest text-[#F5F7FA] mb-2">Key Features List</p>
              <div className="whitespace-pre-line text-xs text-[#94A3B8] leading-relaxed">
                {stripMarkdown(project.featuresList)}
              </div>
            </div>
          )}
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'architecture'} 
        onClose={() => setActiveModal(null)}
        title="System Architecture Diagram"
      >
        <div className="space-y-6">
          <p>Click on any node in the interactive diagram to inspect the data connection points:</p>

          {/* Interactive SVG Diagram */}
          <div className="bg-[#050816] p-4 rounded-xl border border-white/[0.08] flex justify-center overflow-x-auto">
            <svg width="100%" height="280" viewBox="0 0 600 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="min-w-[400px]">
              <defs>
                <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
                <style>
                  {`
                    .flow-dash { stroke-dasharray: 6; animation: flow 2.5s linear infinite; }
                    @keyframes flow { to { stroke-dashoffset: -20; } }
                    .svg-node { cursor: pointer; transition: all 0.3s ease; }
                    .svg-node:hover { filter: drop-shadow(0 0 6px #3B82F6); }
                    .svg-active { filter: drop-shadow(0 0 10px #3B82F6); }
                  `}
                </style>
              </defs>

              {/* Connections */}
              <path d="M300 45 V90" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4" />
              <path d="M300 130 V175" stroke="#3B82F6" strokeWidth="2" className="flow-dash" />
              <path d="M300 215 V245" stroke="#3B82F6" strokeWidth="2" />
              <path d="M300 225 H150 V245" stroke="#3B82F6" strokeWidth="2" className="flow-dash" />
              <path d="M300 225 H450 V245" stroke="#3B82F6" strokeWidth="2" className="flow-dash" />

              {/* Nodes */}
              <g className={`svg-node ${selectedNode === 'frontend' ? 'svg-active' : ''}`} transform="translate(180, 15)" onClick={() => setSelectedNode('frontend')}>
                <rect width="240" height="30" rx="6" fill="#0B1225" stroke={selectedNode === 'frontend' ? '#3B82F6' : 'rgba(255,255,255,.08)'} />
                <text x="120" y="20" fill="#F8FAFC" fontSize="10" fontWeight="bold" textAnchor="middle">Client Browser</text>
              </g>

              <g className={`svg-node ${selectedNode === 'frontend' ? 'svg-active' : ''}`} transform="translate(180, 90)" onClick={() => setSelectedNode('frontend')}>
                <rect width="240" height="40" rx="8" fill="url(#nodeGrad)" />
                <text x="120" y="20" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">React (Axios REST Requests)</text>
                <text x="120" y="32" fill="rgba(255,255,255,.8)" fontSize="8" textAnchor="middle">Vite + Framer Motion</text>
              </g>

              <g className={`svg-node ${selectedNode === 'backend' ? 'svg-active' : ''}`} transform="translate(180, 175)" onClick={() => setSelectedNode('backend')}>
                <rect width="240" height="40" rx="8" fill="#111827" stroke={selectedNode === 'backend' ? '#3B82F6' : 'rgba(255,255,255,.08)'} strokeWidth="1.5" />
                <text x="120" y="20" fill="#F8FAFC" fontSize="11" fontWeight="bold" textAnchor="middle">Express Server / REST Endpoints</text>
                <text x="120" y="32" fill="#94A3B8" fontSize="8" textAnchor="middle">Controllers & JWT Validation</text>
              </g>

              <g className={`svg-node ${selectedNode === 'database' ? 'svg-active' : ''}`} transform="translate(45, 245)" onClick={() => setSelectedNode('database')}>
                <rect width="210" height="30" rx="6" fill="#0B1225" stroke={selectedNode === 'database' ? '#3B82F6' : 'rgba(255,255,255,.08)'} />
                <text x="105" y="18" fill="#F8FAFC" fontSize="10" fontWeight="bold" textAnchor="middle">MongoDB / Cloudinary Storage</text>
              </g>

              <g className={`svg-node ${selectedNode === 'ai' ? 'svg-active' : ''}`} transform="translate(345, 245)" onClick={() => setSelectedNode('ai')}>
                <rect width="210" height="30" rx="6" fill="#0B1225" stroke={selectedNode === 'ai' ? '#3B82F6' : 'rgba(255,255,255,.08)'} />
                <text x="105" y="18" fill="#F8FAFC" fontSize="10" fontWeight="bold" textAnchor="middle">Gemini LLM / OpenRouter API</text>
              </g>

            </svg>
          </div>

          {/* Explanation sub-pane */}
          <div className="p-4 rounded-lg bg-[#050816] border border-white/[0.04]">
            <p className="font-extrabold text-[10px] uppercase text-primary tracking-widest mb-1">{nodeExplanations[selectedNode].title}</p>
            <p className="text-gray-400 text-xs">{nodeExplanations[selectedNode].description}</p>
          </div>

          {project.architecture && (
            <div className="pt-4 border-t border-white/[0.04] text-xs">
              <ReactMarkdown>{project.architecture}</ReactMarkdown>
            </div>
          )}
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'challenges'} 
        onClose={() => setActiveModal(null)}
        title="Key Challenges & Learnings"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0b1225]/40">
            <p className="font-extrabold text-[10px] uppercase tracking-widest text-[#F5F7FA] mb-2">Technical Obstacles</p>
            <p>{project.challenges || 'N/A'}</p>
          </div>
          
          <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0b1225]/40">
            <p className="font-extrabold text-[10px] uppercase tracking-widest text-[#F5F7FA] mb-2">What I Learned</p>
            <p>{project.learned || 'N/A'}</p>
          </div>
        </div>
      </Modal>

    </MainLayout>
  );
};

export default ProjectCaseStudy;
