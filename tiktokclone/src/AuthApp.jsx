import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Feed from './pages/Feed';
import Upload from './pages/Upload';
import VideoPost from './pages/VideoPost';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

export default function AuthApp() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Feed />} />
        <Route path='/upload' element={<Upload />} />
        <Route path='/:username/video/:postId' element={<VideoPost />} />
        <Route path='/:username' element={<Profile />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
}
