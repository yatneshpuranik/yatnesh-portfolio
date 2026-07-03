const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const Setting = require('./models/Setting');
const Profile = require('./models/Profile');
const Skill = require('./models/Skill');
const Experience = require('./models/Experience');
const Project = require('./models/Project');
const Education = require('./models/Education');
const ResearchPaper = require('./models/ResearchPaper');
const Certificate = require('./models/Certificate');
const Social = require('./models/Social');
const Resume = require('./models/Resume');
const cloudinary = require('./config/cloudinary');

dotenv.config({ path: path.join(__dirname, '.env') });

const seed = async () => {
  try {
    console.log('Connecting to database for premium seeding...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('DB Connected.');

    // Define exact Cloudinary URLs as provided by the user
    const avatarUrl = 'https://res.cloudinary.com/bpv3iunv/image/upload/v1782903562/yatnesh.jpg';
    const resumeUrl = 'https://res.cloudinary.com/bpv3iunv/image/upload/v1782990790/ResumeYatneshMERN_2_sul1q7.pdf';

    console.log('Using Avatar URL:', avatarUrl);
    console.log('Using Resume URL:', resumeUrl);

    // Clear Existing Data (except User)
    await Setting.deleteMany({});
    await Profile.deleteMany({});
    await Skill.deleteMany({});
    await Experience.deleteMany({});
    await Project.deleteMany({});
    await Education.deleteMany({});
    await ResearchPaper.deleteMany({});
    await Certificate.deleteMany({});
    await Social.deleteMany({});
    await Resume.deleteMany({});
    console.log('Cleared previous database entries.');

    // Seed Whitelisted Admin User (if not exists)
    const adminEmail = 'yatneshpuranik@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminUsername = 'yatnesh';

    const userExists = await User.findOne({ email: adminEmail });
    if (!userExists) {
      await User.create({
        username: adminUsername,
        email: adminEmail,
        password: adminPassword,
      });
      console.log('Default Whitelisted Admin user created successfully.');
    } else {
      // Update password to match
      userExists.password = adminPassword;
      await userExists.save();
      console.log('Updated Whitelisted Admin password.');
    }

    // Seed Profile
    const profileText = "I'm Yatnesh Puranik, a Full Stack Developer focused on building scalable MERN applications and AI-powered products. During my internship at Three Syntax, I've contributed to a production-grade Multi-Tenant CRM while also building personal projects like an AI Interview Platform and intelligent web applications. I enjoy turning complex ideas into clean, performant user experiences and continuously improving through real-world engineering challenges.";
    const heroSummary = "Full Stack Developer building scalable MERN applications and AI-powered products. Currently contributing to a Multi-Tenant SaaS CRM at Three Syntax.";

    await Profile.create({
      fullName: 'Yatnesh Puranik',
      title: 'Full Stack Developer (MERN)',
      subTitle: 'Building scalable SaaS products.',
      bio: heroSummary, // Maps to short hero description
      avatarUrl: avatarUrl,
      location: 'India',
    });
    console.log('Profile details seeded.');

    // Seed Settings
    await Setting.create({
      siteName: 'Yatnesh Puranik Portfolio',
      title: 'Yatnesh Puranik | Full Stack Developer (MERN)',
      tagline: 'Building scalable production-grade SaaS applications using MERN, Next.js and TypeScript.',
      aboutMe: profileText, // Maps to detailed biography
      profilePhoto: avatarUrl,
      resumeUrl: resumeUrl,
      contactEmail: 'yatneshpuranik@gmail.com',
      seoTitle: 'Yatnesh Puranik | Portfolio',
      seoDescription: 'Full Stack Developer (MERN) Portfolio & Resume website. Built with React 19, Tailwind CSS v4, Express and MongoDB.',
      seoKeywords: ['Yatnesh Puranik', 'MERN Stack Developer', 'Full Stack Engineer', 'NextJS Developer', 'Indore'],
    });
    console.log('Settings and SEO config seeded.');

    // Seed Active Resume Version
    await Resume.create({
      title: 'Yatnesh Puranik - Resume (MERN)',
      url: resumeUrl,
      isActive: true,
    });
    console.log('Active resume version seeded.');

    // Seed Skills (Frontend, Backend, Tools, Currently Learning)
    const skillsList = [
      // Programming Languages
      { name: 'Java', category: 'Programming Languages', proficiency: 85, icon: 'Code', order: 0 },
      { name: 'JavaScript', category: 'Programming Languages', proficiency: 92, icon: 'Code', order: 1 },
      { name: 'TypeScript', category: 'Programming Languages', proficiency: 88, icon: 'Code', order: 2 },
      { name: 'C++', category: 'Programming Languages', proficiency: 75, icon: 'Code', order: 3 },
      { name: 'SQL', category: 'Programming Languages', proficiency: 82, icon: 'Database', order: 4 },

      // Frontend
      { name: 'React', category: 'Frontend', proficiency: 92, icon: 'Atom', order: 0 },
      { name: 'Next.js', category: 'Frontend', proficiency: 88, icon: 'Layers', order: 1 },
      { name: 'Vite', category: 'Frontend', proficiency: 85, icon: 'Zap', order: 2 },
      { name: 'Tailwind CSS', category: 'Frontend', proficiency: 92, icon: 'Wind', order: 3 },
      { name: 'Redux Toolkit', category: 'Frontend', proficiency: 85, icon: 'Cpu', order: 4 },
      { name: 'HTML5', category: 'Frontend', proficiency: 95, icon: 'FileCode', order: 5 },
      { name: 'CSS3', category: 'Frontend', proficiency: 90, icon: 'Palette', order: 6 },
      { name: 'Responsive Design', category: 'Frontend', proficiency: 92, icon: 'Smartphone', order: 7 },

      // Backend
      { name: 'Node.js', category: 'Backend', proficiency: 88, icon: 'Cpu', order: 0 },
      { name: 'Express.js', category: 'Backend', proficiency: 90, icon: 'Server', order: 1 },
      { name: 'REST APIs', category: 'Backend', proficiency: 92, icon: 'Braces', order: 2 },
      { name: 'JWT Authentication', category: 'Backend', proficiency: 90, icon: 'Key', order: 3 },
      { name: 'Socket.io', category: 'Backend', proficiency: 82, icon: 'Activity', order: 4 },

      // Databases
      { name: 'MongoDB', category: 'Databases', proficiency: 85, icon: 'Database', order: 0 },
      { name: 'Mongoose', category: 'Databases', proficiency: 85, icon: 'Link', order: 1 },
      { name: 'MySQL', category: 'Databases', proficiency: 80, icon: 'Database', order: 2 },

      // CSE Fundamentals
      { name: 'Data Structures', category: 'CSE Fundamentals', proficiency: 85, icon: 'Binary', order: 0 },
      { name: 'Algorithms', category: 'CSE Fundamentals', proficiency: 85, icon: 'GitCommit', order: 1 },
      { name: 'Object Oriented Programming', category: 'CSE Fundamentals', proficiency: 88, icon: 'Box', order: 2 },
      { name: 'Operating Systems', category: 'CSE Fundamentals', proficiency: 75, icon: 'Terminal', order: 3 },
      { name: 'Database Management Systems', category: 'CSE Fundamentals', proficiency: 82, icon: 'Database', order: 4 },
      { name: 'Computer Networks', category: 'CSE Fundamentals', proficiency: 75, icon: 'Network', order: 5 },

      // Tools & Platforms
      { name: 'Git', category: 'Tools & Platforms', proficiency: 88, icon: 'GitFork', order: 0 },
      { name: 'GitHub', category: 'Tools & Platforms', proficiency: 90, icon: 'Github', order: 1 },
      { name: 'Postman', category: 'Tools & Platforms', proficiency: 88, icon: 'Eye', order: 2 },
      { name: 'Cloudinary', category: 'Tools & Platforms', proficiency: 80, icon: 'Image', order: 3 },
      { name: 'VS Code', category: 'Tools & Platforms', proficiency: 92, icon: 'Code', order: 4 },
      { name: 'Figma', category: 'Tools & Platforms', proficiency: 78, icon: 'Figma', order: 5 },
      { name: 'npm', category: 'Tools & Platforms', proficiency: 85, icon: 'FolderArchive', order: 6 },
      { name: 'Vercel', category: 'Tools & Platforms', proficiency: 85, icon: 'Globe', order: 7 },
      { name: 'Render', category: 'Tools & Platforms', proficiency: 80, icon: 'Server', order: 8 },

      // Current Learning
      { name: 'Docker', category: 'Currently Learning', proficiency: 70, icon: 'Box', order: 0 },
      { name: 'CI/CD', category: 'Currently Learning', proficiency: 65, icon: 'Workflow', order: 1 },
      { name: 'AWS', category: 'Currently Learning', proficiency: 60, icon: 'Cloud', order: 2 },
      { name: 'System Design', category: 'Currently Learning', proficiency: 72, icon: 'LayoutGrid', order: 3 },
      { name: 'Microservices', category: 'Currently Learning', proficiency: 65, icon: 'Network', order: 4 },
      { name: 'Redis', category: 'Currently Learning', proficiency: 68, icon: 'Zap', order: 5 },
      { name: 'Kafka', category: 'Currently Learning', proficiency: 55, icon: 'Sliders', order: 6 },
      { name: 'Kubernetes', category: 'Currently Learning', proficiency: 50, icon: 'Compass', order: 7 },
    ];
    await Skill.insertMany(skillsList);
    console.log('Seeded technical skills list.');

    // Seed Experience
    const expDescription = `<ul class="list-disc pl-4 space-y-1.5 text-xs font-semibold text-[#94A3B8]">
      <li>Developed production-grade frontend modules for Multi-Tenant CRM.</li>
      <li>Integrated backend APIs and authentication workflows.</li>
      <li>Built reusable UI components improving development speed.</li>
      <li>Collaborated with Agile team for feature planning and reviews.</li>
      <li>Worked with React, Next.js, NestJS, PostgreSQL and Turborepo.</li>
    </ul>`;

    await Experience.create({
      company: 'Three Syntax',
      role: 'Full Stack Developer Intern',
      location: 'Remote',
      type: 'Remote',
      startDate: new Date('2026-06-01'),
      currentlyWorking: true,
      description: expDescription,
      technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'Prisma', 'TurboRepo', 'Tailwind CSS'],
      order: 0,
    });
    console.log('Seeded internship record.');

    // Seed Projects with case-study details
    const projectsList = [
      {
        title: 'Multi-Tenant Sales CRM',
        slug: 'multi-tenant-sales-crm',
        summary: 'Production-grade SaaS CRM supporting multi-tenancy, authentication, role-based access control, sales pipelines, reusable dashboard modules and scalable architecture.',
        description: `This multi-tenant CRM is engineered for high performance, utilizing NestJS and Prisma to guarantee complete tenant isolation while delivering real-world sales metrics.`,
        bannerImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        images: [],
        githubLink: 'https://github.com/yatneshpuranik',
        liveLink: '',
        technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'Prisma', 'TurboRepo'],
        isFeatured: true,
        category: 'Development',
        order: 0,
        // Case Study
        problem: 'Modern sales teams require modular pipelines and client management tools, but existing solutions often lack secure data isolation, cost-efficient scaling, and department-level modularity within a single deployment.',
        solution: 'We designed a multi-tenant CRM featuring strict database-level isolation, granular Role-Based Access Control (RBAC), customizable sales pipelines, and departmental organization workspaces.',
        featuresList: `- **Tenant isolation**: Strong partitioning policies in PostgreSQL.
- **JWT Authentication & RBAC**: Granular permission models for admins, managers, and agents.
- **Department management**: Isolate workflows across different corporate divisions.
- **Invitation workflows**: Secure member invitations using hash verification signatures.`,
        architecture: `The system utilizes a modern monorepo layout:
- **Monorepo Structure**: Managed via **Turborepo** for optimized caching and fast dependency sharing.
- **Frontend**: Built with **Next.js** for SSR dashboard elements and fast data loading.
- **Backend API**: Engineered with **NestJS** utilizing modular controllers and dependency injection.
- **Database Layer**: **PostgreSQL** paired with **Prisma ORM** for type-safe queries.
- **Caching**: **Redis** cache store for active user sessions and auth validation tokens.`,
        challenges: 'Structuring department-level invitation flows and secure database isolation without exposing boundaries or causing performance degradation.',
        learned: 'Implementing PostgreSQL row-level isolation policies with Prisma and orchestrating clean pipeline workflows inside Turborepo monorepos.',
        timeline: 'June 2026 - Present',
      },
      {
        title: 'WorkSync',
        slug: 'worksync',
        summary: 'A collaborative workspace platform inspired by Trello, GitHub and Discord.',
        description: `WorkSync provides real-time workspace sync across project tasks, active member feeds, and channel chats.`,
        bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        images: [],
        githubLink: 'https://github.com/yatneshpuranik',
        liveLink: '',
        technologies: ['MERN', 'Socket.io', 'TypeScript'],
        isFeatured: true,
        category: 'Development',
        order: 1,
        // Case Study
        problem: 'Teams frequently split their focus across separate platforms (Trello for tasks, Discord for chat, GitHub for code). Switching contexts reduces output.',
        solution: 'WorkSync unifies task management, live messaging, and VCS status feeds in a single web dashboard.',
        featuresList: `- **Kanban Board**: Drag-and-drop tasks, custom status flows, and assignee assignments.
- **Real-time Workspace Chat**: Live team channels built with WebSockets.
- **GitHub Integration**: Listen to repo webhooks to show commit status in the activity feed.
- **Role Management**: Workspace creator can manage member invites and roles.
- **Notifications**: Instant updates on task assignments and activity.`,
        architecture: `- **Frontend**: Single Page React App leveraging **TypeScript** and tailwind CSS.
- **Backend Server**: **Express.js** and **Node.js** running WebSocket protocols.
- **Real-time Layer**: Synchronized via **Socket.io** connections for immediate cross-client DOM updates.
- **Database**: **MongoDB** storing chat logs, user profiles, and active workspace boards.`,
        challenges: 'Maintaining consistent socket connection states across rapid route changes and synchronizing task positioning drag-and-drop state dynamically.',
        learned: 'Optimizing WebSocket events to reduce network overhead and implementing React Query cache updates on live events.',
        timeline: 'March 2026 - May 2026',
      },
      {
        title: 'AI Mock Interview Platform',
        slug: 'ai-mock-interview',
        summary: 'AI-powered interview preparation platform with resume analysis, AI-generated interview questions, voice interaction, interview history and personalized reports.',
        description: `AI Mock Interview uses artificial intelligence models to parse developer resumes and conduct interactive mock interviews, rendering final diagnostic reviews.`,
        bannerImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        images: [],
        githubLink: 'https://github.com/yatneshpuranik',
        liveLink: '',
        technologies: ['MERN', 'Speech APIs', 'OpenRouter AI'],
        isFeatured: true,
        category: 'Development',
        order: 2,
        // Case Study
        problem: 'Mock interviews are hard to schedule, expensive, and rarely provide objective, granular reviews on communication vs. content correctness.',
        solution: 'An automated AI interviewer that listens, transcribes speech, reviews replies, and grades using generative AI algorithms.',
        featuresList: `- **Resume Parsing**: Direct upload and text extraction.
- **AI Question Generation**: Context-aware questions generated via OpenRouter AI.
- **Voice Interview**: Speech-to-Text (STT) and Text-to-Speech (TTS) mock dialogues.
- **Interview Report**: Detailed analytics on grammar, speed, and answer correctness.
- **History Logs**: Review past sessions to analyze improvements.`,
        architecture: `- **Frontend**: **React** incorporating browser-native Web Speech recognition API.
- **Backend API**: **Express.js** handling resume text processing.
- **AI Interface**: Communicates with **OpenRouter AI (GPT/Claude API)** to evaluate answers.
- **Database**: **MongoDB** storing transcript records and performance scores.`,
        challenges: 'Processing live browser speech recognition streams and matching text results to AI prompt templates under low latency.',
        learned: 'Tuning prompt instructions to minimize latency and designing responsive voice visualizers using Framer Motion.',
        timeline: 'Jan 2026 - Feb 2026',
      },
    ];
    await Project.insertMany(projectsList);
    console.log('Seeded projects case studies.');

    // Seed Education
    const educationsList = [
      {
        institution: 'Indore Institute of Science and Technology',
        degree: 'B.Tech',
        fieldOfStudy: 'Computer Science Engineering',
        startDate: new Date('2023-07-01'),
        endDate: new Date('2027-06-30'),
        grade: '7.95 CGPA',
        description: '',
        order: 0,
      },
      {
        institution: 'CBSE School',
        degree: 'Higher Secondary',
        fieldOfStudy: 'Science',
        startDate: new Date('2021-07-01'),
        endDate: new Date('2023-06-30'),
        grade: '77.8%',
        description: '',
        order: 1,
      },
      {
        institution: 'CBSE School',
        degree: 'Secondary',
        fieldOfStudy: 'General',
        startDate: new Date('2020-07-01'),
        endDate: new Date('2021-06-30'),
        grade: '86.4%',
        description: '',
        order: 2,
      },
    ];
    await Education.insertMany(educationsList);
    console.log('Seeded education.');

    // Seed Research Papers with details
    const costGuardUrl = 'https://res.cloudinary.com/bpv3iunv/image/upload/v1782903818/CostGaurdAi_2_cigdng.pdf';
    const hydroBloomUrl = 'https://res.cloudinary.com/bpv3iunv/image/upload/v1782903817/researchpaper2.pdf';

    const papersList = [
      {
        title: 'CostGuard AI: Dynamic Cloud Resource Optimization using Machine Learning',
        slug: 'costguard-ai',
        authors: ['Yatnesh Puranik'],
        journal: 'Research Paper',
        year: 2025,
        abstract: 'CostGuard AI introduces an intelligent framework for monitoring, predicting, and optimizing cloud infrastructure costs. By analyzing historical utilization patterns and billing metrics, the system dynamically adjusts resource allocations to maximize efficiency and minimize idle costs without compromising application performance.',
        pdfUrl: costGuardUrl,
        externalLink: '',
        // Extended Details
        problemStatement: 'Organizations struggle with cloud over-provisioning and unpredictable scaling costs, leading to significant budget waste on idle compute resources.',
        methodology: 'We developed time-series forecasting models (LSTM and Prophet) to predict resource demand patterns and auto-adjust server capacities in real-time.',
        architecture: 'Microservice architecture collecting Prometheus metrics, analyzed via a Python machine learning engine, and orchestrated using Kubernetes scaling APIs.',
        results: 'CostGuard AI achieved a 28% average reduction in monthly cloud infrastructure spend across simulated multi-tenant workloads.',
        conclusion: 'Applying predictive ML models to cloud capacity management provides proactive cost protection and maintains application SLAs.',
        citation: 'Puranik, Y. (2025). CostGuard AI: Dynamic Cloud Resource Optimization using Machine Learning. Research Archive.',
        presentedAt: 'Research Paper',
      },
      {
        title: 'HydroBloom: Automated Hydroponic Systems',
        slug: 'hydrobloom',
        authors: ['Yatnesh Puranik'],
        journal: 'Research Paper',
        year: 2025,
        abstract: 'HydroBloom details algorithmic automation for water quality inspection and nutrient dosage cycles in indoor agricultural environments. It uses statistical models to secure crop health and maximize yield rates.',
        pdfUrl: hydroBloomUrl,
        externalLink: '',
        // Extended Details
        problemStatement: 'Urban indoor gardens and vertical farms often fail due to improper nutrient balance, lack of soil moisture monitoring, and inconsistent irrigation, which require manual labor and specialized knowledge.',
        methodology: 'Designed an automated hydroponics sensory loop using microcontrollers that continuously checks pH values, electrical conductivity, and temperature, trigger-releasing precise water volumes.',
        architecture: 'Sensory node microcontroller cluster sending telemetry over MQTT to a Node.js dashboard, coupled with automated relay pumps.',
        results: 'Achieved a 30% reduction in water waste and completed automated harvesting cycles with 100% plant survival rate.',
        conclusion: 'IoT-driven closed-loop sensory irrigation lowers operating costs and secures high growth rates for urban agricultural installations.',
        citation: 'Puranik, Y. (2025). HydroBloom: Closed-Loop Automated Hydroponic Systems. Research Archive.',
        presentedAt: 'Research Paper',
      },
    ];
    await ResearchPaper.insertMany(papersList);
    console.log('Seeded research papers.');

    // Seed Certificates
    const certificatesList = [
      { title: 'IgniteX Research Paper Participation', issuer: 'IgniteX', order: 0 },
      { title: 'ICAT Participation', issuer: 'ICAT', order: 1 },
    ];
    await Certificate.insertMany(certificatesList);
    console.log('Seeded certificates.');

    // Seed Social Links
    const socialsList = [
      { name: 'GitHub', url: 'https://github.com/yatneshpuranik', icon: 'Github', order: 0 },
      { name: 'LinkedIn', url: 'https://linkedin.com/in/yatneshpuranik', icon: 'Linkedin', order: 1 },
      { name: 'Email', url: 'mailto:yatneshpuranik@gmail.com', icon: 'Mail', order: 2 },
    ];
    await Social.insertMany(socialsList);
    console.log('Seeded social links.');

    console.log('Premium seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seed();
