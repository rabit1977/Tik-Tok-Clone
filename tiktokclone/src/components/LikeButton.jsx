import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { increment } from '../lib/firebase';
import db from '../lib/firebase';
import { useAuthUser } from '../context/userContext';

import GrayLikeIcon from '../icons/GrayLikeIcon';
import RedLikeIcon from '../icons/RedLikeIcon';

function LikeButton({ post }) {
  const { user } = useAuthUser();
  const likeRef =
    user && post ? doc(db, `posts/${post.id}/likes/${user.uid}`) : null;
  console.log('likeRef', likeRef);
  const checkLike = async () => {
    try {
      const likeDoc = await getDoc(likeRef);
      return likeDoc.exists();
    } catch (error) {
      console.error('Error checking like status', error);
      return false;
    }
  };

  const addLike = async () => {
    try {
      await setDoc(likeRef, { uid: user.uid });
      await post.ref.update({ likeCount: increment(1) });
    } catch (error) {
      console.error('Error adding like', error);
    }
  };

  const removeLike = async () => {
    if (likeRef) {
      try {
        await deleteDoc(likeRef);
        await post.ref.update({ likeCount: increment(-1) });
      } catch (error) {
        console.error('Error removing like', error);
      }
    } else {
      console.warn('likeRef is null. Unable to remove like.');
    }
  };

  return (
    <button className='like-button'>
      {checkLike() ? (
        <RedLikeIcon onClick={removeLike} />
      ) : (
        <GrayLikeIcon onClick={addLike} />
      )}
      <strong className='like-button-count'>{post.likeCount}</strong>
    </button>
  );
}

export default LikeButton;
