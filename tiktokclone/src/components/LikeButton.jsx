// Import the increment function from "firebase/firestore"
import {
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  increment,
  onSnapshot,
} from 'firebase/firestore';
// Remove the import from "../lib/firebase"
// import { increment } from "../lib/firebase";
import db from '../lib/firebase';
import { useAuthUser } from '../context/userContext';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import GrayLikeIcon from '../icons/GrayLikeIcon';
import RedLikeIcon from '../icons/RedLikeIcon';
import React, { useCallback, useEffect, useState } from 'react';

export default function LikeButton({ post }) {
  const [user] = useAuthUser();
  const [likeDoc, setLikeDoc] = useState(null); // Use a local state to store the like document
  const likeRef = doc(db, `likes/${post.id}_${user.uid}`);
  const likedPostsRef = doc(db, `likedPosts/${user.uid}`);

  useEffect(() => {
    // Listen for changes in the like document
    const unsubscribe = onSnapshot(likeRef, (doc) => {
      // Set the state with the new data
      setLikeDoc(doc.data());
    });
    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [likeRef]);

  const addLike = useCallback(async () => {
    // Use the increment function from "firebase/firestore"
    await updateDoc(post.ref, { likeCount: increment(1) });
    await setDoc(likeRef, { uid: user.uid });
    await setDoc(likedPostsRef, { [post.id]: true }, { merge: true });
  }, [post, likeRef, likedPostsRef, user]);

  const removeLike = useCallback(async () => {
    // Use the increment function from "firebase/firestore"
    await updateDoc(post.ref, { likeCount: increment(-1) });
    await deleteDoc(likeRef);
    await updateDoc(likedPostsRef, { [post.id]: false });
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
}
