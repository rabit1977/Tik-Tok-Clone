import { useEffect, useState } from 'react';
import db from '../lib/firebase';
import { getDoc, setDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuthUser } from '../context/userContext';
import { useDocumentData } from 'react-firebase-hooks/firestore';

export default function FollowButton({ post }) {
  const [user] = useAuthUser();
  const followingRef = doc(db, 'users', user.uid, 'following', post.user.uid);

  const followerRef = doc(db, 'users', post.user.uid, 'followers', user.uid);
  const [followingDoc] = useDocumentData(followingRef);

  const isCurrentUser = user.uid === post.user.uid;

  async function addFollow() {
    await setDoc(followingRef, post.user);
    await setDoc(followerRef, user);
  }

  async function removeFollow() {
    await deleteDoc(followingRef);
    await deleteDoc(followerRef);
  }

  return (
    <div className='fb-container'>
      <div className='fb-wrapper'>
        {!isCurrentUser ? (
          // Only render the button if the user is not the signed-in user
          <>
            {followingDoc ? (
              <button className='ufb' onClick={removeFollow}>
                Unfollow
              </button>
            ) : (
              <button className='fb' onClick={addFollow}>
                Follow
              </button>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
