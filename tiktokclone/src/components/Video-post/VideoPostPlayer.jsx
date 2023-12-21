import { useTransition } from 'react';
import useVideo from '../../hooks/useVideo';
import { useNavigate } from 'react-router-dom';
import VolumeOffIcon from '../../icons/VolumeOffIcon';
import VolumeIcon from '../../icons/VolumeIcon';
import CloseIcon from '../../icons/CloseIcon';
import Loader from '../Loader';

export default function VideoPostPlayer({ post }) {
  const navigate = useNavigate();
  const { videoRef, isMuted, toggleMute } = useVideo();

  // Use the useTransition hook to mark the state update as transitional
  const [startTransition, isPending] = useTransition();

  // Define a function to handle the click event on the close icon
  const handleClick = () => {
    // Start a transition to update the state and navigate to the previous page
    startTransition(() => {
      navigate(-1);
    });
  };

  return (
    <div className='vp-player-container'>
      <div className='vp-player-wrapper'>
        <video
          ref={videoRef}
          src={post.videoUrl}
          muted={isMuted}
          autoPlay
          loop
          className='vp-player'
        ></video>
      </div>
      <CloseIcon onClick={handleClick} />
      // Show a loading indicator if the transition is pending
      {isPending && <Loader />}
      {isMuted ? (
        <VolumeOffIcon onClick={toggleMute} />
      ) : (
        <VolumeIcon onClick={toggleMute} />
      )}
    </div>
  );
}
