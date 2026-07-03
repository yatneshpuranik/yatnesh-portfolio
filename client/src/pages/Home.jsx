import React from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '../layout/MainLayout';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Skills from '../components/sections/Skills';
import Roadmap from '../components/sections/Roadmap';
import Experience from '../components/sections/Experience';
import Projects from '../components/sections/Projects';
import Research from '../components/sections/Research';
import Education from '../components/sections/Education';
import Contact from '../components/sections/Contact';
import Certificates from '../components/sections/Certificates';
import WhatIDo from '../components/sections/WhatIDo';
import Proficiency from '../components/sections/Proficiency';
import { 
  fetchSettings, fetchProfile, fetchProjects, 
  fetchResearchPapers, fetchSkills, fetchExperiences, 
  fetchEducations, fetchSocialLinks, fetchCertificates
} from '../services/api';

const MemoizedHero = React.memo(Hero);
const MemoizedAbout = React.memo(About);
const MemoizedWhatIDo = React.memo(WhatIDo);
const MemoizedSkills = React.memo(Skills);
const MemoizedProficiency = React.memo(Proficiency);
const MemoizedRoadmap = React.memo(Roadmap);
const MemoizedExperience = React.memo(Experience);
const MemoizedProjects = React.memo(Projects);
const MemoizedResearch = React.memo(Research);
const MemoizedEducation = React.memo(Education);
const MemoizedCertificates = React.memo(Certificates);
const MemoizedContact = React.memo(Contact);

const Home = () => {
  // Query site wide settings
  const settingsQuery = useQuery({ queryKey: ['settings'], queryFn: fetchSettings });
  const profileQuery = useQuery({ queryKey: ['profile'], queryFn: fetchProfile });
  const projectsQuery = useQuery({ queryKey: ['projects'], queryFn: fetchProjects });
  const researchQuery = useQuery({ queryKey: ['research'], queryFn: fetchResearchPapers });
  const skillsQuery = useQuery({ queryKey: ['skills'], queryFn: fetchSkills });
  const experiencesQuery = useQuery({ queryKey: ['experiences'], queryFn: fetchExperiences });
  const educationsQuery = useQuery({ queryKey: ['educations'], queryFn: fetchEducations });
  const socialsQuery = useQuery({ queryKey: ['socials'], queryFn: fetchSocialLinks });
  const certificatesQuery = useQuery({ queryKey: ['certificates'], queryFn: fetchCertificates });

  const isLoading = 
    settingsQuery.isLoading || 
    profileQuery.isLoading || 
    projectsQuery.isLoading || 
    researchQuery.isLoading || 
    skillsQuery.isLoading || 
    experiencesQuery.isLoading || 
    educationsQuery.isLoading || 
    socialsQuery.isLoading ||
    certificatesQuery.isLoading;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen py-24 flex flex-col space-y-16 animate-pulse">
          {/* Skeleton Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
              <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
              <div className="flex gap-4">
                <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
              </div>
            </div>
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-64 h-64 sm:w-80 sm:h-80 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
            </div>
          </div>
          
          {/* Skeleton About */}
          <div className="max-w-3xl mx-auto w-full space-y-4 pt-16">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-16">
        <MemoizedHero 
          profile={profileQuery.data} 
          settings={settingsQuery.data} 
          socials={socialsQuery.data} 
        />
        <MemoizedAbout settings={settingsQuery.data} />
        <MemoizedWhatIDo />
        <MemoizedSkills skills={skillsQuery.data} />
        <MemoizedProficiency />
        <MemoizedRoadmap />
        <MemoizedExperience experiences={experiencesQuery.data} />
        <MemoizedProjects projects={projectsQuery.data} />
        <MemoizedResearch papers={researchQuery.data} />
        <MemoizedEducation educations={educationsQuery.data} />
        <MemoizedCertificates certificates={certificatesQuery.data} />
        <MemoizedContact settings={settingsQuery.data} />
      </div>
    </MainLayout>
  );
};

export default Home;
