import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import MessagesIcon from '../icons/MessageIcon'; // Replace with the actual import path

import db from '../lib/firebase';
import { useEffect, useState } from 'react';

export default function MessagesButton({ post }) {
  const fetchComments = async () => {
    try {
      const commentsSnapshot = await getDocs(
        collection(db, `posts/${post.id}/comments`)
      );
      return commentsSnapshot.docs.map((doc) => doc.data());
    } catch (error) {
      console.error('Error fetching comments', error);
      return [];
    }
  };

  const [comments, setComments] = useState([]);

  useEffect(() => {
    const loadComments = async () => {
      const fetchedComments = await fetchComments();
      setComments(fetchedComments);
    };

    loadComments();
  }, [post.id]);

  return (
    <Link
      to={`/${post.user.username}/video/${post.id}`}
      className='messages-button'
    >
      <MessagesIcon />
      <strong className='messages-button-count'>{comments.length}</strong>
    </Link>
  );
}
