import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { useAuthUser } from '../context/userContext';
import FollowingIcon from '../icons/FollowingIcon';
import ForYouIcon from '../icons/ForYouIcon';
import LiveIcon from '../icons/LiveIcon';
import db from '../lib/firebase';
import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import TooltipLink from '../lib/tooltip';

export default function Sidebar() {
  return (
    <div className='sb-container'>
      <div className='sb-wrapper'>
        <div className='sb-inner'>
          <SidebarLinks />
          <SidebarSuggested />
          <SidebarFollowing />
        </div>
      </div>
    </div>
  );
}

function SidebarLinks() {
  return (
    <div className='sb-links-container'>
      <TooltipLink
        to='/'
        icon={<ForYouIcon />}
        text='For You'
        tooltipText='For You'
      />
      <TooltipLink
        to='/following'
        icon={<FollowingIcon />}
        text='Following'
        tooltipText='Following'
      />

      {/* <Link to='/following' className='sb-links-wrapper'>
        <FollowingIcon />
        <h2 className='sb-links-text'>Following</h2>
      </Link> */}
      <Link className='sb-links-wrapper'>
        <LiveIcon />
        <h2 className='sb-links-text'>LIVE</h2>
      </Link>
    </div>
  );
}

async function fetchSuggestedUsers(user) {
  const suggestedColRef = collection(db, 'users');
  const suggestedQuery = query(
    suggestedColRef,
    where('uid', '!=', user?.uid),
    limit(5)
  );
  const suggestedSnapshot = await getDocs(suggestedQuery);
  return suggestedSnapshot.docs.map((doc) => ({
    id: doc.id,
    ref: doc.ref,
    ...doc.data(),
  }));
}

async function fetchFollowingUsers(user) {
  if (!user) return [];

  try {
    const followingColRef = collection(db, 'users', user.uid, 'following');
    const followingSnapshot = await getDocs(followingColRef);
    return followingSnapshot.docs.map((doc) => ({
      id: doc.id,
      ref: doc.ref,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching following users:', error.message);
    return [];
  }
}

function SidebarSuggested() {
  const [user] = useAuthUser();

  // Use async function to fetch data
  const fetchSuggested = async () => {
    const suggested = await fetchSuggestedUsers(user);
    return suggested;
  };

  // Fetch suggested users when the component mounts
  const [suggested, setSuggested] = React.useState([]);
  React.useEffect(() => {
    fetchSuggested().then((suggested) => setSuggested(suggested));
  }, [user]);

  if (suggested.length === 0) return null;

  return (
    <div className='sb-suggested'>
      <p className='sb-suggested-title'>Suggested accounts</p>
      <div className='sb-suggested-list'>
        {suggested.map((user) => (
          <SidebarItem key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

function SidebarFollowing() {
  const [user] = useAuthUser();

  // Use async function to fetch data
  const fetchFollowing = async () => {
    const following = await fetchFollowingUsers(user);
    return following;
  };

  // Fetch following users when the component mounts
  const [following, setFollowing] = React.useState([]);
  React.useEffect(() => {
    fetchFollowing()
      .then((following) => setFollowing(following))
      .catch((error) =>
        console.error('Error fetching following users:', error.message)
      );
  }, [user]);

  if (following.length === 0) return null;

  return (
    <div className='sb-suggested'>
      <p className='sb-suggested-title'>Following</p>
      <div className='sb-suggested-list'>
        {following.map((user) => (
          <SidebarItem key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

function SidebarItem({ user }) {
  return (
    <Link to={`/${user.username}`} className='sb-item-link'>
      <div className='sb-item-avatar-container'>
        <span className='sb-item-avatar-wrapper'>
          <img
            src={user.photoURL}
            alt={user.username}
            className='sb-item-avatar'
          />
        </span>
      </div>
      <div className='sb-item-info'>
        <div className='sb-item-username-wrapper'>
          <h4 className='sb-item-username'>{user.username}</h4>
        </div>
        <p className='sb-item-displayName'>{user.displayName}</p>
      </div>
    </Link>
  );
}
