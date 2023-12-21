import Sidebar from '../components/Sidebar';
import FeedList from '../components/FeedList';
import FollowingPosts from '../components/FollowingPosts';

export default function Feed() {
  return (
    <div className='feed-container'>
      <Sidebar />
      <FollowingPosts />
    </div>
  );
}
