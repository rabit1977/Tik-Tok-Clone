import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import VideoPostComment from './VideoPostComment';

export default function VideoPostComments({ post }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Create a query to get the comments for the post
    const commentsQuery = collection(post.ref, 'comments');
    // Subscribe to the query results using the onSnapshot function
    const unsubscribe = onSnapshot(commentsQuery, (querySnapshot) => {
      // Get the comments data from the query snapshot
      const commentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ref: doc.ref,
        ...doc.data(),
      }));
      // Update the state with the comments data
      setComments(commentsData);
    });
    // Return a function to unsubscribe from the query when the component unmounts
    return () => unsubscribe();
  }, [post.ref]);

  return (
    <div className='vp-comments-container'>
      <div className='vp-comments'>
        {comments?.map((comment) => (
          <VideoPostComment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
