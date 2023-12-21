import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Header from './components/Header';
import Feed from './pages/Feeds';
import FollowingPage from './pages/FollowingPage';
import Profile from './pages/Profile';
import Upload from './pages/Upload';
import VideoPost from './pages/VideoPost';

// import NotFound from './pages/NotFound';

export default function AuthApp() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Feed />} />
        <Route path='/upload' element={<Upload />} />
        <Route path='/:username/video/:postId' element={<VideoPost />} />
        <Route path='/:username' element={<Profile />} />
        <Route path='/:username/following' element={<FollowingPage />} />
      </Routes>
    </Router>
  );
}
