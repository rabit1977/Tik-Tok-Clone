import { useEffect, useState } from 'react';
import db from '../lib/firebase';
import { getDoc, setDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuthUser } from '../context/userContext';

export default function FollowButton({ post }) {
  const [user] = useAuthUser();
  const followingRef = doc(db, 'users', user.uid, 'following', post.user.uid);
  const followerRef = doc(db, 'users', post.user.uid, 'followers', user.uid);
  const [followingDoc, setFollowingDoc] = useState(null);

  useEffect(() => {
    const fetchFollowingDoc = async () => {
      try {
        const docSnapshot = await getDoc(followingRef);
        setFollowingDoc(docSnapshot.exists() ? docSnapshot.data() : null);
      } catch (error) {
        console.error('Error fetching following document', error);
      }
    };

    fetchFollowingDoc();
  }, [followingRef]);

  const addFollow = async () => {
    try {
      await setDoc(followingRef, post.user);
      await setDoc(followerRef, user);
    } catch (error) {
      console.error('Error adding follow', error);
    }
  };

  const removeFollow = async () => {
    try {
      await deleteDoc(followingRef);
      await deleteDoc(followerRef);
    } catch (error) {
      console.error('Error removing follow', error);
    }
  };

  return (
    <div className='fb-container'>
      <div className='fb-wrapper'>
        {followingDoc ? (
          <button className='ufb' onClick={removeFollow}>
            Unfollow
          </button>
        ) : (
          <button className='fb' onClick={addFollow}>
            Follow
          </button>
        )}
      </div>
    </div>
  );
}
