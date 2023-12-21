import Sidebar from '../components/Sidebar';
import FeedList from '../components/FeedList';

export default function Feed() {
  return (
    <div className='feed-container'>
      <Sidebar />
      <FeedList />
    </div>
  );
}
