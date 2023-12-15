import { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  limit,
  collectionGroup,
  doc,
  setDoc,
} from 'firebase/firestore';
import { EditorState, convertToRaw } from 'draft-js';
import { useNavigate, useParams, Link } from 'react-router-dom';
import DraftEditor from '../components/DraftEditor';
import FollowButton from '../components/FollowButton';
import LikeButton from '../components/LikeButton';
import Loader from '../components/Loader';
import MessagesButton from '../components/MessagesButton';
import { useAuthUser } from '../context/userContext';
import useVideo from '../hooks/useVideo';
import CloseIcon from '../icons/CloseIcon';
import MusicIcon from '../icons/MusicIcon';
import VolumeIcon from '../icons/VolumeIcon';
import VolumeOffIcon from '../icons/VolumeOffIcon';
import { formatDraftText } from '../lib/draft-utils';
import db from '../lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function VideoPost() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [postsCol, loading] = useCollection(
    collectionGroup(db, 'posts'),
    where('postId', '==', postId),
    limit(1)
  );
  const postDoc = postsCol?.docs.map((doc) => ({
    id: doc.id,
    ref: doc.ref,
    ...doc.data(),
  }));
  const post = postDoc?.[0];

  useEffect(() => {
    if (!loading && !post) {
      // If post is not found, navigate to a 404 page or handle accordingly
      navigate('/404');
    }
  }, [loading, post, navigate]);

  if (loading || !post) return <Loader />;

  return (
    <div className='vp-container'>
      <VideoPostPlayer post={post} />
      <div className='vp-container-right'>
        <VideoPostInfo post={post} />
        <VideoPostComments post={post} />
        <VideoPostCommentForm post={post} />
      </div>
    </div>
  );
}

function VideoPostPlayer({ post }) {
  const navigate = useNavigate();
  const { videoRef, isMuted, toggleMute } = useVideo();

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
      <CloseIcon onClick={() => navigate(-1)} />
      {isMuted ? (
        <VolumeOffIcon onClick={toggleMute} />
      ) : (
        <VolumeIcon onClick={toggleMute} />
      )}
    </div>
  );
}

function VideoPostInfo({ post }) {
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

function VideoPostComments({ post }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const commentsQuery = query(collection(post.ref, 'comments'));
      const querySnapshot = await getDocs(commentsQuery);
      const commentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ref: doc.ref,
        ...doc.data(),
      }));
      setComments(commentsData);
    };

    fetchComments();
  }, [post.ref]);

  return (
    <div className='vp-comments-container'>
      <div className='vp-comments'>
        {comments.map((comment) => (
          <VideoPostComment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}

function VideoPostComment({ comment }) {
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

function VideoPostCommentForm({ post }) {
  const [user] = useAuthUser();
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const addComment = async () => {
    const currentContent = editorState.getCurrentContent();
    const commentText = currentContent.getPlainText();

    if (commentText.trim() === '') {
      return;
    }

    const newComment = {
      text: convertToRaw(currentContent),
      user,
      createdAt: serverTimestamp(),
    };

    try {
      // Use addDoc instead of setDoc for adding a document to a collection
      await addDoc(collection(db, 'posts', post.id, 'comments'), newComment);
      setEditorState(EditorState.createEmpty());
    } catch (error) {
      console.error('Error adding comment:', error.message);
    }
  };

  return (
    <div className='vp-comment-form-container'>
      <div className='vp-comment-form-wrapper'>
        <DraftEditor
          editorState={editorState}
          setEditorState={setEditorState}
          onInputChange={addComment}
          maxLength={150}
        />
        <button onClick={addComment} className='vp-comment-form-submit'>
          Post
        </button>
      </div>
    </div>
  );
}