import React from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '../layout/AdminLayout';
import { 
  fetchProjects, fetchResearchPapers, fetchSkills, 
  fetchMessages, fetchExperiences 
} from '../services/api';
import { 
  FolderGit, BookOpen, Code, Mail, AlertCircle, 
  MessageSquare, Briefcase, ChevronRight 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, AreaChart, Area 
} from 'recharts';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const projects = useQuery({ queryKey: ['admin-projects'], queryFn: fetchProjects });
  const research = useQuery({ queryKey: ['admin-research'], queryFn: fetchResearchPapers });
  const skills = useQuery({ queryKey: ['admin-skills'], queryFn: fetchSkills });
  const messages = useQuery({ queryKey: ['admin-messages'], queryFn: fetchMessages });
  const experiences = useQuery({ queryKey: ['admin-experiences'], queryFn: fetchExperiences });

  const isLoading = 
    projects.isLoading || 
    research.isLoading || 
    skills.isLoading || 
    messages.isLoading || 
    experiences.isLoading;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="w-8 h-8 border-4 border-t-purple-600 border-gray-300 dark:border-gray-800 rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  const projectCount = projects.data?.length || 0;
  const researchCount = research.data?.length || 0;
  const skillCount = skills.data?.length || 0;
  const totalMessages = messages.data?.length || 0;
  const unreadMessages = messages.data?.filter(m => !m.isRead).length || 0;
  const workCount = experiences.data?.length || 0;

  // Chart 1: Projects by Category
  const categoryData = projects.data?.reduce((acc, proj) => {
    const cat = proj.category || 'Other';
    const found = acc.find(item => item.name === cat);
    if (found) {
      found.value += 1;
    } else {
      acc.push({ name: cat, value: 1 });
    }
    return acc;
  }, []) || [];

  // Chart 2: Recent messages timeline (last 7 days helper)
  const messageData = messages.data?.reduce((acc, msg) => {
    const date = new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const found = acc.find(item => item.date === date);
    if (found) {
      found.messages += 1;
    } else {
      acc.unshift({ date, messages: 1 }); // unshift to order chronologically
    }
    return acc;
  }, []).slice(-7) || [];

  const statCards = [
    { name: 'Projects', value: projectCount, icon: FolderGit, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
    { name: 'Research Papers', value: researchCount, icon: BookOpen, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
    { name: 'Skills', value: skillCount, icon: Code, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
    { name: 'Work Experiences', value: workCount, icon: Briefcase, color: 'text-sky-500 bg-sky-500/10 border-sky-500/20' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 text-left">
        
        {/* Top welcome warning */}
        {unreadMessages > 0 && (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-yellow-600 dark:text-yellow-500">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="text-sm">
              You have <span className="font-bold">{unreadMessages} unread messages</span> in your inbox. 
              <Link to="/admin/messages" className="underline ml-1 font-semibold hover:text-yellow-600">View Inbox</Link>
            </div>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0b0f19] flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{stat.name}</p>
                  <p className="text-3xl font-extrabold">{stat.value}</p>
                </div>
                <span className={`p-3 rounded-lg border ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </span>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1: Messages Timeline */}
          <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0b0f19] space-y-4">
            <div>
              <h3 className="font-bold text-md">Inbox Message Volume</h3>
              <p className="text-xs text-gray-500">Form contacts received over time</p>
            </div>
            
            <div className="h-64">
              {messageData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={messageData}>
                    <defs>
                      <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
                    <YAxis stroke="#6b7280" fontSize={11} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: '#0b0f19', border: '1px solid #1f2937', color: '#fff' }} />
                    <Area type="monotone" dataKey="messages" stroke="#7c3aed" fillOpacity={1} fill="url(#colorMsg)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-gray-500">
                  No messaging data available
                </div>
              )}
            </div>
          </div>

          {/* Chart 2: Projects by Category */}
          <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0b0f19] space-y-4">
            <div>
              <h3 className="font-bold text-md">Project Distribution</h3>
              <p className="text-xs text-gray-500">Breakdown of work by taxonomy categories</p>
            </div>

            <div className="h-64">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                    <YAxis stroke="#6b7280" fontSize={11} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: '#0b0f19', border: '1px solid #1f2937', color: '#fff' }} />
                    <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-gray-500">
                  No projects added yet
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Recent Messages list */}
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0b0f19] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-md">Recent Contacts</h3>
              <p className="text-xs text-gray-500">Latest form alerts sent to Gmail</p>
            </div>
            <Link to="/admin/messages" className="text-xs font-semibold text-purple-500 hover:text-purple-600 flex items-center gap-1">
              Inbox <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {messages.data?.slice(0, 3).map((msg) => (
              <div key={msg._id} className="py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate flex items-center gap-2">
                    {msg.name} 
                    {!msg.isRead && (
                      <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" title="Unread" />
                    )}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{msg.subject}</p>
                </div>
                <span className="text-[10px] text-gray-400 shrink-0 font-mono">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}

            {(!messages.data || messages.data.length === 0) && (
              <p className="py-4 text-xs text-gray-500 italic text-center">No messages received yet</p>
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default Dashboard;
