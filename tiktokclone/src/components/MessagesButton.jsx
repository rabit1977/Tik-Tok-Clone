import { collection, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import MessagesIcon from '../icons/MessageIcon';

import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useTransition, useDeferredValue, Suspense } from 'react';
import db from '../lib/firebase';

export default function MessagesButton({ post }) {
  // Create a reference to the comments collection
  const commentsRef = collection(db, 'comments');
  // Create a query to get the comments for the post
  const commentsQuery = query(commentsRef, where('postId', '==', post.id));
  // Use the useCollectionData hook to listen to the query results
  const [comments] = useCollectionData(commentsQuery);

  // Use the useTransition hook to mark the state update as transitional
  const [startTransition, isPending] = useTransition();

  // Use the useDeferredValue hook to create a deferred version of the comments data
  const deferredComments = useDeferredValue(comments, { timeoutMs: 3000 });

  // Define a function to handle the click event on the messages button
  const handleClick = () => {
    // Start a transition to update the state and navigate to the video page
    startTransition(() => {
      // Update the state with the post id
      setState((prevState) => ({
        ...prevState,
        postId: post.id,
      }));
      // Navigate to the video page
      navigate(`/${post.user.username}/video/${post.id}`);
    });
  };

  return (
    // Use the Suspense component to provide a fallback UI while the comments data is loading
    <Suspense fallback={<div>Loading...</div>}>
      <Link
        to={`/${post.user.username}/video/${post.id}`}
        className='messages-button'
        onClick={handleClick}
      >
        <MessagesIcon />
        <strong className='messages-button-count'>
          {deferredComments?.length}
        </strong>
        {/* // Show a loading indicator if the transition is pending */}
        {isPending && <span>Loading...</span>}
      </Link>
    </Suspense>
  );
}
