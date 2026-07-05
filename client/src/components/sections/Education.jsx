import React from 'react';
import { Calendar, Award, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import Reveal from '../UI/Reveal';
import { stripMarkdown } from '../../utils/markdown';

const Education = ({ educations }) => {
  if (!educations || educations.length === 0) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <section id="education" className="py-20 border-t border-white/[0.08] text-left select-none relative overflow-hidden">

      {/* Background glow accent */}
      <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-white/[0.01] rounded-full blur-[100px] pointer-events-none" />

      <div className="space-y-12">

        {/* Header */}
        <div className="flex items-center space-x-4">
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Education
          </h2>
          <div className="h-[1px] bg-gradient-to-r from-white/20 to-transparent flex-grow" />
        </div>

        {/* Timeline container */}
        <div className="relative max-w-4xl mx-auto pt-6">

          {/* 1. Track connector (Static) */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/[0.04] -translate-x-1/2 pointer-events-none" />

          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-white/30 via-white/10 to-transparent -translate-x-1/2 origin-top pointer-events-none"
          />

          {/* Timeline Nodes */}
          <div className="space-y-12">
            {educations.map((edu, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={edu._id}
                  className={`flex flex-col md:flex-row relative items-start md:items-center w-full ${isEven ? 'md:flex-row-reverse' : ''
                    }`}
                >
                  {/* Glowing Node Dot Marker (Monochrome white/zinc theme) */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0a0a0f] border-2 border-white/40 z-10 flex items-center justify-center shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  </div>

                  {/* Left Empty Side Spacer on Desktop */}
                  <div className="hidden md:block w-1/2" />

                  {/* Card Container */}
                  <div className={`w-full md:w-[calc(50%-2.5rem)] pl-12 md:pl-0 ${isEven ? 'md:pr-10 text-left md:text-right' : 'md:pl-10 text-left'
                    }`}>
                    <Reveal delay={index * 0.15}>
                      <div className="glass-card p-6 rounded-2xl border border-white/[0.06] hover:border-white/20 hover:shadow-2xl transition-all duration-300 relative group overflow-hidden">

                        {/* Hover accent background glow */}
                        <div className="absolute -inset-px bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        <div className={`flex flex-col gap-2 relative z-10 ${isEven ? 'md:items-end' : 'items-start'}`}>
                          <div className={`flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-wider text-gray-500 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}</span>
                          </div>

                          <h3 className="text-lg font-bold text-white group-hover:text-white transition-colors">
                            {edu.degree}
                          </h3>

                          {/* Monochrome text highlight */}
                          <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wide">
                            {edu.institution} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                          </span>

                          {/* Grade Badge themed to match Research year bubble (bg-[#101010] and border-white/10) */}
                          {edu.grade && (
                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white bg-[#101010] border border-white/10 px-2.5 py-1 rounded">
                              <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                              <span>{edu.degree.toLowerCase().includes('secondary') ? 'Percentage' : 'GPA'}: {edu.grade}</span>
                            </div>
                          )}

                          {edu.description && (
                            <p className={`text-xs leading-relaxed text-[#94A3B8] font-normal pt-2 ${isEven ? 'md:text-right' : 'text-left'}`}>
                              {stripMarkdown(edu.description)}
                            </p>
                          )}
                        </div>

                      </div>
                    </Reveal>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Education;
