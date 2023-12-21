import { useEffect, useRef } from 'react';
import useVideo from '../hooks/useVideo';
import MuteButton from './MuteButton';
import PauseButton from './PauseButton';
import LikeButton from './LikeButton';
import MessagesButton from './MessagesButton';
import ShareButton from './ShareButton';
import { Link } from 'react-router-dom';
import FollowButton from './FollowButton';
import { formatDraftText } from '../lib/draft-utils';
import MusicIcon from '../icons/MusicIcon';

export default function FeedItem({ post }) {
  return (
    <div className='fi-container'>
      <UserLink user={post.user} />
      <PostInfo post={post} />
      <FeedItemVideo post={post} />
    </div>
  );
}

function UserLink({ user }) {
  const userLink = `/${user.username}`;
  return (
    <Link to={userLink} className='fi-avatar-link'>
      <span className='fi-avatar'>
        <img src={user.photoURL} alt={user.username} />
      </span>
    </Link>
  );
}

function PostInfo({ post }) {
  return (
    <div className='fi-info'>
      <AuthorInfo user={post.user} />
      <Caption caption={post.caption} />
      <FollowButton post={post} />
      <MusicInfo audioName={post.audio_name} />
    </div>
  );
}

function AuthorInfo({ user }) {
  const userLink = `/${user.username}`;
  return (
    <div className='fi-author'>
      <Link to={userLink}>
        <h3 className='fi-username'>{user.username}</h3>
      </Link>
      <Link to={userLink}>
        <h4 className='fi-displayName'>{user.displayName}</h4>
      </Link>
    </div>
  );
}

function Caption({ caption }) {
  return (
    <div
      className='fi-caption'
      dangerouslySetInnerHTML={{ __html: formatDraftText(caption) }}
    />
  );
}

function MusicInfo({ audioName }) {
  return (
    <div className='fi-music-container'>
      <h4>
        <div className='fi-music'>
          <MusicIcon />
          {audioName}
        </div>
      </h4>
    </div>
  );
}

function FeedItemVideo({ post }) {
  const videoRef = useRef();
  const { setPlaying } = useVideo(videoRef);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play();
            setPlaying(true);
          } else {
            videoRef.current?.pause();
            setPlaying(false);
          }
        });
      },
      { rootMargin: '0px', threshold: [0.9, 1] }
    );

    observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, [videoRef, setPlaying]);

  return (
    <div className='fiv-container'>
      <VideoWrapper videoRef={videoRef} post={post} />
      <ActionBar post={post} />
    </div>
  );
}

function VideoWrapper({ videoRef, post }) {
  const { isPlaying, togglePlay, isMuted, toggleMute } = useVideo(videoRef);

  return (
    <div className='fiv-wrapper'>
      <div className='fiv-inner'>
        <div className='fiv-video-container'>
          <video
            ref={videoRef}
            src={post.videoUrl}
            playsInline
            loop
            muted={isMuted}
            className='fiv-video'
          />
          <MuteButton toggleMute={toggleMute} isMuted={isMuted} />
          <PauseButton isPlaying={isPlaying} togglePlay={togglePlay} />
        </div>
      </div>
    </div>
  );
}

function ActionBar({ post }) {
  return (
    <div className='fiv-action-bar'>
      <LikeButton post={post} />
      <MessagesButton post={post} />
      <ShareButton />
    </div>
  );
}
