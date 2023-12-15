import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useParams, Link } from 'react-router-dom';
import FollowButton from '../components/FollowButton';
import Loader from '../components/Loader';
import Sidebar from '../components/Sidebar';
import useVideo from '../hooks/useVideo';
import HeartIcon from '../icons/HeartIcon';
import db from '../lib/firebase';
import NotFound from '../pages/NotFound';

export default function Profile() {
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [userDoc, setUserDoc] = useState(null);

  const fetchUser = async () => {
    const usersRef = collection(db, 'users');
    const userQuery = query(usersRef, where('username', '==', username));
  
    try {
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const userId = querySnapshot.docs[0].id;
  
        // Fetch posts for the user
        const postsQuery = query(collection(db, 'users', userId, 'posts'));
        const postsSnapshot = await getDocs(postsQuery);
        const userPosts = postsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        // Fetch following and followers counts
        const followingQuery = query(collection(db, 'users', userId, 'following'));
        const followersQuery = query(collection(db, 'users', userId, 'followers'));
        const followingSnapshot = await getDocs(followingQuery);
        const followersSnapshot = await getDocs(followersQuery);
  
        const userFollowingCount = followingSnapshot.size;
        const userFollowersCount = followersSnapshot.size;
  
        setUserDoc({
          id: userId,
          ref: querySnapshot.docs[0].ref,
          ...userData,
          posts: userPosts,
          followingCount: userFollowingCount,
          followersCount: userFollowersCount,
        });
      } else {
        setUserDoc(null);
      }
    } catch (error) {
      console.error('Error fetching user', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [username]);

  if (loading) return <Loader />;
  if (!loading && !userDoc) return <NotFound />;

  return (
    <div className='p-container'>
      <Sidebar />
      <div className='p-wrapper'>
        <div className='p-inner'>
          <ProfileHeader profile={userDoc} />
          <ProfileTabs profile={userDoc} />
        </div>
      </div>
    </div>
  );
}

function ProfileHeader({ profile }) {
  return (
    <header className='p-header-container'>
      <div className='p-header-wrapper'>
        <div className='p-header-avatar-container'>
          <img
            src={profile.photoURL}
            alt={profile.username}
            className='p-header-avatar'
          />
        </div>
        <div className='p-header-user-info'>
          <h2 className='p-header-username'>{profile.username}</h2>
          <h1 className='p-header-displayName'>{profile.displayName}</h1>
          <div className='p-header-follow-container'>
            <div className='p-header-follow-wrapper'>
              <FollowButton post={{ user: profile }} />
            </div>
          </div>
        </div>
      </div>
      <section className='p-header-user-data'>
        <div className='p-header-data-column'>
          <strong>{profile.followingCount}</strong>
          <span className='p-header-data-title'>Following</span>
        </div>
        <div className='p-header-data-column'>
          <strong>{profile.followersCount}</strong>
          <span className='p-header-data-title'>Followers</span>
        </div>
      </section>
    </header>
  );
}

function ProfileTabs({ profile }) {
  const [isVideosActive, setVideosActive] = useState(true);

  return (
    <div className='p-tabs-container'>
      <div className='p-tabs-wrapper'>{/* ... (unchanged) */}</div>
      <div className='p-tabs-posts-container'>
        {isVideosActive && profile.posts ? (
          profile.posts.map((post) => (
            <ProfileVideoPost key={post.id} post={post} />
          ))
        ) : !isVideosActive && profile.likedPosts ? (
          profile.likedPosts.map((post) => (
            <ProfileVideoPost key={post.id} post={post} />
          ))
        ) : (
          <p>No posts to display</p>
        )}
      </div>
    </div>
  );
}

function ProfileVideoPost({ post }) {
  const { videoRef, togglePlay } = useVideo();

  return (
    <div className='p-video-post-container'>
      <div className='p-video-post-wrapper'>
        <div className='p-video-post-ratio'>
          <div className='p-video-post-inner'>
            <Link
              onMouseEnter={togglePlay}
              onMouseLeave={togglePlay}
              to={`/${post.user.username}/video/${post.postId}`}
              className='p-video-post-link'
            >
              <div className='p-video-post-card-container'>
                <div className='p-video-post-card'>
                  <video
                    src={post.videoUrl}
                    muted
                    loop
                    ref={videoRef}
                    className='p-video-post-player'
                  ></video>
                  <div className='p-video-post-mask'>
                    <div className='p-video-post-footer'>
                      <div className='p-video-post-like-container'>
                        <HeartIcon />
                        <strong className='p-video-post-like-count'>
                          {post.likeCount}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
