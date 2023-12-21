import { useEffect, useRef, useState } from 'react';

const useVideoPlayer = (videoUrl) => {
  const videoRef = useRef(null);
  const [isPlaying, setPlaying] = useState(false);
  const [isMuted, setMuted] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!isPlaying);
  };

  const toggleMute = () => {
    videoRef.current.muted = !isMuted;
    setMuted(!isMuted);
  };

  useEffect(() => {
    const options = {
      rootMargin: '0px',
      threshold: [0.9, 1],
    };

    function playVideo(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoRef.current.play();
          setPlaying(true);
        } else {
          videoRef.current.pause();
          setPlaying(false);
        }
      });
    }

    const observer = new IntersectionObserver(playVideo, options);

    observer.observe(videoRef.current);

    return () => {
      observer.disconnect();
    };
  }, [videoUrl]);

  return { videoRef, isPlaying, isMuted, togglePlay, toggleMute };
};

export default useVideoPlayer;
