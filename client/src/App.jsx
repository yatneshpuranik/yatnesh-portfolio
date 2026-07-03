import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Contexts
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import Home from './pages/Home';
import PDFView from './pages/PDFView';
import ProjectCaseStudy from './pages/ProjectCaseStudy';
import ResearchPublication from './pages/ResearchPublication';
import AIAssistant from './components/UI/AIAssistant';

// Admin Panel Pages
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import ManageProfile from './admin/ManageProfile';
import ManageProjects from './admin/ManageProjects';
import ManageResearch from './admin/ManageResearch';
import ManageSkills from './admin/ManageSkills';
import ManageExperiences from './admin/ManageExperiences';
import ManageEducations from './admin/ManageEducations';
import ManageResume from './admin/ManageResume';
import ManageSocials from './admin/ManageSocials';
import ManageMessages from './admin/ManageMessages';
import ManageSettings from './admin/ManageSettings';
import ManageCertificates from './admin/ManageCertificates';

// Initialize React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pdf-preview" element={<PDFView />} />
              <Route path="/project/:slug" element={<ProjectCaseStudy />} />
              <Route path="/research/:slug" element={<ResearchPublication />} />

              {/* Admin Access Route */}
              <Route path="/admin/yatnesh/loginreq" element={<Login />} />

              {/* Admin Panel Dashboard Routes */}
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/profile" element={<ManageProfile />} />
              <Route path="/admin/projects" element={<ManageProjects />} />
              <Route path="/admin/research" element={<ManageResearch />} />
              <Route path="/admin/skills" element={<ManageSkills />} />
              <Route path="/admin/experience" element={<ManageExperiences />} />
              <Route path="/admin/education" element={<ManageEducations />} />
              <Route path="/admin/certificates" element={<ManageCertificates />} />
              <Route path="/admin/resume" element={<ManageResume />} />
              <Route path="/admin/socials" element={<ManageSocials />} />
              <Route path="/admin/messages" element={<ManageMessages />} />
              <Route path="/admin/settings" element={<ManageSettings />} />
            </Routes>
            <AIAssistant />
          </Router>
          
          {/* Toast Notification Container */}
          <Toaster 
            position="top-right" 
            toastOptions={{
              className: 'dark:bg-[#0b0f19] dark:text-white border dark:border-gray-800 text-xs font-semibold rounded-lg',
              duration: 3500,
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
