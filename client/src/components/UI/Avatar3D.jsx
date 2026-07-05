import React from 'react';
import { motion } from 'framer-motion';

/**
 * Avatar3D: Rebuilt as a premium futuristic Iron Man Arc Reactor.
 * Visualizes voice synthesis states: Idle, Listening, Thinking, Speaking.
 */
const Avatar3D = ({ isSpeaking, isListening, isThinking, avatarState }) => {
  const speaking = isSpeaking || avatarState === 'speaking';
  const listening = isListening || avatarState === 'listening';
  const thinking = isThinking || avatarState === 'thinking';


  return (
    <div className="flex flex-col items-center justify-center relative w-full select-none pointer-events-none py-8">

      {/* Outer Glow Backdrop */}
      <div
        className="absolute rounded-full blur-[35px] bg-[#00d8ff] transition-all duration-1000"
        style={{
          width: '180px',
          height: '180px',
          opacity: speaking ? 0.35 : (listening ? 0.25 : (thinking ? 0.20 : 0.12)),
          transform: speaking ? 'scale(1.15)' : 'scale(1)'
        }}
      />

      {/* Expanding Ripple Rings (Synchronized with Speaking / Voice Output) */}
      {speaking && (
        <>
          <motion.div
            className="absolute rounded-full border border-cyan-400/35"
            initial={{ scale: 0.9, opacity: 0.9 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
            style={{ width: '150px', height: '150px' }}
          />
          <motion.div
            className="absolute rounded-full border border-cyan-500/20"
            initial={{ scale: 0.9, opacity: 0.9 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, ease: 'easeOut' }}
            style={{ width: '150px', height: '150px' }}
          />
          <motion.div
            className="absolute rounded-full border border-purple-500/10"
            initial={{ scale: 0.9, opacity: 0.9 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 1.5, delay: 1.0, repeat: Infinity, ease: 'easeOut' }}
            style={{ width: '150px', height: '150px' }}
          />
        </>
      )}

      {/* Main Reactor Body Container */}
      <motion.div
        animate={{
          y: speaking ? [0, -3, 0] : [0, -2, 0],
          scale: speaking ? [1, 1.03, 1] : [1, 1.01, 1]
        }}
        transition={{
          duration: speaking ? 2.5 : 5.0,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center"
      >

        {/* Inner Glowing Core */}
        <div
          className={`rounded-full bg-white flex items-center justify-center z-20 border border-cyan-300 shadow-[0_0_20px_#00d8ff,inset_0_0_8px_#00d8ff] transition-all duration-500 ${speaking ? 'w-13 h-13' : (listening ? 'w-14 h-14' : 'w-12 h-12')
            } ${listening ? 'animate-pulse' : ''}`}
        >
          {/* Reactor Inner Triangular Nodes detail */}
          <div className="w-4 h-4 rounded-full border border-cyan-400/20 opacity-30" />
        </div>

        {/* Orbiting particles (Thinking state) */}
        {thinking && (
          <div className="absolute inset-0 z-30">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00d8ff]"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  rotate: [i * 90, i * 90 + 360],
                  x: [40 * Math.cos((i * 90 * Math.PI) / 180), 40 * Math.cos(((i * 90 + 360) * Math.PI) / 180)],
                  y: [40 * Math.sin((i * 90 * Math.PI) / 180), 40 * Math.sin(((i * 90 + 360) * Math.PI) / 180)],
                }}
                transition={{
                  duration: 2.0,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            ))}
          </div>
        )}

        {/* Rotating Coils and Outer Tracks Layer */}
        <motion.div
          animate={{
            rotate: thinking ? 360 : (listening ? -360 : 360)
          }}
          transition={{
            duration: thinking ? 4.5 : (listening ? 8.0 : 25.0),
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 w-full h-full z-10"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Core track ring */}
            <circle cx="50" cy="50" r="23" fill="none" stroke="#00d8ff" strokeWidth="0.6" strokeOpacity="0.3" />

            {/* 10 copper spokes/coils details */}
            {Array.from({ length: 10 }).map((_, i) => {
              const angle = (i * 36) * Math.PI / 180;
              const x1 = 50 + 26 * Math.cos(angle);
              const y1 = 50 + 26 * Math.sin(angle);
              const x2 = 50 + 33 * Math.cos(angle);
              const y2 = 50 + 33 * Math.sin(angle);
              return (
                <line
                  key={i}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#00d8ff"
                  strokeWidth="2.2"
                  strokeOpacity={speaking ? 0.95 : (listening ? 0.85 : 0.65)}
                  style={{ filter: 'drop-shadow(0 0 1.5px #00d8ff)' }}
                />
              );
            })}

            {/* Middle Outer Segmented Ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#00d8ff"
              strokeWidth="1.2"
              strokeDasharray="18 8 36 8"
              strokeOpacity="0.4"
            />

            {/* Outer track boundary */}
            <circle cx="50" cy="50" r="44" fill="none" stroke="#00d8ff" strokeWidth="0.5" strokeOpacity="0.2" />
          </svg>
        </motion.div>

        {/* Counter-rotating Outer Ring Layer */}
        <motion.div
          animate={{
            rotate: thinking ? -360 : (listening ? 360 : -360)
          }}
          transition={{
            duration: thinking ? 7.0 : (listening ? 12.0 : 35.0),
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 w-full h-full z-0"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#00d8ff"
              strokeWidth="0.6"
              strokeDasharray="5 15 10 10"
              strokeOpacity="0.25"
            />
          </svg>
        </motion.div>

      </motion.div>

      {/* High-tech status label */}
      <div className="mt-4 font-mono text-[9px] tracking-widest text-zinc-500 uppercase font-bold">
        {speaking ? 'EMITTING FEEDBACK' : (listening ? 'CAPURING STIMULUS' : (thinking ? 'QUERING DATA' : 'PORTAL STANDBY'))}
      </div>

    </div>
  );
};

export default Avatar3D;
