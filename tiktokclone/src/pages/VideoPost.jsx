import { EditorState } from 'draft-js';
import {
  addDoc,
  collection,
  collectionGroup,
  limit,
  onSnapshot,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DraftEditor from '../components/DraftEditor';
import FollowButton from '../components/FollowButton';
import LikeButton from '../components/LikeButton';
import Loader from '../components/Loader';
import MessagesButton from '../components/MessagesButton';
import VideoPostPlayer from '../components/Video-post/VideoPostPlayer';
import { useAuthUser } from '../context/userContext';
import MusicIcon from '../icons/MusicIcon';
import { formatDraftText } from '../lib/draft-utils';
import db from '../lib/firebase';
import VideoPostCommentForm from '../components/Video-post/VideoPostCommentForm';
import VideoPostComments from '../components/Video-post/VideoPostComments';
import VideoPostInfo from '../components/Video-post/VideoPostInfo';

export default function VideoPost() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create a query to get the post by id
    const postQuery = collectionGroup(
      db,
      'posts',
      where('postId', '==', postId),
      limit(1)
    );
    // Subscribe to the query results using the onSnapshot function
    const unsubscribe = onSnapshot(postQuery, (querySnapshot) => {
      // Get the post data from the query snapshot
      const postDoc = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ref: doc.ref,
        ...doc.data(),
      }));
      const post = postDoc?.[0];
      // Update the state with the post data
      setPost(post);
      setLoading(false);
    });
    // Return a function to unsubscribe from the query when the component unmounts
    return () => unsubscribe();
  }, [postId]);

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
