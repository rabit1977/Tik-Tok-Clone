import { collection, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import MessagesIcon from '../icons/MessageIcon'; // Replace with the actual import path

import { useCollectionData } from 'react-firebase-hooks/firestore';
import db from '../lib/firebase';
export default function MessagesButton({ post }) {
  // Create a reference to the comments collection
  const commentsRef = collection(db, 'comments');
  // Create a query to get the comments for the post
  const commentsQuery = query(commentsRef, where('postId', '==', post.id));
  // Use the useCollectionData hook to listen to the query results
  const [comments] = useCollectionData(commentsQuery);

  return (
    <Link
      to={`/${post.user.username}/video/${post.id}`}
      className='messages-button'
    >
      <MessagesIcon />
      <strong className='messages-button-count'>{comments?.length}</strong>
    </Link>
  );
}
