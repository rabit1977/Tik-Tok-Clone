import { Link } from 'react-router-dom';
import MusicIcon from '../../icons/MusicIcon';
import { formatDraftText } from '../../lib/draft-utils';
import FollowButton from '../FollowButton';
import LikeButton from '../LikeButton';
import MessagesButton from '../MessagesButton';

export default function VideoPostInfo({ post }) {
  function datePosted() {
    const date = new Date(post.timestamp.toDate().toString());
    const month = date.getMonth();
    const day = date.getDay();
    return `${month}-${day}`;
  }

  return (
    <>
      <div className='vp-info-container'>
        <div className='vp-info-wrapper'>
          <Link to={`/${post.user.username}`} className='vp-info-avatar-link'>
            <img
              src={post.user.photoURL}
              alt={post.user.username}
              className='vp-info-avatar'
            />
          </Link>
          <div className='vp-info-user'>
            <Link to={`/${post.user.username}`}>
              <h2 className='vp-info-username'>{post.user.username}</h2>
            </Link>
            <Link to={`/${post.user.username}`}>
              <h2 className='vp-info-displayName'>
                {post.user.displayName}
                <span className='vp-info-divider'> · </span>
                {datePosted()}
              </h2>
            </Link>
          </div>
          <FollowButton post={post} />
        </div>
      </div>
      <div className='vp-info-caption-container'>
        <h1
          className='vp-info-caption'
          dangerouslySetInnerHTML={{ __html: formatDraftText(post.caption) }}
        />
        <h2 className='vp-info-music'>
          <MusicIcon />
          {post.audio_name}
        </h2>
        <div className='vp-info-action-container'>
          <div className='vp-info-action-wrapper'>
            <div className='vp-info-action'>
              <LikeButton post={post} />
            </div>
            <div className='vp-info-action'>
              <MessagesButton post={post} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
