import { collectionGroup } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import FeedItem from '../components/FeedItem';
import db from '../lib/firebase';

export default function FeedList() {
  const [postsCol] = useCollection(collectionGroup(db, 'posts'));

  const posts = postsCol?.docs.map((doc) => ({
    id: doc.id,
    ref: doc.ref,
    ...doc.data(),
  }));

  return (
    <div className='feed-item-container'>
      <div className='feed-item-inner'>
        {posts?.map((post) => (
          <FeedItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
