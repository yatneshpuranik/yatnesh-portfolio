import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import {
  Sparkles, X, Mic, MicOff, Send, Volume2,
  VolumeX, Power, Terminal, MonitorPlay
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProfile } from '../../services/api';
import { getIdleVideoUrl } from '../../services/avatarService';
import Avatar3D from './Avatar3D';

// Sound effects generator using Web Audio API
const playSynthSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200 + Math.random() * 500, now);
      gain.gain.setValueAtTime(0.003, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.025);
    } else if (type === 'beep') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, now);
      gain.gain.setValueAtTime(0.012, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.08);
    } else if (type === 'activation') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(980, now + 0.28);
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.28);
    } else if (type === 'received') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.setValueAtTime(700, now);
      gain.gain.setValueAtTime(0.012, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.08);

      setTimeout(() => {
        try {
          const ctx2 = new AudioContext();
          const osc2 = ctx2.createOscillator();
          const gain2 = ctx2.createGain();
          osc2.frequency.setValueAtTime(900, ctx2.currentTime);
          gain2.gain.setValueAtTime(0.012, ctx2.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.0001, ctx2.currentTime + 0.08);
          osc2.connect(gain2);
          gain2.connect(ctx2.destination);
          osc2.start();
          osc2.stop(ctx2.currentTime + 0.08);
        } catch (e) { }
      }, 70);
    }
  } catch (e) {
    // Audio contexts blocked by autoplay
  }
};

// Robust sentence splitter regex
const splitIntoSentences = (text) => {
  if (!text) return [];
  const clean = text.replace(/```[a-z]*\n[\s\S]*?\n```/g, '').trim();
  const sentenceRegex = /(?<!\b(?:e\.g|i\.e|mr|mrs|ms|dr|vs|prof|std|approx)\.)(?<=[.!?])\s+/g;
  return clean.split(sentenceRegex).map(s => s.trim()).filter(Boolean);
};

// Global SpeechRecognition Singleton
let globalRecognition = null;
const initGlobalRecognition = () => {
  if (globalRecognition) return globalRecognition;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    globalRecognition = new SpeechRecognition();
    globalRecognition.continuous = false;
    globalRecognition.interimResults = false;
    globalRecognition.lang = 'en-US';
  }
  return globalRecognition;
};

const AIAssistant = () => {
  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: fetchProfile });

  const [isOpen, setIsOpen] = useState(false);

  // Voice states
  const [voiceActive, setVoiceActive] = useState(false);
  const [needActivation, setNeedActivation] = useState(true);
  const [hasMicPermission, setHasMicPermission] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [latency, setLatency] = useState(0);

  // Talking Avatar states
  const [avatarMode, setAvatarMode] = useState('vrm'); // 'vrm' | 'video' | 'orb'
  const [avatarState, setAvatarState] = useState('idle'); // 'idle' | 'listening' | 'thinking' | 'speaking' | 'error'
  const [speakingUrl, setSpeakingUrl] = useState(null);

  // Streaming dialogue list state (Step 10 Refactored Queue System)
  const [visibleSentences, setVisibleSentences] = useState([]);
  const activeSentenceIdRef = useRef(null);
  const sentencesQueueRef = useRef([]);

  const idleVideoRef = useRef(null);
  const speakingVideoRef = useRef(null);
  const orbCanvasRef = useRef(null);
  const messageEndRef = useRef(null);
  const currentUtteranceRef = useRef(null);
  const typewriterTimeoutsRef = useRef([]);

  // Auto-scroll on dialogue updates
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleSentences]);

  // Terminal Logs
  const [logs, setLogs] = useState([
    '> INITIALIZING NEURAL PORTAL SYSTEM...',
    '> YATNESH DIGITAL PROFILE LINKED',
    '> STANDBY FOR STIMULUS...'
  ]);

  const [input, setInput] = useState('');

  const addLog = useCallback((msg) => {
    setLogs((prev) => [...prev.slice(-8), msg]);
  }, []);

  const abortActiveSpeech = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setAvatarState('idle');
    typewriterTimeoutsRef.current.forEach(id => clearTimeout(id));
    typewriterTimeoutsRef.current = [];
    sentencesQueueRef.current = [];
    setVisibleSentences(prev => prev.map(s => ({ ...s, status: 'completed' })));
  }, []);

  const deactivateVoiceMode = useCallback(() => {
    setVoiceActive(false);
    setNeedActivation(true);
    if (globalRecognition && isListening) {
      try {
        globalRecognition.stop();
      } catch (e) { }
    }
    setIsListening(false);
    abortActiveSpeech();
    addLog('> SECURE VOICE LINK TERMINATED');
    toast.success('Voice mode deactivated.');
  }, [isListening, abortActiveSpeech, addLog]);

  const startListening = useCallback(() => {
    const rec = initGlobalRecognition();
    if (rec && !isListening && !isSpeaking && !isThinking) {
      try {
        rec.start();
      } catch (err) {
        // already active
      }
    }
  }, [isListening, isSpeaking, isThinking]);

  const stopListening = useCallback(() => {
    const rec = initGlobalRecognition();
    if (rec && isListening) {
      try {
        rec.stop();
      } catch (err) {
        // already stopped
      }
    }
  }, [isListening]);

  // 1. Mutable reference to avoid stale closures in event handlers
  const recognitionCallbacksRef = useRef({
    onStart: null,
    onResult: null,
    onEnd: null,
    onError: null
  });

  recognitionCallbacksRef.current = {
    onStart: () => {
      setIsListening(true);
      setAvatarState('listening');
      addLog('> SPEECH CAPTURE ENGINE STANDBY');
    },
    onResult: (e) => {
      const transcript = e.results[0][0].transcript;
      setIsListening(false);
      if (transcript.trim()) {
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
          abortActiveSpeech();
          addLog('> DETECTED USER INPUT: VOICE RESPONSE ABORTED');
        }

        addLog(`> SPEECH INPUT STIMULUS: "${transcript.toUpperCase()}"`);
        handleSend(transcript);
      }
    },
    onError: (e) => {
      console.error('Speech recognition error:', e.error);
      setIsListening(false);
    },
    onEnd: () => {
      setIsListening(false);

      // Loop SpeechRecognition to maintain hands-free loop
      if (voiceActive && !isThinking && isOpen) {
        const restartDelay = (window.speechSynthesis && window.speechSynthesis.speaking) ? 1400 : 500;
        const timeoutId = setTimeout(() => {
          if (voiceActive && !isThinking && isOpen) {
            try {
              const rec = initGlobalRecognition();
              if (rec) rec.start();
            } catch (err) {
              // already running
            }
          }
        }, restartDelay);
        typewriterTimeoutsRef.current.push(timeoutId);
      }
    }
  };

  // Bind single-mount callbacks
  useEffect(() => {
    const rec = initGlobalRecognition();
    if (!rec) return;

    rec.onstart = () => recognitionCallbacksRef.current.onStart?.();
    rec.onresult = (e) => recognitionCallbacksRef.current.onResult?.(e);
    rec.onerror = (e) => recognitionCallbacksRef.current.onError?.(e);
    rec.onend = () => recognitionCallbacksRef.current.onEnd?.();

    return () => {
      rec.onstart = null;
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
    };
  }, []);

  // State machine voice controller (Idle -> Listening -> Thinking -> Speaking -> Listening)
  useEffect(() => {
    const rec = initGlobalRecognition();
    if (!rec) return;

    if (voiceActive && isOpen && !isThinking) {
      try {
        rec.start();
      } catch (err) {
        // already active
      }
    } else {
      try {
        rec.stop();
      } catch (err) {
        // already stopped
      }
    }
  }, [voiceActive, isOpen, isThinking]);

  // Trigger Welcome Speech, Chirp and dispatch active state on Modal Open
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('ai-assistant-state', { detail: { open: isOpen } }));
    if (isOpen) {
      playSynthSound('activation');

      const welcomeText = "Hi, I'm Yatnesh Puranik. I build MERN apps, high-performance backends, and AI products. Ask me anything about my work.";
      const sentences = splitIntoSentences(welcomeText);

      sentencesQueueRef.current = sentences;
      setVisibleSentences([]);

      const startupTimeout = setTimeout(() => {
        if (isOpen) {
          playNextSentence();
        }
      }, 600);

      return () => clearTimeout(startupTimeout);
    } else {
      abortActiveSpeech();
    }
  }, [isOpen, abortActiveSpeech]);

  // Listen for navigation CTA triggers to open AI console
  useEffect(() => {
    const handleOpenConsole = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-ai-chat', handleOpenConsole);
    return () => window.removeEventListener('open-ai-chat', handleOpenConsole);
  }, []);

  // ESC key listener to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        deactivateVoiceMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, deactivateVoiceMode]);

  // Disable body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // 6. Character-by-Character Typewriter
  const typeSentence = (text, id) => {
    let charIndex = 0;
    let accumulated = '';

    const typeChar = () => {
      if (charIndex >= text.length) {
        return;
      }

      const char = text[charIndex];
      accumulated += char;

      playSynthSound('click');

      setVisibleSentences(prev => prev.map(s =>
        s.id === id ? { ...s, typedText: accumulated } : s
      ));

      charIndex++;

      let delay = Math.random() * (35 - 25) + 25; // 25-35ms natural flux
      if (char === '.' || char === '!' || char === '?') {
        delay = 400;
      } else if (char === ',') {
        delay = 200;
      } else if (char === ':') {
        delay = 250;
      }

      const nextTimeout = setTimeout(typeChar, delay);
      typewriterTimeoutsRef.current.push(nextTimeout);
    };

    typeChar();
  };

  const advanceAfterSpeech = () => {
    const activeId = activeSentenceIdRef.current;

    // Force active sentence to be fully completed and remove cursor
    setVisibleSentences(prev => prev.map(s =>
      s.id === activeId ? { ...s, typedText: s.fullText, status: 'completed' } : s
    ));

    // Next queue shift with a slight pause representing natural spacing
    const paragraphPause = 750;
    const timeoutId = setTimeout(() => {
      playNextSentence();
    }, paragraphPause);
    typewriterTimeoutsRef.current.push(timeoutId);
  };

  // 4. Refactored Dialogue Queue Player
  const playNextSentence = () => {
    if (sentencesQueueRef.current.length === 0) {
      setIsSpeaking(false);
      setAvatarState('idle');
      addLog('> PROFILE EMISSION TERMINATED');

      // Clear cursors on speech end
      setVisibleSentences(prev => prev.map(s => ({ ...s, status: 'completed' })));

      if (voiceActive && isOpen) {
        setTimeout(() => startListening(), 500);
      }
      return;
    }

    const currentText = sentencesQueueRef.current.shift();
    const newId = Date.now().toString() + '_' + Math.random().toString();
    activeSentenceIdRef.current = newId;

    // Shift window boundary (maintain max 3 items in DOM)
    setVisibleSentences(prev => {
      const updatedPrev = prev.map(s => ({ ...s, status: 'completed' }));
      const next = [...updatedPrev, { id: newId, fullText: currentText, typedText: '', status: 'typing' }];
      if (next.length > 3) {
        return next.slice(1);
      }
      return next;
    });

    // Start TTS
    speakSentence(currentText);

    // Start Typewriter
    typeSentence(currentText, newId);
  };

  // 5. Synthesizer Text-to-Speech Sentence Player
  const speakSentence = (text) => {
    if (!window.speechSynthesis) {
      const fallbackTimeout = setTimeout(() => {
        advanceAfterSpeech();
      }, text.length * 60 + 800);
      typewriterTimeoutsRef.current.push(fallbackTimeout);
      return;
    }

    stopListening();

    const cleanText = text
      .replace(/\[NAVIGATE:[^\]]+\]/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/[*#_`~-]/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';

    // Choose premium voice
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v =>
      v.lang.startsWith('en') &&
      (v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('david'))
    );
    if (premiumVoice) {
      utterance.voice = premiumVoice;
    }

    utterance.rate = 1.05; // Jarvis pace

    utterance.onstart = () => {
      setIsSpeaking(true);
      setAvatarState('speaking');
    };

    utterance.onend = () => {
      advanceAfterSpeech();
    };

    utterance.onerror = (e) => {
      console.error("UTTERANCE ERROR:", e);
      advanceAfterSpeech();
    };

    currentUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const activateVoiceMode = async () => {
    try {
      setNeedActivation(false);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasMicPermission(true);
      setVoiceActive(true);
      stream.getTracks().forEach(track => track.stop());

      abortActiveSpeech();
      addLog('> MIC ENCRYPTED LINK ACQUIRED');

      const welcomeText = "Connecting voice stream. Hi, I'm Yatnesh. Let's talk about my background and projects.";
      const sentences = splitIntoSentences(welcomeText);

      sentencesQueueRef.current = sentences;
      setVisibleSentences([]);
      playNextSentence();

    } catch (err) {
      console.error('Microphone access denied:', err);
      toast.error('Microphone permission denied. Voice mode deactivated.');
      setNeedActivation(true);
      setHasMicPermission(false);
      setVoiceActive(false);
    }
  };

  // Enforce Navigation Jumps
  const handleNavCommand = (elementId, replyMsg, resumeUrl = null) => {
    addLog(`> INITIATING PORTAL TRANSITION: ${elementId.toUpperCase()}`);
    setIsOpen(false);
    deactivateVoiceMode();

    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
      return;
    }

    setTimeout(() => {
      document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const handleSend = async (textToSend = input) => {
    const query = textToSend.trim();
    if (!query) return;

    const startTime = Date.now();
    abortActiveSpeech();
    playSynthSound('activation');

    setVisibleSentences([]);
    sentencesQueueRef.current = [];

    setInput('');
    setIsThinking(true);
    setAvatarState('thinking');
    stopListening();

    const lowercaseQuery = query.toLowerCase();

    // OS Thinking logs
    const thinkingStates = [
      '> Accessing memories...',
      '> Retrieving project indexes...',
      '> Validating credentials...',
      '> Parsing response nodes...'
    ];

    thinkingStates.forEach((stateLog, idx) => {
      const logTimeout = setTimeout(() => {
        if (isThinking) {
          addLog(stateLog);
          playSynthSound('beep');
        }
      }, (idx + 1) * 400);
      typewriterTimeoutsRef.current.push(logTimeout);
    });

    if (lowercaseQuery.includes('internship') || lowercaseQuery.includes('experience')) {
      setTimeout(() => {
        handleNavCommand('experience', 'Porting screen to experience log.');
        setIsThinking(false);
        setLatency(Date.now() - startTime);
      }, 800);
      return;
    }
    if (lowercaseQuery.includes('project') || lowercaseQuery.includes('best project')) {
      setTimeout(() => {
        handleNavCommand('projects', 'Transporting user to case study cards.');
        setIsThinking(false);
        setLatency(Date.now() - startTime);
      }, 800);
      return;
    }
    if (lowercaseQuery.includes('skills') || lowercaseQuery.includes('technology')) {
      setTimeout(() => {
        handleNavCommand('skills', 'Opening full technology matrices.');
        setIsThinking(false);
        setLatency(Date.now() - startTime);
      }, 800);
      return;
    }
    if (lowercaseQuery.includes('research') || lowercaseQuery.includes('paper')) {
      setTimeout(() => {
        handleNavCommand('research', 'Porting interface to publications.');
        setIsThinking(false);
        setLatency(Date.now() - startTime);
      }, 800);
      return;
    }
    if (lowercaseQuery.includes('contact') || lowercaseQuery.includes('email')) {
      setTimeout(() => {
        handleNavCommand('contact', 'Scrolling client to mail terminal.');
        setIsThinking(false);
        setLatency(Date.now() - startTime);
      }, 800);
      return;
    }
    if (lowercaseQuery.includes('resume') || lowercaseQuery.includes('cv')) {
      setTimeout(() => {
        handleNavCommand('hero', 'Downloading resume file.', 'https://res.cloudinary.com/bpv3iunv/image/upload/v1782990790/ResumeYatneshMERN_2_sul1q7.pdf');
        setIsThinking(false);
        setLatency(Date.now() - startTime);
      }, 800);
      return;
    }

    try {
      const res = await axios.post('/chat', {
        message: query,
        history: [{ role: 'user', parts: [{ text: "Strictly speak in the first person: 'I', 'my', 'me'. Represent Yatnesh Puranik." }] }]
      });

      setLatency(Date.now() - startTime);

      if (res.data.success) {
        const replyText = res.data.reply;

        setIsThinking(false);
        playSynthSound('received');
        addLog('> RESPONSE FEED SYNCHRONIZED');

        const sentences = splitIntoSentences(replyText);
        sentencesQueueRef.current = sentences;
        playNextSentence();
      } else {
        throw new Error('Connection failed');
      }
    } catch (err) {
      console.error(err);
      setLatency(Date.now() - startTime);
      const fallbackMsg = "System connection standby. Query database again.";
      setIsThinking(false);

      const sentences = splitIntoSentences(fallbackMsg);
      sentencesQueueRef.current = sentences;
      playNextSentence();
    }
  };

  const getOrbStateClass = () => {
    if (isThinking || avatarState === 'thinking') return 'bg-[#141414] border-white/20 scale-105 shadow-md';
    if (isSpeaking || avatarState === 'speaking') return 'bg-white border-white scale-105 shadow-lg';
    if (isListening) return 'bg-[#4da3ff] border-[#4da3ff] scale-110 shadow-lg';
    return 'bg-black border-[#2a2a2a] hover:border-white shadow-md';
  };

  // Memoized orb button render
  const orbButton = useMemo(() => {
    if (isOpen) return null;
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full border shadow-2xl flex items-center justify-center transition-all duration-300 relative group shrink-0 ${getOrbStateClass()}`}
        aria-label="Toggle AI Voice Assistant"
      >
        {(isListening || isSpeaking || isThinking || avatarState === 'speaking') && (
          <span className="absolute -inset-1.5 rounded-full bg-white/10 blur-sm animate-ping pointer-events-none" />
        )}
        <Sparkles className={`w-5 h-5 animate-pulse ${isSpeaking || avatarState === 'speaking' ? 'text-black' : 'text-white'}`} />
      </button>
    );
  }, [isOpen, isListening, isSpeaking, isThinking, avatarState]);

  return (
    <div className="z-50">
      {orbButton}

      {/* Full-Screen Holographic AI Control Center */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-300 font-sans select-none text-left"
          onClick={() => {
            setIsOpen(false);
            deactivateVoiceMode();
          }}
        >

          {/* 3-Column Glass HUD panel wrapper */}
          <div
            className="w-full max-w-6xl h-[90vh] md:h-[80vh] rounded-2xl border border-[#2a2a2a] bg-[#050505]/95 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative shadow-[0_30px_70px_rgba(0,0,0,0.95)]"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Close Overlay Control */}
            <button
              onClick={() => {
                setIsOpen(false);
                deactivateVoiceMode();
              }}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer z-30"
              aria-label="Close Assistant Console"
            >
              <X className="w-5 h-5" />
            </button>

            {/* COLUMN 1 (LEFT): Real Photo & circular waveform animations */}
            <div className="w-full lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[#2a2a2a] flex flex-col items-center justify-center p-6 bg-[#0b0b0b]/60 shrink-0 relative">
              <div className="relative w-full flex items-center justify-center">
                <Avatar3D
                  isSpeaking={isSpeaking}
                  isListening={isListening}
                  isThinking={isThinking}
                  avatarState={avatarState}
                  avatarUrl={profile?.avatarUrl}
                />
              </div>
            </div>

            {/* COLUMN 2 (CENTER): Dialogue Stream & Input bar */}
            <div className="lg:col-span-6 flex flex-col justify-between p-6 md:p-8 min-w-0 bg-[#050505] relative z-10">

              <div className="flex flex-col justify-center text-left min-w-0 flex-1">
                <div className="text-white/40 text-[9px] font-mono uppercase tracking-widest font-black mb-4">
                  &gt; Dialogue Stream
                </div>

                <div className="flex-grow overflow-y-auto h-[240px] md:h-[280px] relative border border-[#2a2a2a] bg-[#111111]/40 rounded-xl p-6 flex flex-col justify-start shadow-inner">
                  {visibleSentences.length === 0 ? (
                    <div className="text-zinc-650 font-mono text-center text-xs italic tracking-widest animate-pulse font-bold m-auto">
                      {isThinking ? 'Accessing neural databases...' : 'Link standby. Initiate conversation...'}
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-4 items-start w-full relative">
                      <AnimatePresence mode="popLayout">
                        {visibleSentences.map((s, idx) => {
                          const isCurrent = s.status === 'typing';
                          return (
                            <motion.div
                              key={s.id}
                              initial={{ opacity: 0, y: 15, scale: 0.98 }}
                              animate={{
                                opacity: isCurrent ? 1.0 : 0.3,
                                y: 0,
                                scale: isCurrent ? 1.0 : 0.98
                              }}
                              exit={{ opacity: 0, y: -15, scale: 0.96 }}
                              transition={{ duration: 0.35, ease: 'easeOut' }}
                              className={`flex items-start justify-start w-full origin-left transition-colors duration-300 ${isCurrent ? 'text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.15)] font-mono' : 'text-gray-500 font-mono'
                                }`}
                              style={{ minHeight: '52px' }}
                            >
                              <span className="font-mono text-white/20 text-[9px] mt-1 mr-3 select-none">
                                [{String(idx + 1).padStart(2, '0')}]
                              </span>
                              <p className="font-sans text-sm md:text-base leading-relaxed tracking-wide font-normal">
                                {isCurrent ? s.typedText : s.fullText}
                                {isCurrent && (
                                  <span className="inline-block w-2 h-4 bg-white ml-1 animate-pulse select-none align-middle">█</span>
                                )}
                              </p>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                      <div ref={messageEndRef} />
                    </div>
                  )}
                </div>
              </div>

              {/* Console Input Bar */}
              <div className="pt-4 border-t border-white/[0.04] flex items-center gap-2.5 shrink-0 mt-4">
                <textarea
                  placeholder={voiceActive ? "Listening for vocal command..." : "Type command parameter..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={1}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[#2a2a2a] bg-[#111111] text-xs focus:outline-none focus:border-white/45 text-white tracking-widest transition-all duration-300 font-mono shadow-inner resize-none overflow-y-auto max-h-20"
                  aria-label="Text command input field"
                />

                {voiceActive ? (
                  <button
                    onClick={deactivateVoiceMode}
                    className="p-3.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300 cursor-pointer shrink-0"
                    title="Mute Voice Link"
                    aria-label="Deactivate Voice Mode"
                  >
                    <MicOff className="w-4 h-4 animate-pulse" />
                  </button>
                ) : (
                  <button
                    onClick={activateVoiceMode}
                    className="p-3.5 rounded-lg border border-[#2a2a2a] bg-black hover:bg-white hover:text-black text-white transition-all duration-350 cursor-pointer shrink-0"
                    title="Activate Voice Link"
                    aria-label="Activate Voice Mode"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => handleSend()}
                  disabled={isThinking || !input.trim()}
                  className="p-3.5 rounded-lg bg-white hover:bg-zinc-200 border border-white text-black disabled:opacity-30 disabled:hover:bg-white transition-all duration-300 cursor-pointer shrink-0 shadow-md"
                  aria-label="Send Input Parameters"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* COLUMN 3 (RIGHT): HUD Logs & System Status Indicators */}
            <div className="w-full lg:col-span-3 border-t lg:border-t-0 lg:border-l border-[#2a2a2a] p-6 md:p-8 flex flex-col justify-between bg-[#0b0b0b]/60 shrink-0 font-mono text-[9px] text-zinc-400">

              {/* Header Status */}
              <div className="space-y-4 w-full">
                <div className="flex items-center space-x-1.5 text-white pb-2 border-b border-[#2a2a2a] uppercase font-black tracking-widest text-[8px] font-mono">
                  <Terminal className="w-3.5 h-3.5 text-white" />
                  <span>HUD Logs</span>
                </div>

                {/* System status metrics */}
                <div className="space-y-2 bg-[#111111]/70 p-3 rounded-lg border border-[#2a2a2a] text-zinc-500 font-mono text-[8px]">
                  <div className="flex justify-between">
                    <span>OS_REV:</span>
                    <span className="text-white font-bold">V2.4_MONO</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI_STATUS:</span>
                    <span className={`font-bold ${speaking ? 'text-white' : (listening ? 'text-[#4da3ff]' : 'text-zinc-400')}`}>
                      {speaking ? 'SPEAKING' : (listening ? 'LISTENING' : 'ONLINE')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>LATENCY:</span>
                    <span className="text-white font-bold">{latency}ms</span>
                  </div>
                </div>

                <div className="space-y-1.5 overflow-hidden max-h-[160px] text-zinc-500">
                  {logs.map((log, idx) => (
                    <div key={idx} className="truncate tracking-wider font-mono">{log}</div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#2a2a2a] text-zinc-650 tracking-widest uppercase font-bold text-[7px] flex items-center justify-between">
                <span>SECURE MODE:</span>
                <span className="text-white">ON</span>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
