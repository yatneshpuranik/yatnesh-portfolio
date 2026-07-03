import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProjects } from '../../services/api';
import Reveal from '../UI/Reveal';

/**
 * Skills: Interactive technology capsules categorized inside a premium editorial grid.
 * Re-themed to Minimal Premium Monochrome.
 */
const Skills = ({ skills }) => {
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Fetch projects from query cache
  const { data: projects } = useQuery({ queryKey: ['projects'], queryFn: fetchProjects });

  if (!skills || skills.length === 0) return null;

  // Group all skills by category (including currently learning)
  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  // Clean category names for premium display mapping
  const categoryLabelMap = {
    'Programming Languages': 'Languages',
    'Frontend': 'Frontend Engineering',
    'Backend': 'Backend Engineering',
    'Databases': 'Database Systems',
    'CSE Fundamentals': 'Computer Science',
    'Tools & Platforms': 'Tools & Infrastructure',
    'Deployment': 'Deployment & Cloud',
    'Currently Learning': 'Currently Learning'
  };

  const orderedCategoryKeys = [
    'Programming Languages',
    'Frontend',
    'Backend',
    'Databases',
    'CSE Fundamentals',
    'Tools & Platforms',
    'Deployment',
    'Currently Learning'
  ];

  const finalCategories = orderedCategoryKeys.filter(cat => groupedSkills[cat] && groupedSkills[cat].length > 0);

  const getCategoryIcon = (catKey) => {
    switch (catKey) {
      case 'Programming Languages':
        return <Icons.Terminal className="w-4 h-4 text-white" />;
      case 'Frontend':
        return <Icons.Layout className="w-4 h-4 text-white" />;
      case 'Backend':
        return <Icons.Server className="w-4 h-4 text-white" />;
      case 'Databases':
        return <Icons.Database className="w-4 h-4 text-white" />;
      case 'CSE Fundamentals':
        return <Icons.GraduationCap className="w-4 h-4 text-white" />;
      case 'Tools & Platforms':
        return <Icons.Wrench className="w-4 h-4 text-white" />;
      case 'Deployment':
        return <Icons.Cloud className="w-4 h-4 text-white" />;
      default:
        return <Icons.Cpu className="w-4 h-4 text-white" />;
    }
  };

  const getWhyIUseIt = (skillName) => {
    switch (skillName.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        return 'Leveraged as the primary engine for high-concurrency Node.js runtimes and type-safe frontends, minimizing client bugs.';
      case 'java':
      case 'c++':
        return 'Utilized for deep algorithms configuration, thread scheduling, data structures, and highly optimized processing pipelines.';
      case 'react':
      case 'next.js':
        return 'Used to structure reusable component models, virtual DOM renders, and server-side page hydration pathways.';
      case 'express':
      case 'node.js':
      case 'nestjs':
        return 'Deployed as the backend API runtime due to its non-blocking event-driven loop and rapid monorepo compilation.';
      case 'mongodb':
        return 'Leveraged for its flexible document modeling, horizontal scaling capabilities, and fast dynamic lookups.';
      case 'prisma':
        return 'Implemented as the type-safe ORM mapper to secure column-level database tenant separation and migrations.';
      default:
        return 'Selected as the optimal technology to implement scalable architectures, clean code patterns, and optimized execution pipelines.';
    }
  };

  const getMatchingProjects = (skillName) => {
    if (!projects) return [];
    return projects.filter(p => 
      p.technologies.some(t => 
        t.toLowerCase().includes(skillName.toLowerCase()) || 
        skillName.toLowerCase().includes(t.toLowerCase())
      )
    );
  };

  const matchingProjects = selectedSkill ? getMatchingProjects(selectedSkill.name) : [];

  return (
    <section id="skills" className="py-28 border-t border-white/[0.08] text-left select-none relative">
      <div className="space-y-16">
        
        {/* Title */}
        <div className="flex items-center space-x-4">
          <h2 className="text-3xl font-bold tracking-tight text-white font-heading">Technical Matrix</h2>
          <div className="h-[1px] bg-gradient-to-r from-white/20 to-transparent flex-grow" />
        </div>

        {/* Premium Grid Layout - separated by thin graphite borders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-white/[0.06] bg-[#101010]/50 rounded-2xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-white/[0.06] text-left shadow-2xl">
          {finalCategories.map((category, catIndex) => {
            const items = groupedSkills[category].sort((a, b) => (a.order || 0) - (b.order || 0));
            return (
              <div 
                key={category} 
                className="p-8 hover:bg-white/[0.005] transition-all duration-300 relative group flex flex-col justify-between min-h-[220px]"
              >
                {/* Spot highlight */}
                <div className="absolute inset-0 bg-white/[0.002] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <div className="space-y-6 relative z-10">
                  {/* Category Header */}
                  <div className="flex items-center space-x-2.5">
                    {getCategoryIcon(category)}
                    <h3 className="text-[10px] font-mono tracking-widest text-[#B5B5B5] group-hover:text-white transition-colors uppercase font-bold">
                      {categoryLabelMap[category] || category}
                    </h3>
                  </div>
 
                  {/* Skill Badges */}
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill, idx) => (
                      <motion.button 
                        key={skill._id} 
                        onClick={() => setSelectedSkill(skill)}
                        whileHover={{ scale: 1.04, y: -2 }}
                        className="px-3 py-1.5 text-xs font-mono font-medium text-white border border-[#2a2a2a] bg-black hover:bg-white hover:border-white hover:text-black rounded-lg transition-all duration-300 cursor-pointer shadow-sm"
                      >
                        {skill.name}
                      </motion.button>
                    ))}
                  </div>
                </div>
 
                <span className="text-[9px] font-mono text-gray-550 block mt-6 relative z-10">
                  {items.length} matrix elements
                </span>
              </div>
            );
          })}
        </div>

      </div>

      {/* Dynamic Skill Details Dialog Modal */}
      {selectedSkill && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedSkill(null)}
        >
          <div 
            className="relative w-full max-w-md rounded-2xl border border-[#2a2a2a] bg-[#101010] p-6 text-left shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedSkill(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <Icons.X className="w-4 h-4" />
            </button>
 
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-white/10 text-white">
                <Icons.Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white font-heading">{selectedSkill.name}</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold font-mono">Matrix Specifications</p>
              </div>
            </div>
 
            {/* Core Details Grid */}
            <div className="grid grid-cols-2 gap-4 bg-black/40 border border-[#2a2a2a] p-4 rounded-lg text-xs font-mono">
              <div className="space-y-1">
                <span className="text-gray-500 uppercase tracking-wider block text-[9px] font-bold">Skill Level</span>
                <span className="text-white font-bold">{selectedSkill.proficiency}% ({selectedSkill.proficiency >= 90 ? 'Expert' : (selectedSkill.proficiency >= 80 ? 'Advanced' : 'Intermediate')})</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 uppercase tracking-wider block text-[9px] font-bold">Experience Range</span>
                <span className="text-white font-bold">{selectedSkill.proficiency >= 85 ? '2+ Years Production' : '1+ Year Engineering'}</span>
              </div>
            </div>
 
            {/* Engineering Context */}
            <div className="space-y-1.5 text-xs pt-1">
              <span className="text-gray-500 uppercase tracking-wider block text-[9px] font-bold font-mono">Engineering Context</span>
              <p className="text-gray-300 leading-relaxed font-normal">
                {getWhyIUseIt(selectedSkill.name)}
              </p>
            </div>
 
            {/* Related Projects */}
            <div className="pt-1 space-y-2.5">
              <span className="text-gray-500 uppercase tracking-wider block text-[9px] font-bold font-mono">Related Projects</span>
              {matchingProjects.length > 0 ? (
                <div className="space-y-2.5">
                  {matchingProjects.map(p => (
                    <Link 
                      key={p._id}
                      to={`/project/${p.slug}`}
                      onClick={() => setSelectedSkill(null)}
                      className="flex items-center justify-between p-3 rounded-lg border border-[#2a2a2a] bg-black hover:bg-white hover:text-black hover:border-white transition-all duration-300 group/item cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-white group-hover/item:text-black transition-colors">{p.title}</p>
                        <p className="text-[10px] text-gray-400 group-hover/item:text-zinc-650 font-semibold line-clamp-1">{p.summary}</p>
                      </div>
                      <Icons.ArrowRight className="w-4 h-4 text-gray-500 group-hover/item:text-black group-hover/item:translate-x-1 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-black/40 border border-[#2a2a2a] text-center">
                  <p className="text-xs text-gray-500 leading-relaxed font-mono">
                    Used across backend microservices routing, local compiler tests, or monorepo tools.
                  </p>
                </div>
              )}
            </div>
 
          </div>
        </div>
      )}
    </section>
  );
};

export default Skills;
