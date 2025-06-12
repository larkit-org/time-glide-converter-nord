import { useRef, useCallback } from 'react';

const DEFAULT_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3';

export function useSound(soundUrl: string = DEFAULT_SOUND_URL) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(soundUrl);
    }
    
    // Reset the audio to start
    audioRef.current.currentTime = 0;
    
    // Play the sound
    audioRef.current.play().catch((error) => {
      console.error('Error playing sound:', error);
    });
  }, [soundUrl]);

  return { play };
} 