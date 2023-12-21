import React, { useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import FollowButton from '../components/FollowButton';
import LikeButton from '../components/LikeButton';
import MessagesButton from '../components/MessagesButton';
import MuteButton from '../components/MuteButton';
import PauseButton from '../components/PauseButton';
import ShareButton from '../components/ShareButton';
import useVideo from '../hooks/useVideo';
import MusicIcon from '../icons/MusicIcon';
import { formatDraftText } from '../lib/draft-utils';
import { formatTimestamp } from '../lib/utils';
import useVideoPlayer from '../hooks/useVideoPlayer';

const FeedItem = React.memo(({ post, timestamp }) => {
  const {
    username,
    displayName,
    photoURL,
    caption,
    audio_name,
    videoUrl,
    createdAt,
    user,
  } = post;

  return (
    <div className='fi-container'>
      <Link to={`/${user.username}`} className='fi-avatar-link'>
        <span className='fi-avatar'>
          <img src={user.photoURL} alt={user.username} />
        </span>
      </Link>
      <div className='fi-info'>
        <div className='fi-author'>
          <Link to={`/${user.username}`}>
            <h3 className='fi-username'>{user.username}</h3>
          </Link>
          <Link to={`/${user.username}`}>
            <h4 className='fi-displayName'>{user.displayName}</h4>
          </Link>
        </div>
        <div
          className='fi-caption'
          dangerouslySetInnerHTML={{ __html: formatDraftText(caption) }}
        />
        {timestamp && <div>{formatTimestamp(timestamp)}</div>}
        <div>{createdAt}</div>
        <FollowButton post={post} />
        <div className='fi-music-container'>
          <h4>
            <div className='fi-music'>
              <MusicIcon />
              {audio_name}
            </div>
          </h4>
        </div>
        <FeedItemVideo post={post} />
      </div>
    </div>
  );
});
export default FeedItem;

function FeedItemVideo({ post }) {
  const { videoRef, isPlaying, isMuted, togglePlay, toggleMute } =
    useVideoPlayer(post.videoUrl);

  return (
    <div className='fiv-container'>
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
      <div className='fiv-action-bar'>
        <LikeButton post={post} />
        <MessagesButton post={post} />
        <ShareButton />
      </div>
    </div>
  );
}
