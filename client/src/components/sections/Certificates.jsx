import React from 'react';
import { Award, Calendar, Link as LinkIcon } from 'lucide-react';
import Reveal from '../UI/Reveal';

/**
 * Certificates: Modern achievement glass cards.
 * Re-themed to Minimal Premium Monochrome.
 */
const Certificates = ({ certificates }) => {
  if (!certificates || certificates.length === 0) return null;

  return (
    <section id="certificates" className="py-28 border-t border-white/[0.08] text-left select-none relative">
      <div className="space-y-12">
        
        {/* Title */}
        <div className="flex items-center space-x-4">
          <h2 className="text-3xl font-bold tracking-tight text-white font-heading">Certifications & Achievements</h2>
          <div className="h-[1px] bg-gradient-to-r from-white/20 to-transparent flex-grow" />
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert, index) => (
            <Reveal key={cert._id} delay={index * 0.08}>
              <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#101010]/80 backdrop-blur-md hover:border-white/30 hover:shadow-[0_20px_45px_rgba(0,0,0,0.8)] transition-all duration-400 flex items-start gap-4 shadow-xl group">
                
                {/* Glowing Award Icon */}
                <span className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-white shrink-0 group-hover:scale-103 transition-transform duration-300">
                  <Award className="w-5 h-5 animate-pulse" />
                </span>

                {/* Details */}
                <div className="space-y-2 flex-1 text-left">
                  <h3 className="text-sm font-extrabold text-[#F8FAFC] group-hover:text-white transition-colors font-heading leading-snug">{cert.title}</h3>
                  <p className="text-xs font-semibold text-white/80 font-mono tracking-wider">{cert.issuer}</p>

                  <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-white/[0.04]">
                    {cert.issueDate && (
                      <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        Issued: {new Date(cert.issueDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                      </span>
                    )}

                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-mono text-gray-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <LinkIcon className="w-3 h-3 text-white" />
                        <span>View Credentials</span>
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Certificates;
