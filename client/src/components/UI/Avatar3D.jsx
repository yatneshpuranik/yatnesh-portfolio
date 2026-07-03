import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Avatar3D: Rebuilt as a premium Apple-inspired Voice Assistant Profile.
 * Features:
 *  - Dynamic client-side white background removal (chromakey) of yatnesh.jpg.
 *  - Circular waveform ripples expanding around the transparent portrait while speaking/listening.
 *  - Slow breathing animation and soft ambient cyan/purple glow layers.
 *  - Zero cyberpunk HUD telemetry overlays or rotation rings.
 */
const getOptimizedCloudinaryUrl = (url, transformations = 'q_auto,f_auto') => {
  if (!url) return '';
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;
  const insertPosition = uploadIndex + '/upload/'.length;
  return `${url.slice(0, insertPosition)}${transformations}/${url.slice(insertPosition)}`;
};

const Avatar3D = ({ isSpeaking, isListening, isThinking, avatarState, avatarUrl }) => {
  const speaking = isSpeaking || avatarState === 'speaking';
  const listening = isListening || avatarState === 'listening';
  const thinking = isThinking || avatarState === 'thinking';

  const [processedImage, setProcessedImage] = useState('');

  // Perform dynamic background removal on load
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = avatarUrl ? getOptimizedCloudinaryUrl(avatarUrl) : '/yatnesh.jpg';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Filter out white/near-white pixels with soft edges
      const thresholdMin = 210;
      const thresholdMax = 245;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const avg = (r + g + b) / 3;

        if (avg > thresholdMin) {
          const diff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(b - r));
          if (diff < 15) {
            // Apply soft edge falloff
            const alphaFactor = Math.max(0, Math.min(1, (thresholdMax - avg) / (thresholdMax - thresholdMin)));
            data[i + 3] = Math.min(data[i + 3], Math.floor(alphaFactor * 255));
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
      setProcessedImage(canvas.toDataURL('image/png'));
    };
  }, [avatarUrl]);

  return (
    <div className="flex flex-col items-center justify-center relative w-full select-none">
      
      {/* Siri / Voice mode animated circular ripple indicators */}
      <div className="relative flex items-center justify-center w-44 h-44 sm:w-48 sm:h-48 z-10">
        
        {/* SPEAKING / LISTENING: Expanding circular ripple rings */}
        {(speaking || listening) && (
          <>
            <motion.div
              className="absolute rounded-full border border-white/20 bg-white/[0.005] shadow-[0_0_15px_rgba(255,255,255,0.03)]"
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 2.0, repeat: Infinity, ease: 'easeOut' }}
              style={{ width: '130px', height: '130px' }}
            />
            <motion.div
              className="absolute rounded-full border border-white/10 bg-white/[0.002]"
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 2.0, delay: 0.6, repeat: Infinity, ease: 'easeOut' }}
              style={{ width: '130px', height: '130px' }}
            />
            <motion.div
              className="absolute rounded-full border border-white/5 bg-transparent"
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 2.0, delay: 1.2, repeat: Infinity, ease: 'easeOut' }}
              style={{ width: '130px', height: '130px' }}
            />
          </>
        )}

        {/* Ambient colored lighting behind photo container */}
        <div 
          className={`absolute rounded-full transition-all duration-1000 blur-xl opacity-35 ${
            speaking ? 'bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 scale-110' :
            listening ? 'bg-[#4da3ff]/15 scale-105' :
            thinking ? 'bg-zinc-500/10 scale-100 animate-pulse' :
            'bg-white/[0.02] scale-95'
          }`}
          style={{ width: '150px', height: '150px' }}
        />

        {/* Real Photo Portrait Circle Frame */}
        <motion.div 
          animate={{
            y: [0, -4, 0],
            scale: speaking ? [1, 1.02, 1] : [1, 1.01, 1]
          }}
          transition={{
            duration: speaking ? 3.0 : 6.0,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className={`w-[115px] h-[115px] rounded-full overflow-hidden border bg-[#050505] relative z-20 flex items-center justify-center transition-all duration-500 ${
            speaking ? 'border-white/40 shadow-[0_0_25px_rgba(255,255,255,0.06)]' :
            listening ? 'border-[#4da3ff]/30 shadow-[0_0_20px_rgba(77,163,255,0.12)]' :
            'border-white/10 shadow-lg'
          }`}
          style={{ backdropFilter: 'blur(8px)' }}
        >
          {processedImage ? (
            <img
              src={processedImage}
              alt="Yatnesh AI Assistant"
              className="w-full h-full object-cover scale-118 origin-bottom filter brightness-95"
            />
          ) : (
            <div className="w-full h-full bg-[#111111] animate-pulse" />
          )}

          {/* Subtle diagonal glossy shimmer sweep */}
          <motion.div
            animate={{ x: ['-120%', '120%'] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.0 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
          />
        </motion.div>

      </div>

      {/* Siri-style dynamic mini sound waves */}
      <div className="flex gap-1 items-end h-5 mt-4 select-none pointer-events-none z-10">
        {Array.from({ length: 9 }).map((_, idx) => {
          let bounceHeights = [4, 6, 4];
          if (speaking) {
            bounceHeights = [
              4, 
              [16, 10, 20, 14, 8, 18, 12][idx % 7], 
              4
            ];
          } else if (listening) {
            bounceHeights = [4, [8, 6, 10, 7][idx % 4], 4];
          }

          const duration = speaking 
            ? (0.4 + (idx % 4) * 0.08) 
            : (1.2 + (idx % 3) * 0.15);

          return (
            <motion.div
              key={idx}
              className={`w-0.75 rounded-full transition-all duration-300 ${
                speaking ? 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.3)]' :
                listening ? 'bg-[#4da3ff] shadow-[0_0_6px_rgba(77,163,255,0.2)]' :
                'bg-zinc-800'
              }`}
              animate={{ height: bounceHeights }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{ height: '4px' }}
            />
          );
        })}
      </div>

    </div>
  );
};

export default Avatar3D;
