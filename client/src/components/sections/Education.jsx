import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Award } from 'lucide-react';
import Reveal from '../UI/Reveal';

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
      <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="space-y-12 relative">
        
        {/* Header */}
        <div className="flex items-center space-x-4">
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-[#3b82f6]" /> Education
          </h2>
          <div className="h-[1px] bg-gradient-to-r from-blue-500/50 to-transparent flex-grow" />
        </div>

        {/* Timeline container */}
        <div className="relative max-w-4xl mx-auto pt-6">
          
          {/* 1. Track connector (Static) */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/[0.04] -translate-x-1/2 pointer-events-none" />

          {/* 2. Grow connector (Animated on View) */}
          <motion.div 
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-sky-400 to-transparent -translate-x-1/2 origin-top pointer-events-none"
          />

          {/* Timeline Nodes */}
          <div className="space-y-12">
            {educations.map((edu, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div 
                  key={edu._id} 
                  className={`flex flex-col md:flex-row relative items-start md:items-center w-full ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Glowing Node Dot Marker */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#050816] border-2 border-blue-500 z-10 flex items-center justify-center shadow-[0_0_8px_rgba(59,130,246,0.6)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                  </div>

                  {/* Left Empty Side Spacer on Desktop */}
                  <div className="hidden md:block w-1/2" />

                  {/* Card Container */}
                  <div className={`w-full md:w-[calc(50%-2.5rem)] pl-12 md:pl-0 ${
                    isEven ? 'md:pr-10 text-left md:text-right' : 'md:pl-10 text-left'
                  }`}>
                    <Reveal delay={index * 0.15}>
                      <div className="glass-card p-6 rounded-2xl border border-white/[0.06] hover:border-blue-500/20 hover:shadow-blue-500/10 transition-all duration-300 relative group overflow-hidden">
                        
                        {/* Hover accent background glow */}
                        <div className="absolute -inset-px bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        <div className={`flex flex-col gap-2 relative z-10 ${isEven ? 'md:items-end' : 'items-start'}`}>
                          <div className={`flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-wider text-gray-500 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}</span>
                          </div>

                          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                            {edu.degree}
                          </h3>
                          
                          <span className="text-xs font-mono font-bold text-[#3b82f6] uppercase tracking-wide">
                            {edu.institution} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                          </span>

                          {edu.grade && (
                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400 bg-white/[0.02] border border-white/[0.04] px-2 py-0.5 rounded">
                              <Award className="w-3.5 h-3.5 text-yellow-500" />
                              <span>GPA: {edu.grade}</span>
                            </div>
                          )}

                          {edu.description && (
                            <p className={`text-xs leading-relaxed text-[#94A3B8] font-normal pt-2 ${isEven ? 'md:text-right' : 'text-left'}`}>
                              {edu.description}
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
