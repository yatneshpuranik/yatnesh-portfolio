import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';
import Reveal from '../UI/Reveal';
import { stripMarkdown } from '../../utils/markdown';

const getCompanyLogo = (companyName, size = 'sm') => {
  const name = companyName.toLowerCase();
  const isThreeSyntax = name.includes('three') || name.includes('syntax');
  const sizeClasses = size === 'lg' ? 'w-10 h-10 text-xs' : 'w-4 h-4 text-[8px]';
  const text = isThreeSyntax ? '3S' : companyName.slice(0, 2).toUpperCase();
  const gradient = isThreeSyntax 
    ? 'from-cyan-500 to-blue-600 text-white font-black' 
    : 'from-zinc-700 to-zinc-800 text-zinc-300 font-bold border border-white/10';

  return (
    <div className={`rounded flex items-center justify-center bg-gradient-to-tr shrink-0 select-none ${sizeClasses} ${gradient}`}>
      {text}
    </div>
  );
};

const Experience = ({ experiences }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeFile, setActiveFile] = useState('contributions.js');

  if (!experiences || experiences.length === 0) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getCleanBullets = (htmlString) => {
    if (!htmlString) return [];
    const matches = htmlString.match(/<li>(.*?)<\/li>/g);
    if (!matches) return [htmlString.replace(/<[^>]*>/g, '')];
    return matches.map(m => m.replace(/<\/?li>/g, '').replace(/<[^>]*>/g, '').trim());
  };

  const activeExp = experiences[activeIdx];
  const bullets = getCleanBullets(activeExp.description);
  const isCRM = activeExp.company.toLowerCase().includes('three');

  // Hardcoded blueprint details to enrich the JSON files
  const architectureDetails = isCRM ? {
    pattern: "Turborepo Monorepo & Multi-Tenancy Client Portal",
    isolation: "Tenant ID column-based queries via Prisma schemas",
    frontend: "Next.js 14 client modules with dynamic route loaders",
    backend: "NestJS API handlers with custom auth guard interceptors",
    cache: "Redis clusters for tenant session stores"
  } : {
    pattern: "Model-View-Controller Rest API Design",
    database: "MongoDB Atlas storage cluster connection",
    auth: "JSON Web Tokens with express-validator middleware",
    files: "Cloudinary HTTPS stream pipelines"
  };

  const impactDetails = isCRM ? {
    tenantSecured: "100% data tenant separation verified",
    apiSpeedup: "Reduced payload routing time by ~35%",
    buildCaching: "+40% faster local compiles via Turborepo",
    codeQuality: "Completed 10+ modular reusable UI components"
  } : {
    apiResponse: "Sub-80ms backend response times",
    securityCompliance: "Sanitized inputs preventing SQLi/NoSQL injection",
    deploymentUptime: "99.9% availability via Render/Vercel pipelines"
  };

  // Dynamic line count helper based on active file content
  const getLineCount = () => {
    if (activeFile === 'contributions.js') {
      return 26 + bullets.length + Math.ceil(activeExp.technologies.length / 4);
    }
    return 10;
  };
  const totalLineCount = getLineCount();
  const lines = Array.from({ length: totalLineCount }, (_, i) => i + 1);

  return (
    <section id="experience" className="py-28 border-t border-white/[0.08] text-left">
      <div className="space-y-12">
        
        {/* Title */}
        <div className="flex items-center space-x-4">
          <h2 className="text-3xl font-bold tracking-tight text-white font-heading">Experience</h2>
          <div className="h-[1px] bg-gradient-to-r from-white/20 to-transparent flex-grow" />
        </div>

        {/* VS Code Window Container */}
        <Reveal delay={0.1}>
          <div className="w-full rounded-xl border border-white/[0.08] bg-[#101010] backdrop-blur-md code-editor-shadow overflow-hidden flex flex-col min-h-[500px]">
            
            {/* Title Bar (macOS style window decorations) */}
            <div className="h-11 border-b border-white/[0.08] bg-[#090909] px-4 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-white/10 border border-white/20" />
                <span className="w-3 h-3 rounded-full bg-white/10 border border-white/20" />
                <span className="w-3 h-3 rounded-full bg-white/10 border border-white/20" />
              </div>
              <span className="text-[11px] font-mono font-medium text-gray-550 tracking-wide">
                workspace://yatnesh/experience
              </span>
              <div className="w-12" />
            </div>

            {/* Editor Workspace: Explorer + Editor Code Area */}
            <div className="flex-1 flex flex-col md:flex-row overflow-x-auto">
              
              {/* Left Explorer Sidebar */}
              <div className="w-full md:w-60 border-b md:border-b-0 md:border-r border-white/[0.08] bg-[#090909]/80 p-4 shrink-0 flex flex-col space-y-4">
                <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-widest text-[#B5B5B5] select-none">
                  <span>Workspace Explorer</span>
                  <Icons.FolderOpen className="w-3.5 h-3.5 text-white" />
                </div>

                <div className="space-y-3 text-xs font-mono font-medium">
                  {experiences.map((exp, idx) => {
                    const isSelectedCompany = idx === activeIdx;
                    return (
                      <div key={exp._id} className="flex items-start gap-2.5">
                        
                        {/* Dynamic timeline flow track segment */}
                        <div className="flex flex-col items-center shrink-0 w-3 pt-2">
                          <span className={`w-2 h-2 rounded-full border transition-all ${
                            isSelectedCompany 
                              ? 'bg-white border-white shadow-[0_0_8px_rgba(255,255,255,0.3)] animate-pulse' 
                              : 'bg-transparent border-white/10'
                          }`} />
                          {idx < experiences.length - 1 && (
                            <div className="w-[1px] h-12 bg-white/10 relative overflow-hidden my-1">
                              {isSelectedCompany && (
                                <motion.div 
                                  animate={{ y: ['-100%', '100%'] }} 
                                  transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                                  className="absolute inset-x-0 h-4 bg-gradient-to-b from-transparent via-white to-transparent" 
                                />
                              )}
                            </div>
                          )}
                        </div>

                        {/* Company trigger content block */}
                        <div className="flex-1 space-y-1">
                          <button
                            onClick={() => {
                              setActiveIdx(idx);
                              setActiveFile('contributions.js');
                            }}
                            className={`w-full flex items-center space-x-2 px-2 py-1 rounded transition-colors text-left cursor-pointer ${
                              isSelectedCompany ? 'text-white font-bold bg-white/[0.03] border border-white/20' : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            {getCompanyLogo(exp.company, 'sm')}
                            <span className="truncate">{exp.company.toLowerCase().replace(/\s+/g, '-')}</span>
                          </button>

                          {/* Virtual Files inside Active Folder */}
                          {isSelectedCompany && (
                            <div className="pl-4 space-y-1 border-l border-white/[0.06] ml-4 mt-1">
                              <button
                                onClick={() => setActiveFile('contributions.js')}
                                className={`w-full flex items-center space-x-2 px-2 py-0.5 rounded transition-colors text-left cursor-pointer ${
                                  activeFile === 'contributions.js' ? 'bg-white/10 text-white font-bold' : 'text-gray-550 hover:text-white'
                                }`}
                              >
                                <Icons.FileCode className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                                <span>contributions.js</span>
                              </button>
                              <button
                                onClick={() => setActiveFile('architecture-isolation.json')}
                                className={`w-full flex items-center space-x-2 px-2 py-0.5 rounded transition-colors text-left cursor-pointer ${
                                  activeFile === 'architecture-isolation.json' ? 'bg-white/10 text-white font-bold' : 'text-gray-550 hover:text-white'
                                }`}
                              >
                                <Icons.FileJson className="w-3.5 h-3.5 text-white shrink-0" />
                                <span>architecture.json</span>
                              </button>
                              <button
                                onClick={() => setActiveFile('impact-metrics.json')}
                                className={`w-full flex items-center space-x-2 px-2 py-0.5 rounded transition-colors text-left cursor-pointer ${
                                  activeFile === 'impact-metrics.json' ? 'bg-white/10 text-white font-bold' : 'text-gray-550 hover:text-white'
                                }`}
                              >
                                <Icons.FileSpreadsheet className="w-3.5 h-3.5 text-white shrink-0" />
                                <span>impact.json</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Active Editor Area */}
              <div className="flex-grow flex flex-col bg-[#101010] min-w-0">
                
                {/* Editor Tabs Bar */}
                <div className="h-9 bg-[#090909] border-b border-white/[0.08] flex items-end px-2 overflow-x-auto scrollbar-none shrink-0 select-none">
                  <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-t-lg bg-[#101010] border-t border-l border-r border-white/[0.08] text-[11px] font-mono text-white">
                    {activeFile === 'contributions.js' ? (
                      <Icons.FileCode className="w-3 h-3 text-yellow-500 shrink-0" />
                    ) : (
                      <Icons.FileJson className="w-3 h-3 text-white shrink-0" />
                    )}
                    <span>{activeFile}</span>
                    <Icons.X className="w-3 h-3 text-gray-550 ml-1.5" />
                  </div>
                </div>

                {/* Editor Code Pane */}
                <div className="p-6 flex flex-col min-h-[380px] flex-1">
                  
                  {/* Premium details card (rendered inside editor body) */}
                  {activeFile === 'contributions.js' && (
                    <div className="mb-6 p-4 rounded-xl border border-white/[0.06] bg-[#090909]/60 backdrop-blur-md flex items-center gap-4 relative overflow-hidden group select-none">
                      {/* Decorative gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      
                      {getCompanyLogo(activeExp.company, 'lg')}
                      
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-heading font-extrabold text-sm text-white">{activeExp.company}</h4>
                          <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-heading font-bold text-cyan-400 uppercase tracking-widest">
                            {activeExp.type || 'Internship'}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1 font-sans font-light">{activeExp.role}</p>
                        <p className="text-[9px] text-zinc-500 font-mono mt-0.5">
                          {formatDate(activeExp.startDate)} - {activeExp.currentlyWorking ? 'Present' : formatDate(activeExp.endDate)}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex overflow-x-auto flex-1">
                    {/* Line Numbers Gutter */}
                    <div className="w-10 flex flex-col select-none text-right pr-4 border-r border-white/[0.04] text-[11px] sm:text-xs font-mono text-gray-600 font-medium">
                      {lines.map((ln) => (
                        <div key={ln}>{ln}</div>
                      ))}
                    </div>

                    {/* Active File Content Renderer */}
                    <div className="pl-6 flex-grow min-w-0 text-left overflow-x-auto select-text selection:bg-[#3B82F6]/20">
                      
                      {activeFile === 'contributions.js' && (
                        <div className="font-mono text-[11px] sm:text-xs md:text-sm leading-relaxed text-[#94a3b8] space-y-1">
                          {/* Comments Block */}
                          <div><span className="text-[#6A9955]">{`/**`}</span></div>
                          <div><span className="text-[#6A9955]">{` * @company ${activeExp.company}`}</span></div>
                          <div><span className="text-[#6A9955]">{` * @role ${activeExp.role} (${activeExp.type})`}</span></div>

                        <div><span className="text-[#6A9955]">{` * @duration ${formatDate(activeExp.startDate)} - ${activeExp.currentlyWorking ? 'Present' : formatDate(activeExp.endDate)}`}</span></div>
                        <div><span className="text-[#6A9955]">{` * @location ${activeExp.location}`}</span></div>
                        <div><span className="text-[#6A9955]">{` */`}</span></div>
                        
                        <div className="h-2" />
                        
                        <div>
                          <span className="text-[#C586C0]">import</span>{` `}
                          <span className="text-[#9CDCFE]">{`{ Developer }`}</span>{` `}
                          <span className="text-[#C586C0]">from</span>{` `}
                          <span className="text-[#CE9178]">'yatnesh'</span>{`;`}
                        </div>
                        
                        <div className="h-2" />
                        
                        <div>
                          <span className="text-[#569CD6]">const</span>{` `}
                          <span className="text-[#9CDCFE]">internship</span>{` = `}
                          <span className="text-[#569CD6]">new</span>{` `}
                          <span className="text-[#4EC9B0]">Developer</span>{`({`}
                        </div>
                        <div className="pl-4">
                          <span className="text-[#9CDCFE]">company</span>{`: `}
                          <span className="text-[#CE9178]">"${activeExp.company}"</span>{`,`}
                        </div>
                        <div className="pl-4">
                          <span className="text-[#9CDCFE]">role</span>{`: `}
                          <span className="text-[#CE9178]">"${activeExp.role}"</span>
                        </div>
                        <div>{`});`}</div>
                        
                        <div className="h-4" />
                        
                        <div>
                          <span className="text-[#9CDCFE]">internship</span>{`.`}
                          <span className="text-[#DCDCAA]">contributions</span>{` = [`}
                        </div>
                        {bullets.map((bullet, idx) => (
                          <div key={idx} className="pl-4 flex items-start">
                            <span className="text-gray-600 shrink-0 select-none mr-1.5">{`-`}</span>
                            <span className="text-[#CE9178]">"{stripMarkdown(bullet)}"</span>
                            {idx < bullets.length - 1 ? <span className="text-[#94a3b8]">{`,`}</span> : ''}
                          </div>
                        ))}
                        <div>{`];`}</div>

                        <div className="h-4" />
                        
                        <div>
                          <span className="text-[#9CDCFE]">internship</span>{`.`}
                          <span className="text-[#DCDCAA]">techStack</span>{` = [`}
                        </div>
                        <div className="pl-4 flex flex-wrap gap-x-2 gap-y-0.5">
                          {activeExp.technologies.map((tech, idx) => (
                            <span key={tech}>
                              <span className="text-[#CE9178]">"${tech}"</span>
                              {idx < activeExp.technologies.length - 1 ? <span className="text-[#94a3b8]">{`,`}</span> : ''}
                            </span>
                          ))}
                        </div>
                        <div>{`];`}</div>
                      </div>
                    )}

                    {activeFile === 'architecture-isolation.json' && (
                      <div className="font-mono text-[11px] sm:text-xs md:text-sm leading-relaxed text-[#94a3b8] space-y-1">
                        <div>{`{`}</div>
                        {Object.entries(architectureDetails).map(([key, val], idx, arr) => (
                          <div key={key} className="pl-4">
                            <span className="text-[#9CDCFE]">"{key}"</span>{`: `}
                            <span className="text-[#CE9178]">"${val}"</span>
                            {idx < arr.length - 1 ? <span className="text-[#94a3b8]">{`,`}</span> : ''}
                          </div>
                        ))}
                        <div>{`}`}</div>
                      </div>
                    )}

                    {activeFile === 'impact-metrics.json' && (
                      <div className="font-mono text-[11px] sm:text-xs md:text-sm leading-relaxed text-[#94a3b8] space-y-1">
                        <div>{`{`}</div>
                        {Object.entries(impactDetails).map(([key, val], idx, arr) => (
                          <div key={key} className="pl-4">
                            <span className="text-[#9CDCFE]">"{key}"</span>{`: `}
                            <span className="text-[#CE9178]">"${val}"</span>
                            {idx < arr.length - 1 ? <span className="text-[#94a3b8]">{`,`}</span> : ''}
                          </div>
                        ))}
                        <div>{`}`}</div>
                      </div>
                    )}

                  </div>

                </div>

              </div>

            </div>
          </div>
        </div>

        </Reveal>
      </div>
    </section>
  );
};

export default Experience;
