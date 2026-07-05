import React from 'react';

const Hero3D = ({ avatarUrl }) => {
  return (
    <div
      className="w-full h-full relative flex items-start justify-center select-none z-10 mx-auto"
      style={{ background: 'transparent', backgroundColor: 'transparent', backgroundImage: 'none', boxShadow: 'none', border: 'none' }}
    >
      {avatarUrl ? (
        <div className="relative w-full h-full flex items-start justify-center overflow-visible">
          
          {/* Ambient Blue Glow: Positioned beneath the image fade zone (bottom 40% height) */}
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full lg:w-[450px] h-[40%] pointer-events-none z-0"
            style={{
              background: 'linear-gradient(to bottom, transparent 0%, rgba(37, 99, 235, 0.15) 50%, rgba(37, 99, 235, 0.08) 80%, transparent 100%)',
              filter: 'blur(16px)',
              mixBlendMode: 'screen',
            }}
          />
          
          {/* Profile Photo with Smooth bottom transparency mask */}
          <img
            src={avatarUrl}
            alt="Yatnesh Puranik"
            className="w-full h-auto lg:w-auto lg:h-full lg:max-h-full object-contain object-top pointer-events-none select-none z-10 scale-110 lg:scale-[1.35] origin-top"
            style={{
              background: 'transparent',
              backgroundColor: 'transparent',
              backgroundImage: 'none',
              boxShadow: 'none',
              border: 'none',
              mixBlendMode: 'normal',
              filter: 'contrast(1.08) brightness(0.95) drop-shadow(4px 0px 12px rgba(212, 175, 55, 0.08))',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 55%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.3) 85%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 0%, black 55%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.3) 85%, transparent 100%)'
            }}
          />
        </div>
      ) : (
        <div className="w-[280px] h-[360px] bg-[#111116] border border-[#3a4a5c]/30 flex items-center justify-center font-heading font-black text-white text-3xl">YP</div>
      )}

    </div>
  );
};

export default Hero3D;
