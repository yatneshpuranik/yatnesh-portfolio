import React from 'react';
import VibraniumCoreSphere from '../sections/JarvisSphere';

/**
 * Avatar3D
 * --------
 * Acts as a clean wrapper around the custom-designed VibraniumCoreSphere component.
 * Maps dialogue states (speaking, listening, thinking) to status and BPM values.
 */
const Avatar3D = ({ isSpeaking, isListening, isThinking, avatarState }) => {
  const speaking = isSpeaking || avatarState === 'speaking';
  const listening = isListening || avatarState === 'listening';
  const thinking = isThinking || avatarState === 'thinking';

  // Map state machine booleans to VibraniumCoreSphere heart rates
  let bpm = 72;

  if (speaking) {
    bpm = 108; // Accelerated heartbeat during dialogue
  } else if (listening) {
    bpm = 92; // Attentive heartbeat during listening
  } else if (thinking) {
    bpm = 84; // Controlled computational heartbeat
  }

  return (
    <div className="w-full max-w-[240px]">
      <VibraniumCoreSphere 
        height={220}
        bpm={bpm}
        isSpeaking={speaking}
      />
    </div>
  );
};

export default Avatar3D;
