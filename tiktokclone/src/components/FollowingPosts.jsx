import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  startAfter,
  limit,
} from 'firebase/firestore';
import FeedFollowingPosts from './FeedFollowingPosts';
import db from '../lib/firebase';
import { useAuthUser } from '../context/userContext';

const PAGE_SIZE = 10; // Replace with your desired page size

export default function FollowingPosts() {
  const [posts, setPosts] = useState([]);
  const [lastVisiblePost, setLastVisiblePost] = useState(null);
  const signedInUser = useAuthUser();

  useEffect(() => {
    const fetchData = async () => {
      if (!signedInUser || !signedInUser.uid) {
        console.error('Invalid user object.');
        return;
      }

      try {
        const followingUserIds = await getFollowingUserIds(signedInUser);

        if (!Array.isArray(followingUserIds) || followingUserIds.length === 0) {
          console.warn('No valid user IDs for following users.');
          return;
        }

        const followingQuery = query(
          collection(db, 'posts'),
          where('userId', 'in', followingUserIds),
          orderBy('timestamp', 'desc'),
          limit(PAGE_SIZE),
          lastVisiblePost && startAfter(lastVisiblePost.timestamp)
        );

        const querySnapshot = await getDocs(followingQuery);

        const newPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ref: doc.ref,
          timestamp: doc.data().timestamp,
          ...doc.data(),
        }));

        setPosts((prevPosts) => [...prevPosts, ...newPosts]);

        const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastVisiblePost(
          lastDoc && { id: lastDoc.id, timestamp: lastDoc.data().timestamp }
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [signedInUser, lastVisiblePost]);

  const getFollowingUserIds = async (user) => {
    try {
      if (!user || !user.uid) {
        console.error('Invalid user object.');
        return [];
      }

      const followingQuery = query(
        collection(db, 'users', user.uid, 'following')
      );
      const querySnapshot = await getDocs(followingQuery);

      if (!querySnapshot || !querySnapshot.docs) {
        console.error('No valid querySnapshot for following users.');
        return [];
      }

      return querySnapshot.docs.map((doc) => doc.id);
    } catch (error) {
      console.error('Error fetching following users:', error.message);
      return [];
    }
  };

  return (
    <div className='feed-item-container'>
      <div className='feed-item-inner'>
        {posts.map((post) => (
          <FeedFollowingPosts
            key={post.id}
            post={post}
            timestamp={post.timestamp}
          />
        ))}
      </div>
    </div>
  );
}
