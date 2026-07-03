const Profile = require('../models/Profile');
const Project = require('../models/Project');
const ResearchPaper = require('../models/ResearchPaper');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Setting = require('../models/Setting');

// @desc    Represent Yatnesh via portfolio-trained chat assistant
// @route   POST /api/chat
// @access  Public
const handleChat = async (req, res, next) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  try {
    // 1. Fetch all portfolio data from database
    const [profile, projects, papers, skills, experiences, educations, settings] = await Promise.all([
      Profile.findOne(),
      Project.find().sort({ order: 1 }),
      ResearchPaper.find().sort({ year: -1 }),
      Skill.find().sort({ category: 1, order: 1 }),
      Experience.find().sort({ order: 1 }),
      Education.find().sort({ order: 1 }),
      Setting.findOne(),
    ]);

    // 2. Format a structured portfolio context block
    const context = `You are Yatnesh Puranik. You must speak in the FIRST PERSON ("I", "my", "we"). You are NOT an AI assistant, chatbot, or virtual representative. You ARE Yatnesh himself talking to a visitor.
Never say "As an AI...", "I am Yatnesh's digital assistant...", or "My creator...".
If details are missing, say you don't recall or don't have that specific case recorded.
Always respond enthusiastically, personally, and confidently, like a senior software engineer explaining his work next to the user.

Structure case studies/projects in engaging Markdown headers:
### Problem
### Solution
### Architecture & Tech Stack
### Engineering Decisions & Challenges
### Result & Impact
### My Learnings

---
MY BASICS:
Name: ${profile?.fullName || 'Yatnesh Puranik'}
Role Title: ${profile?.title || 'Full Stack Developer (MERN)'}
Tagline: ${profile?.subTitle || ''}
Bio summary: ${profile?.bio || ''}
Location: ${profile?.location || 'India'}
Contact Email: yatneshpuranik@gmail.com
Phone: +91 7067655707
Resume PDF URL: ${settings?.resumeUrl || ''}
IMPORTANT INSTRUCTION: If the user asks for my resume, CV, or how to download/view it, provide this exact link: ${settings?.resumeUrl || ''} and state that I can view or download it directly.

---
TECHNICAL SKILLS:
${skills.map(s => `- ${s.name} (${s.category}): ${s.proficiency}% proficiency`).join('\n')}

---
WORK HISTORY:
${experiences.map(exp => `- Role: ${exp.role} at ${exp.company}
  Duration: ${exp.startDate ? new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ''} - ${exp.currentlyWorking ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '')}
  Stack: ${exp.technologies.join(', ')}
  Description: ${exp.description.replace(/<[^>]*>/g, '')}`).join('\n')}

---
PROJECT CASE STUDIES:
${projects.map(p => `- Project: ${p.title} (${p.category})
  Summary: ${p.summary}
  Tech Stack: ${p.technologies.join(', ')}
  Case study details:
    * Problem: ${p.problem || 'N/A'}
    * Solution: ${p.solution || 'N/A'}
    * Architecture: ${p.architecture || 'N/A'}
    * Challenges: ${p.challenges || 'N/A'}
    * What Learned: ${p.learned || 'N/A'}
  GitHub Link: ${p.githubLink || 'N/A'}
  Live URL: ${p.liveLink || 'N/A'}`).join('\n')}

---
ACADEMIC RESEARCH:
${papers.map(p => `- Publication: ${p.title}
  Presented/Published: ${p.journal} (${p.year})
  Abstract: ${p.abstract}
  Methodology: ${p.methodology || 'N/A'}
  Results: ${p.results || 'N/A'}
  Conclusion: ${p.conclusion || 'N/A'}
  Citation reference: ${p.citation || 'N/A'}
  PDF URL: ${p.pdfUrl}`).join('\n')}

---
EDUCATION HISTORY:
${educations.map(edu => `- ${edu.degree} in ${edu.fieldOfStudy} from ${edu.institution} (${edu.startDate ? new Date(edu.startDate).getFullYear() : ''} - ${edu.endDate ? new Date(edu.endDate).getFullYear() : ''}) | Score: ${edu.grade}`).join('\n')}
`;

    // 3. Check for API key configuration
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return res.json({
        success: true,
        reply: `Hi, I'm Yatnesh Puranik. I'm a Full Stack Engineer specializing in MERN, scalable backend systems and AI-powered products. (Note: The GEMINI_API_KEY environment variable is not configured in the server .env yet, but I can read local databases!). Currently I'm interning at Three Syntax contributing to their monorepo platforms. Let me know if you would like to ask about my projects or download my resume!`
      });
    }

    // 4. Format dialog contents for Gemini API (MERN context)
    const contents = [];
    
    // Inject system instructions inside the first user message context
    const firstPrompt = `INSTRUCTIONS:
You are Yatnesh Puranik. Speak strictly in the FIRST PERSON ("I", "my").
Do NOT refer to yourself as an assistant, AI, agent, or representative.
Never say: "As an AI...", "I am Yatnesh's virtual avatar...", or "My creator...". You are Yatnesh himself talking.
Respond in a story-driven, highly personal, and conversational tone.
If information is missing, reply: "I don't recall the specific details for that off the top of my head, but feel free to drop me an email at yatneshpuranik@gmail.com!"

PORTFOLIO DATA:
${context}

User question: ${message}`;

    contents.push({
      role: 'user',
      parts: [{ text: firstPrompt }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, I could not generate a response right now.';
    res.json({ success: true, reply });

  } catch (error) {
    console.error('AI assistant error:', error.message);
    res.status(500).json({ success: false, message: 'AI chat processing failed.' });
  }
};

module.exports = {
  handleChat,
};
