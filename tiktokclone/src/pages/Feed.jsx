import { collectionGroup, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import FeedItem from '../components/FeedItem';
import Sidebar from '../components/Sidebar';
import db from '../lib/firebase';

export default function Feed() {
  return (
    <div className='feed-container'>
      <Sidebar />
      <FeedList />
    </div>
  );
}

function FeedList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collectionGroup(db, 'posts'));
        console.log(querySnapshot);
        const postData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ref: doc.ref,
          ...doc.data(),
        }));
        setPosts(postData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className='feed-item-container'>
      <div className='feed-item-inner'>
        {posts.map((post) => (
          <FeedItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
