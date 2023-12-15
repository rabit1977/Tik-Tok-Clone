import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { increment } from '../lib/firebase';
import db from '../lib/firebase';
import { useAuthUser } from '../context/userContext';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import GrayLikeIcon from '../icons/GrayLikeIcon';
import RedLikeIcon from '../icons/RedLikeIcon';
import React, { useCallback } from 'react';

export default React.memo(function LikeButton({ post }) {
  const [user] = useAuthUser();
  const likeRef = doc(db, `likes/${post.id}_${user.uid}`); // Adjusted document reference construction
  const [likeDoc] = useDocumentData(likeRef);
  const likedPostsRef = doc(db, `likedPosts/${user.uid}`); // Adjusted document reference construction

  const addLike = useCallback(async () => {
    await updateDoc(post.ref, { likeCount: increment(1) });
    await setDoc(likeRef, { uid: user.uid });
    await setDoc(likedPostsRef, { [post.id]: true }, { merge: true }); // Adjusted setDoc for likedPosts
  }, [post, likeRef, likedPostsRef, user]);

  const removeLike = useCallback(async () => {
    await updateDoc(post.ref, { likeCount: increment(-1) });
    await deleteDoc(likeRef);
    await updateDoc(likedPostsRef, { [post.id]: false }); // Adjusted updateDoc for likedPosts
  }, [post, likeRef, likedPostsRef]);

  return (
    <button className='like-button'>
      {likeDoc ? (
        <RedLikeIcon onClick={removeLike} />
      ) : (
        <GrayLikeIcon onClick={addLike} />
      )}
      <strong className='like-button-count'>{post.likeCount}</strong>
    </button>
  );
});
