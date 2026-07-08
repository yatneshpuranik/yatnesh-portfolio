const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

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

dotenv.config({ path: path.join(__dirname, '.env') });

const backupsDir = path.join(__dirname, 'backups');

let insertedCount = 0;
let updatedCount = 0;
let skippedCount = 0;

// Helper to generate a pre-seed backup
const createBackup = async () => {
  try {
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupsDir, `portfolio-${timestamp}.json`);
    
    console.log('Generating pre-seed database backup...');
    const backupData = {
      users: await User.find({}),
      settings: await Setting.find({}),
      profiles: await Profile.find({}),
      skills: await Skill.find({}),
      experiences: await Experience.find({}),
      projects: await Project.find({}),
      educations: await Education.find({}),
      researchPapers: await ResearchPaper.find({}),
      certificates: await Certificate.find({}),
      socials: await Social.find({}),
      resumes: await Resume.find({}),
    };
    
    await fsPromises.writeFile(backupFile, JSON.stringify(backupData, null, 2), 'utf-8');
    console.log(`Backup successfully created at: ${backupFile}`);
    return backupFile;
  } catch (err) {
    console.error('Failed to create backup:', err);
    throw err;
  }
};

// Helper to restore from a backup in case of seed script errors
const rollbackFromBackup = async (backupFile) => {
  try {
    console.log(`Starting automated rollback from backup file: ${backupFile}`);
    const rawData = await fsPromises.readFile(backupFile, 'utf-8');
    const backupData = JSON.parse(rawData);

    // Clear collections first
    await User.deleteMany({});
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

    // Restore data
    if (backupData.users && backupData.users.length) await User.insertMany(backupData.users);
    if (backupData.settings && backupData.settings.length) await Setting.insertMany(backupData.settings);
    if (backupData.profiles && backupData.profiles.length) await Profile.insertMany(backupData.profiles);
    if (backupData.skills && backupData.skills.length) await Skill.insertMany(backupData.skills);
    if (backupData.experiences && backupData.experiences.length) await Experience.insertMany(backupData.experiences);
    if (backupData.projects && backupData.projects.length) await Project.insertMany(backupData.projects);
    if (backupData.educations && backupData.educations.length) await Education.insertMany(backupData.educations);
    if (backupData.researchPapers && backupData.researchPapers.length) await ResearchPaper.insertMany(backupData.researchPapers);
    if (backupData.certificates && backupData.certificates.length) await Certificate.insertMany(backupData.certificates);
    if (backupData.socials && backupData.socials.length) await Social.insertMany(backupData.socials);
    if (backupData.resumes && backupData.resumes.length) await Resume.insertMany(backupData.resumes);

    console.log('Database state successfully restored from backup.');
  } catch (err) {
    console.error('CRITICAL: Rollback failed! Database might be in an inconsistent state:', err);
  }
};

// General helper for upserting records safely with schema validation
const upsertRecord = async (Model, query, data) => {
  // Validate schema before writing
  const instance = new Model(data);
  await instance.validate();

  // Find existing record
  const existing = await Model.findOne(query);
  if (existing) {
    // Compare properties to see if it needs update
    let needsUpdate = false;
    for (const key in data) {
      if (key === '_id' || key === 'id' || key === 'createdAt' || key === 'updatedAt' || key === '__v') continue;
      
      const existingVal = existing[key];
      const newVal = data[key];

      if (existingVal instanceof Date && newVal instanceof Date) {
        if (existingVal.getTime() !== newVal.getTime()) {
          needsUpdate = true;
          break;
        }
      } else if (Array.isArray(existingVal) && Array.isArray(newVal)) {
        if (JSON.stringify(existingVal) !== JSON.stringify(newVal)) {
          needsUpdate = true;
          break;
        }
      } else if (typeof existingVal === 'object' && existingVal !== null && typeof newVal === 'object' && newVal !== null) {
        if (JSON.stringify(existingVal) !== JSON.stringify(newVal)) {
          needsUpdate = true;
          break;
        }
      } else {
        if (existingVal !== newVal) {
          needsUpdate = true;
          break;
        }
      }
    }

    if (needsUpdate) {
      Object.assign(existing, data);
      await existing.save();
      console.log(`[UPDATE] ${Model.modelName}: Updated record matching ${JSON.stringify(query)}`);
      updatedCount++;
    } else {
      console.log(`[SKIP] ${Model.modelName}: Identical record already exists for ${JSON.stringify(query)}`);
      skippedCount++;
    }
  } else {
    await Model.create(data);
    console.log(`[INSERT] ${Model.modelName}: Inserted new record matching ${JSON.stringify(query)}`);
    insertedCount++;
  }
};

// Specialized helper for upserting admin user
const upsertUser = async (adminUsername, adminEmail, adminPassword) => {
  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    const isPasswordMatch = await existing.matchPassword(adminPassword);
    const isUsernameMatch = existing.username === adminUsername;

    if (!isPasswordMatch || !isUsernameMatch) {
      existing.username = adminUsername;
      existing.password = adminPassword; // Pre-save hook hashes this
      await existing.save();
      console.log(`[UPDATE] User: Updated password/username for ${adminEmail}`);
      updatedCount++;
    } else {
      console.log(`[SKIP] User: Admin user ${adminEmail} is up-to-date`);
      skippedCount++;
    }
  } else {
    const newUser = new User({
      username: adminUsername,
      email: adminEmail,
      password: adminPassword,
    });
    await newUser.validate();
    await newUser.save();
    console.log(`[INSERT] User: Created admin user ${adminEmail}`);
    insertedCount++;
  }
};

const seed = async () => {
  let backupFile = null;
  try {
    console.log('Connecting to database for premium seeding...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('DB Connected.');

    // Create Backup first
    backupFile = await createBackup();

    // Define exact Cloudinary URLs as provided by the user
    const avatarUrl = 'https://res.cloudinary.com/bpv3iunv/image/upload/v1783104592/yatnesh-Photoroom_mwiudd.png';
    const profilePhoto = 'https://res.cloudinary.com/bpv3iunv/image/upload/v1782903562/yatnesh.jpg';
    const resumeUrl = 'https://res.cloudinary.com/bpv3iunv/image/upload/v1782990790/ResumeYatneshMERN_2_sul1q7.pdf';

    console.log('Using Avatar URL (Navbar):', avatarUrl);
    console.log('Using Profile Photo URL (Hero):', profilePhoto);
    console.log('Using Resume URL:', resumeUrl);

    // Reset counters
    insertedCount = 0;
    updatedCount = 0;
    skippedCount = 0;

    // Seed/Upsert Whitelisted Admin User
    const adminEmail = 'yatneshpuranik@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminUsername = 'yatnesh';
    await upsertUser(adminUsername, adminEmail, adminPassword);

    // Seed/Upsert Profile
    const profileText = "I'm Yatnesh Puranik, a Full Stack Developer focused on building scalable MERN applications and AI-powered products. During my internship at Three Syntax, I've contributed to a production-grade Multi-Tenant CRM while also building personal projects like an AI Interview Platform and intelligent web applications. I enjoy turning complex ideas into clean, performant user experiences and continuously improving through real-world engineering challenges.";
    const heroSummary = "Full Stack Developer building scalable MERN applications and AI-powered products. Currently contributing to a Multi-Tenant SaaS CRM at Three Syntax.";

    await upsertRecord(Profile, { fullName: 'Yatnesh Puranik' }, {
      fullName: 'Yatnesh Puranik',
      title: 'Full Stack Developer (MERN)',
      subTitle: 'Building scalable SaaS products.',
      bio: heroSummary,
      avatarUrl: avatarUrl,
      location: 'India',
    });

    // Seed/Upsert Settings
    await upsertRecord(Setting, { siteName: 'Yatnesh Puranik Portfolio' }, {
      siteName: 'Yatnesh Puranik Portfolio',
      title: 'Yatnesh Puranik | Full Stack Developer (MERN)',
      tagline: 'Building scalable production-grade SaaS applications using MERN, Next.js and TypeScript.',
      aboutMe: profileText,
      profilePhoto: profilePhoto,
      resumeUrl: resumeUrl,
      contactEmail: 'yatneshpuranik@gmail.com',
      seoTitle: 'Yatnesh Puranik | Portfolio',
      seoDescription: 'Full Stack Developer (MERN) Portfolio & Resume website. Built with React 19, Tailwind CSS v4, Express and MongoDB.',
      seoKeywords: ['Yatnesh Puranik', 'MERN Stack Developer', 'Full Stack Engineer', 'NextJS Developer', 'Indore'],
    });

    // Seed/Upsert Active Resume Version
    await upsertRecord(Resume, { title: 'Yatnesh Puranik - Resume (MERN)' }, {
      title: 'Yatnesh Puranik - Resume (MERN)',
      url: resumeUrl,
      isActive: true,
    });

    // Seed/Upsert Skills
    const skillsList = [
      { name: 'Java', category: 'Programming Languages', proficiency: 85, icon: 'Code', order: 0 },
      { name: 'JavaScript', category: 'Programming Languages', proficiency: 92, icon: 'Code', order: 1 },
      { name: 'TypeScript', category: 'Programming Languages', proficiency: 88, icon: 'Code', order: 2 },
      { name: 'C++', category: 'Programming Languages', proficiency: 75, icon: 'Code', order: 3 },
      { name: 'SQL', category: 'Programming Languages', proficiency: 82, icon: 'Database', order: 4 },

      { name: 'React', category: 'Frontend', proficiency: 92, icon: 'Atom', order: 0 },
      { name: 'Next.js', category: 'Frontend', proficiency: 88, icon: 'Layers', order: 1 },
      { name: 'Vite', category: 'Frontend', proficiency: 85, icon: 'Zap', order: 2 },
      { name: 'Tailwind CSS', category: 'Frontend', proficiency: 92, icon: 'Wind', order: 3 },
      { name: 'Redux Toolkit', category: 'Frontend', proficiency: 85, icon: 'Cpu', order: 4 },
      { name: 'HTML5', category: 'Frontend', proficiency: 95, icon: 'FileCode', order: 5 },
      { name: 'CSS3', category: 'Frontend', proficiency: 90, icon: 'Palette', order: 6 },
      { name: 'Responsive Design', category: 'Frontend', proficiency: 92, icon: 'Smartphone', order: 7 },

      { name: 'Node.js', category: 'Backend', proficiency: 88, icon: 'Cpu', order: 0 },
      { name: 'Express.js', category: 'Backend', proficiency: 90, icon: 'Server', order: 1 },
      { name: 'REST APIs', category: 'Backend', proficiency: 92, icon: 'Braces', order: 2 },
      { name: 'JWT Authentication', category: 'Backend', proficiency: 90, icon: 'Key', order: 3 },
      { name: 'Socket.io', category: 'Backend', proficiency: 82, icon: 'Activity', order: 4 },

      { name: 'MongoDB', category: 'Databases', proficiency: 85, icon: 'Database', order: 0 },
      { name: 'Mongoose', category: 'Databases', proficiency: 85, icon: 'Link', order: 1 },
      { name: 'MySQL', category: 'Databases', proficiency: 80, icon: 'Database', order: 2 },

      { name: 'Data Structures', category: 'CSE Fundamentals', proficiency: 85, icon: 'Binary', order: 0 },
      { name: 'Algorithms', category: 'CSE Fundamentals', proficiency: 85, icon: 'GitCommit', order: 1 },
      { name: 'Object Oriented Programming', category: 'CSE Fundamentals', proficiency: 88, icon: 'Box', order: 2 },
      { name: 'Operating Systems', category: 'CSE Fundamentals', proficiency: 75, icon: 'Terminal', order: 3 },
      { name: 'Database Management Systems', category: 'CSE Fundamentals', proficiency: 82, icon: 'Database', order: 4 },
      { name: 'Computer Networks', category: 'CSE Fundamentals', proficiency: 75, icon: 'Network', order: 5 },

      { name: 'Git', category: 'Tools & Platforms', proficiency: 88, icon: 'GitFork', order: 0 },
      { name: 'GitHub', category: 'Tools & Platforms', proficiency: 90, icon: 'Github', order: 1 },
      { name: 'Postman', category: 'Tools & Platforms', proficiency: 88, icon: 'Eye', order: 2 },
      { name: 'Cloudinary', category: 'Tools & Platforms', proficiency: 80, icon: 'Image', order: 3 },
      { name: 'VS Code', category: 'Tools & Platforms', proficiency: 92, icon: 'Code', order: 4 },
      { name: 'Figma', category: 'Tools & Platforms', proficiency: 78, icon: 'Figma', order: 5 },
      { name: 'npm', category: 'Tools & Platforms', proficiency: 85, icon: 'FolderArchive', order: 6 },
      { name: 'Vercel', category: 'Tools & Platforms', proficiency: 85, icon: 'Globe', order: 7 },
      { name: 'Render', category: 'Tools & Platforms', proficiency: 80, icon: 'Server', order: 8 },

      { name: 'Docker', category: 'Currently Learning', proficiency: 70, icon: 'Box', order: 0 },
      { name: 'CI/CD', category: 'Currently Learning', proficiency: 65, icon: 'Workflow', order: 1 },
      { name: 'AWS', category: 'Currently Learning', proficiency: 60, icon: 'Cloud', order: 2 },
      { name: 'System Design', category: 'Currently Learning', proficiency: 72, icon: 'LayoutGrid', order: 3 },
      { name: 'Microservices', category: 'Currently Learning', proficiency: 65, icon: 'Network', order: 4 },
      { name: 'Redis', category: 'Currently Learning', proficiency: 68, icon: 'Zap', order: 5 },
      { name: 'Kafka', category: 'Currently Learning', proficiency: 55, icon: 'Sliders', order: 6 },
      { name: 'Kubernetes', category: 'Currently Learning', proficiency: 50, icon: 'Compass', order: 7 },
    ];

    for (const skill of skillsList) {
      await upsertRecord(Skill, { name: skill.name }, skill);
    }

    // Seed/Upsert Experience
    const expDescription = `<ul class="list-disc pl-4 space-y-1.5 text-xs font-semibold text-[#94A3B8]">
      <li>Developed production-grade frontend modules for Multi-Tenant CRM.</li>
      <li>Integrated backend APIs and authentication workflows.</li>
      <li>Built reusable UI components improving development speed.</li>
      <li>Collaborated with Agile team for feature planning and reviews.</li>
      <li>Worked with React, Next.js, NestJS, PostgreSQL and Turborepo.</li>
    </ul>`;

    await upsertRecord(Experience, { company: 'Three Syntax', role: 'Full Stack Developer Intern' }, {
      company: 'Three Syntax',
      role: 'Full Stack Developer Intern',
      location: 'Remote',
      type: 'Remote',
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-07-31'),
      currentlyWorking: false,
      description: expDescription,
      technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'Prisma', 'TurboRepo', 'Tailwind CSS'],
      order: 0,
    });

    // Seed/Upsert Projects
    const projectsList = [
      {
        title: 'SaleCX (Multi-Tenant CRM)',
        slug: 'multi-tenant-sales-crm',
        summary: 'A production-ready SaaS CRM platform built with Turborepo, NestJS, Next.js, PostgreSQL, and Prisma.',
        description: 'SaleCX is a self-initiated SaaS CRM project engineered to validate production-level multi-tenancy and high scalability.',
        bannerImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        images: [],
        githubLink: 'https://github.com/yatneshpuranik',
        liveLink: '',
        technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'Prisma', 'TurboRepo'],
        isFeatured: true,
        category: 'Development',
        order: 0,
        problem: 'Modern sales teams require modular pipelines and client management tools, but existing solutions often lack secure data isolation, cost-efficient scaling, and department-level modularity within a single deployment.',
        solution: 'Designed a multi-tenant client portal that features database-level row isolation and department-level workspace sharing inside a Monorepo.',
        featuresList: 'Tenant isolation, JWT Authentication & RBAC, Department management, Invitation workflows.',
        architecture: 'NestJS API controllers connected to PostgreSQL database tables using custom Prisma middleware interceptors to enforce tenant isolation.',
        challenges: 'Structuring department-level invitation flows and secure database isolation without exposing boundaries or causing performance degradation.',
        learned: 'Implementing PostgreSQL row-level isolation policies with Prisma and orchestrating clean pipeline workflows inside Turborepo monorepos.',
        timeline: 'June 2026 - July 2026',
      },
      {
        title: 'WorkSync',
        slug: 'worksync',
        summary: 'A collaborative workspace platform inspired by Trello, GitHub and Discord.',
        description: 'WorkSync provides real-time workspace sync across project tasks, active member feeds, and channel chats.',
        bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        images: [],
        githubLink: 'https://github.com/yatneshpuranik',
        liveLink: '',
        technologies: ['MERN', 'Socket.io', 'TypeScript'],
        isFeatured: true,
        category: 'Development',
        order: 1,
        problem: 'Teams frequently split their focus across separate platforms (Trello for tasks, Discord for chat, GitHub for code). Switching contexts reduces output.',
        solution: 'WorkSync unifies task management, live messaging, and VCS status feeds in a single web dashboard.',
        featuresList: 'Kanban Board, Real-time Workspace Chat, GitHub Integration, Role Management, Notifications.',
        architecture: 'Express.js and Node.js backend server handling WebSocket event streams, sync\'d to React via Socket.io.',
        challenges: 'Maintaining consistent socket connection states across rapid route changes and synchronizing task positioning drag-and-drop state dynamically.',
        learned: 'Optimizing WebSocket events to reduce network overhead and implementing React Query cache updates on live events.',
        timeline: 'March 2026 - May 2026',
      },
      {
        title: 'InterviewBud (AI Mock Interview Platform)',
        slug: 'ai-mock-interview',
        summary: 'An interactive AI-powered preparation platform featuring resume parsing, dynamic voice recognition dialogs, and comprehensive reviews.',
        description: 'InterviewBud acts as a mock interviewer, conducting vocal interview sessions using automated speech transcribers and generative AI grading.',
        bannerImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        images: [],
        githubLink: 'https://github.com/yatneshpuranik',
        liveLink: '',
        technologies: ['MERN', 'Speech APIs', 'OpenRouter AI'],
        isFeatured: true,
        category: 'Development',
        order: 2,
        problem: 'Mock interviews are hard to schedule, expensive, and rarely provide objective, granular reviews on communication vs. content correctness.',
        solution: 'An automated AI interviewer that listens, transcribes speech, reviews replies, and grades using generative AI algorithms.',
        featuresList: 'Resume Parsing, AI Question Generation, Voice Interview, Interview Report, History Logs.',
        architecture: 'React frontend incorporating Web Speech Recognition APIs to transcribe replies, communicating with OpenRouter AI (GPT/Claude API) for review.',
        challenges: 'Processing live browser speech recognition streams and matching text results to AI prompt templates under low latency.',
        learned: 'Tuning prompt instructions to minimize latency and designing responsive voice visualizers using Framer Motion.',
        timeline: 'Jan 2026 - Feb 2026',
      },
      {
        title: 'HydroBloom (Smart Rainwater Harvesting System)',
        slug: 'hydrobloom-project',
        summary: 'A collaborative AI/ML rainwater harvesting platform determining optimal harvest designs based on image analysis and rainfall forecasting.',
        description: 'HydroBloom is a smart collaborative platform featuring roof area detection models, rain statistics, water demand analytics, and cost optimizations.',
        bannerImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
        images: [],
        githubLink: 'https://github.com/yatneshpuranik',
        liveLink: '',
        technologies: ['React.js', 'Django', 'Python', 'ML', 'APIs'],
        isFeatured: true,
        category: 'Development',
        order: 3,
        problem: 'Urban communities lack analytical tools to calculate potential roof water capture, forecast weather storage capacity, and optimize build costs.',
        solution: 'Built a responsive React interface (my responsibility) connecting to Python Django ML backends mapping weather trends and area calculations.',
        featuresList: 'Rooftop area detection, Cost optimization calculator, Rainfall weather API sync, Volume estimations.',
        architecture: 'React dashboard querying Django microservices executing computer-vision area models and prediction estimators.',
        challenges: 'Integrating and orchestrating asynchronous Django API fetches for massive image parsing models without rendering lags.',
        learned: 'Designed with reusable layout wrappers, responsive chart canvas pools, and clean asynchronous API boundary handling.',
        timeline: 'October 2025 - December 2025',
      },
      {
        title: 'PriceBuddy (ML Price Prediction)',
        slug: 'pricebuddy',
        summary: 'An ML-powered prototype tracking product prices across platforms and forecasting future movements using TensorFlow.js.',
        description: 'PriceBuddy tracks e-commerce item prices, preprocesses historical trends, and executes machine learning regressions locally in the client browser.',
        bannerImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
        images: [],
        githubLink: 'https://github.com/yatneshpuranik',
        liveLink: '',
        technologies: ['MERN', 'TensorFlow.js', 'JavaScript'],
        isFeatured: true,
        category: 'Development',
        order: 4,
        problem: 'E-commerce prices fluctuate rapidly, making it difficult for buyers to identify the optimal discount window.',
        solution: 'MERN stack coupled with TensorFlow.js to execute local time-series regression algorithms directly on the client browser.',
        featuresList: 'Historical price tracking, Machine Learning price prediction, TensorFlow.js integration, Trend visualization.',
        architecture: 'React frontend using client-side TensorFlow.js to train linear/polynomial regressions, with Express/MongoDB logging daily scraped prices.',
        challenges: 'Optimizing client-side regression model training times without blocking the main React UI execution thread.',
        learned: 'Optimizing client-side regression model training times without blocking the main React UI execution thread.',
        timeline: 'September 2025 - November 2025',
      },
      {
        title: 'Blood Seva (Java Full Stack Project)',
        slug: 'blood-seva',
        summary: 'A Java full-stack management system connecting blood donors and recipients securely.',
        description: 'Blood Seva is a servlet-based portal facilitating blood donor registration, availability tracking, and request approvals.',
        bannerImage: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80',
        images: [],
        githubLink: 'https://github.com/yatneshpuranik',
        liveLink: '',
        technologies: ['Java', 'JSP', 'Servlets', 'MySQL'],
        isFeatured: true,
        category: 'Development',
        order: 5,
        problem: 'Connects blood donors and recipients in real-time, resolving critical delays in sourcing emergency blood units.',
        solution: 'Multi-tier architecture using Java Servlets for session routing and JSP template rendering, coupled with raw JDBC driver connections to MySQL tables.',
        featuresList: 'Donor & recipient registration, Blood inventory management, Blood request workflow, Admin dashboard, MySQL database integration.',
        architecture: 'Java Web App running on Apache Tomcat, using JSP templates, Servlets controllers, and JDBC connection pools for MySQL queries.',
        challenges: 'Enforcing secure session state management and preventing concurrent transaction conflicts during emergency request bookings.',
        learned: 'Built with parameter sanitization to prevent SQL injections and thread-safe session concurrency handlers.',
        timeline: 'July 2025 - August 2025',
      },
    ];

    for (const project of projectsList) {
      await upsertRecord(Project, { slug: project.slug }, project);
    }

    // Seed/Upsert Education
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

    for (const edu of educationsList) {
      await upsertRecord(Education, { institution: edu.institution, degree: edu.degree }, edu);
    }

    // Seed/Upsert Research Papers
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
        problemStatement: 'Organizations struggle with cloud over-provisioning and unpredictable scaling costs, leading to significant budget waste on idle compute resources.',
        methodology: 'We developed time-series forecasting models (LSTM and Prophet) to predict resource demand patterns and auto-adjust server capacities in real-time.',
        architecture: 'Microservice architecture collecting Prometheus metrics, analyzed via a Python machine learning engine, and orchestrated using Kubernetes scaling APIs.',
        results: 'CostGuard AI achieved a 28% average reduction in monthly cloud infrastructure spend across simulated multi-tenant workloads.',
        conclusion: 'Applying predictive ML models to cloud capacity management provides proactive cost protection and maintains application SLAs.',
        citation: 'Puranik, Y. (2025). CostGuard AI: Dynamic Cloud Resource Optimization using Machine Learning. Research Archive.',
        presentedAt: 'Research Paper',
      },
      {
        title: 'HydroBloom: Smart Rainwater Harvesting System',
        slug: 'hydrobloom',
        authors: ['Yatnesh Puranik', 'Subhi Tiwari', 'Shreya Lathi'],
        journal: 'Research Paper',
        year: 2025,
        abstract: 'HydroBloom is an AI/ML-powered Smart Rainwater Harvesting framework that helps users determine the best rainwater harvesting solution based on roof image analysis, area detection, rainfall statistics, water demand forecasting, and cost optimization recommendations.',
        pdfUrl: hydroBloomUrl,
        externalLink: '',
        problemStatement: 'Urban communities lack analytical tools to calculate potential roof water capture, forecast weather storage capacity, and optimize build costs.',
        methodology: 'Built a responsive React interface (my responsibility) connecting to Python Django ML backends mapping weather trends and area calculations.',
        architecture: 'React dashboard querying Django microservices executing computer-vision area models and prediction estimators.',
        results: 'Achieved cost-optimized recommendations and dynamic volume estimations across local simulated rainfall datasets.',
        conclusion: 'IoT and ML-driven rainwater harvesting estimation models lower municipal grid loads and maximize local water resilience.',
        citation: 'Puranik, Y., Tiwari, S., & Lathi, S. (2025). HydroBloom: Smart Rainwater Harvesting System. Research Archive.',
        presentedAt: 'Research Paper',
      },
    ];

    for (const paper of papersList) {
      await upsertRecord(ResearchPaper, { slug: paper.slug }, paper);
    }

    // Seed/Upsert Certificates
    const certificatesList = [
      {
        title: 'Docker Foundations Professional Certificate',
        issuer: 'Docker',
        issueDate: new Date('2026-07-01'),
        credentialUrl: 'https://res.cloudinary.com/bpv3iunv/image/upload/v1783372864/CertificateOfCompletion_Docker_Foundations_Professional_Certificate_wnwoly.pdf',
        description: 'Demonstrates core containerization concepts, building and managing Docker images, multi-container orchestration with Docker Compose, and container security best practices.',
        order: 0,
      },
      {
        title: 'Career Essentials in GitHub Professional Certificate',
        issuer: 'GitHub',
        issueDate: new Date('2026-07-01'),
        credentialUrl: 'https://res.cloudinary.com/bpv3iunv/image/upload/v1783372864/CertificateOfCompletion_Career_Essentials_in_GitHub_Professional_Certificate_znqpsa.pdf',
        description: 'Validates proficiency in version control, collaborative workflows, branch management, pull requests, issue tracking, and GitHub Actions for continuous integration.',
        order: 1,
      },
      {
        title: 'Problem Solving (Intermediate) Certificate',
        issuer: 'HackerRank',
        issueDate: new Date('2026-07-01'),
        credentialUrl: 'https://res.cloudinary.com/bpv3iunv/image/upload/v1783352620/problem_solving_intermediate_certificate_tbf8qb.pdf',
        description: 'Demonstrates intermediate proficiency in algorithms, data structures (such as hash maps, trees, and graphs), time/space complexity analysis, and complex problem-solving techniques.',
        order: 2,
      },
      {
        title: 'Node.js (Intermediate) Certificate',
        issuer: 'HackerRank',
        issueDate: new Date('2026-07-01'),
        credentialUrl: 'https://res.cloudinary.com/bpv3iunv/image/upload/v1783352660/nodejs_intermediate_certificate_ixijwl.pdf',
        description: 'Validates understanding of event loop mechanics, event emitters, stream/buffer operations, asynchronous control flows, child processes, clustering, and optimization of Node.js servers.',
        order: 3,
      },
      {
        title: 'REST API (Intermediate) Certificate',
        issuer: 'HackerRank',
        issueDate: new Date('2026-07-01'),
        credentialUrl: 'https://res.cloudinary.com/bpv3iunv/image/upload/v1783352644/rest_api_intermediate_certificate_kqtbdp.pdf',
        description: 'Covers advanced RESTful design patterns, HTTP status codes, query filtering/pagination, error handling, rate limiting, request validation, middleware layers, and API performance optimization.',
        order: 4,
      },
      {
        title: 'SQL (Intermediate) Certificate',
        issuer: 'HackerRank',
        issueDate: new Date('2026-07-01'),
        credentialUrl: 'https://res.cloudinary.com/bpv3iunv/image/upload/v1783360980/sql_intermediate_certificate_ip4rih.pdf',
        description: 'Demonstrates intermediate proficiency in complex SQL query construction, joins, subqueries, aggregations, data modification, and database design concepts.',
        order: 5,
      },
      {
        title: 'Frontend Developer (React) Certificate',
        issuer: 'HackerRank',
        issueDate: new Date('2026-07-01'),
        credentialUrl: 'https://res.cloudinary.com/bpv3iunv/image/upload/v1783346704/frontend_developer_react_certificate_cjzwyk.pdf',
        description: 'Covers frontend design patterns, state management, component lifecycles, React hooks, DOM manipulation, responsive layouts, and performance optimization.',
        order: 6,
      },
      {
        title: 'JavaScript (Basic) Certificate',
        issuer: 'HackerRank',
        issueDate: new Date('2026-07-01'),
        credentialUrl: 'https://res.cloudinary.com/bpv3iunv/image/upload/v1783346706/ea0e27ee685ffdba9ac21165fab5014a8e8e1651ac3e2cceeeeec34d405b623a_jlxaqi.png',
        description: 'Demonstrates basic familiarity with core JavaScript mechanics, syntax, variables, basic array operations, loops, and conditional structures.',
        order: 7,
      },
      {
        title: 'IgniteX Research Paper Participation',
        issuer: 'IgniteX',
        description: 'Participation in IgniteX Research competition.',
        order: 8,
      },
    ];

    // Explicitly clean up removed certificates (like ICAT) from DB
    await Certificate.deleteOne({ title: 'ICAT Participation' });

    for (const cert of certificatesList) {
      await upsertRecord(Certificate, { title: cert.title }, cert);
    }

    // Seed/Upsert Social Links
    const socialsList = [
      { name: 'GitHub', url: 'https://github.com/yatneshpuranik', icon: 'Github', order: 0 },
      { name: 'LinkedIn', url: 'https://linkedin.com/in/yatneshpuranik', icon: 'Linkedin', order: 1 },
      { name: 'Email', url: 'mailto:yatneshpuranik@gmail.com', icon: 'Mail', order: 2 },
    ];

    for (const social of socialsList) {
      await upsertRecord(Social, { name: social.name }, social);
    }

    console.log('\n--- Seeding Summary ---');
    console.log(`Inserted: ${insertedCount}`);
    console.log(`Updated:  ${updatedCount}`);
    console.log(`Skipped:  ${skippedCount}`);
    console.log('-----------------------\n');
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    if (backupFile) {
      await rollbackFromBackup(backupFile);
    }
    process.exit(1);
  }
};

seed();
