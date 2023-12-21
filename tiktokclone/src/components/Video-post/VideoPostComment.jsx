import { Link } from 'react-router-dom';
import { formatDraftText } from '../../lib/draft-utils';

export default function VideoPostComment({ comment }) {
  return (
    <div className='vp-comment-container'>
      <div className='vp-comment-wrapper'>
        <Link to={`/${comment.user.username}`} className='vp-comment-link'>
          <img
            src={comment.user.photoURL}
            alt={comment.user.username}
            className='vp-comment-avatar'
          />
        </Link>
        <div className='vp-comment-content'>
          <Link to={`/${comment.user.username}`} className='vp-comment-link'>
            <span className='vp-comment-username'>{comment.user.username}</span>
          </Link>
          <p className='vp-comment-text-container'>
            <span
              className='vp-comment-text'
              dangerouslySetInnerHTML={{
                __html: formatDraftText(comment.text),
              }}
            />
          </p>
        </div>
      </div>
    </div>
  );
}
