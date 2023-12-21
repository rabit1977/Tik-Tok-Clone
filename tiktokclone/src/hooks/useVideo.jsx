import { useRef, useState, useCallback } from 'react';

export default function useVideo() {
  const videoRef = useRef();
  const [isPlaying, setPlaying] = useState(false);
  const [isMuted, setMuted] = useState(true);

  const toggleMute = useCallback(() => setMuted((prev) => !prev), []);

  const togglePlay = useCallback(
    (event) => {
      event.stopPropagation();
      if (isPlaying) {
        videoRef.current?.pause();
        setPlaying(false);
      } else {
        videoRef.current?.play();
        setPlaying(true);
      }
    },
    [isPlaying]
  );

  return { videoRef, isPlaying, isMuted, setPlaying, togglePlay, toggleMute };
}
