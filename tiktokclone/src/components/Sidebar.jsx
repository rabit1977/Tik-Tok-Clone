import {
  collection,
  query,
  where,
  getDocs,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { useAuthUser } from '../context/userContext';
import FollowingIcon from '../icons/FollowingIcon';
import ForYouIcon from '../icons/ForYouIcon';
import LiveIcon from '../icons/LiveIcon';
import db from '../lib/firebase';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import TooltipLink from '../lib/tooltip';

export default function Sidebar() {
  const [user] = useAuthUser();
  const [suggested, setSuggested] = useState([]);
  const [following, setFollowing] = useState([]);

  const fetchSuggested = async () => {
    const suggestedUsers = await fetchSuggestedUsers(user);
    setSuggested(suggestedUsers);
  };

  const fetchFollowing = async () => {
    try {
      const followingUsers = await fetchFollowingUsers(user);

      // Exclude the signed-in user from the list
      const filteredFollowingUsers = followingUsers.filter(
        (followingUser) => followingUser.id !== user.uid
      );

      // Update suggested accounts by removing the followed user
      setSuggested((prevSuggested) =>
        prevSuggested.filter(
          (suggestedUser) =>
            !filteredFollowingUsers.some(
              (followingUser) => followingUser.id === suggestedUser.id
            )
        )
      );

      setFollowing(filteredFollowingUsers);
    } catch (error) {
      console.error('Error fetching following users:', error.message);
    }
  };

  useEffect(() => {
    // Subscribe to real-time updates for following users
    const followingColRef = collection(db, 'users', user.uid, 'following');
    const unsubscribeFollowing = onSnapshot(followingColRef, (snapshot) => {
      const updatedFollowing = snapshot.docs.map((doc) => ({
        id: doc.id,
        ref: doc.ref,
        ...doc.data(),
      }));

      // Exclude the signed-in user from the list
      const filteredFollowingUsers = updatedFollowing.filter(
        (followingUser) => followingUser.id !== user.uid
      );

      // Update suggested accounts by removing the followed user
      setSuggested((prevSuggested) =>
        prevSuggested.filter(
          (suggestedUser) =>
            !filteredFollowingUsers.some(
              (followingUser) => followingUser.id === suggestedUser.id
            )
        )
      );

      setFollowing(filteredFollowingUsers);
    });

    // Fetch suggested accounts only once when the component mounts
    const suggestedColRef = collection(db, 'users');
    const suggestedQuery = query(
      suggestedColRef,
      where('uid', '!=', user?.uid),
      limit(5)
    );
    getDocs(suggestedQuery)
      .then((suggestedSnapshot) => {
        const suggestedUsers = suggestedSnapshot.docs.map((doc) => ({
          id: doc.id,
          ref: doc.ref,
          ...doc.data(),
        }));

        // Exclude the logged-in user from suggested accounts
        const filteredSuggestedUsers = suggestedUsers.filter(
          (suggestedUser) => suggestedUser.id !== user.uid
        );

        // Exclude the users you are following from suggested accounts
        const filteredSuggestedUsersWithoutFollowing =
          filteredSuggestedUsers.filter(
            (suggestedUser) =>
              !following.some(
                (followingUser) => followingUser.id === suggestedUser.id
              )
          );

        setSuggested(filteredSuggestedUsersWithoutFollowing);
      })
      .catch((error) => {
        console.error('Error fetching suggested users:', error.message);
      });

    return () => {
      unsubscribeFollowing();
    };
  }, [user]);

  return (
    <div className='sb-container'>
      <div className='sb-wrapper'>
        <div className='sb-inner'>
          <SidebarLinks />
          {following.length > 0 && (
            <div className='sb-suggested'>
              <p className='sb-suggested-title'>Following</p>
              <div className='sb-suggested-list'>
                {following.map((user) => (
                  <SidebarItem key={user.id} user={user} />
                ))}
              </div>
            </div>
          )}
          {suggested.length > 0 && (
            <div className='sb-suggested'>
              <p className='sb-suggested-title'>Suggested accounts</p>
              <div className='sb-suggested-list'>
                {suggested.map((user) => (
                  <SidebarItem key={user.id} user={user} />
                ))}
              </div>
            </div>
          )}
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
  const [suggested, setSuggested] = useState([]);

  // Use async function to fetch data
  const fetchSuggested = async () => {
    const suggested = await fetchSuggestedUsers(user);
    return suggested;
  };

  // Subscribe to real-time updates for suggested users
  useEffect(() => {
    const suggestedColRef = collection(db, 'users');
    const suggestedQuery = query(
      suggestedColRef,
      where('uid', '!=', user?.uid),
      limit(5)
    );

    const unsubscribe = onSnapshot(suggestedQuery, (snapshot) => {
      const updatedSuggested = snapshot.docs.map((doc) => ({
        id: doc.id,
        ref: doc.ref,
        ...doc.data(),
      }));
      setSuggested(updatedSuggested);
    });

    return () => unsubscribe();
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
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const followingUsers = await fetchFollowingUsers(user);

        // Exclude the signed-in user from the list
        const filteredFollowingUsers = followingUsers.filter(
          (followingUser) => followingUser.id !== user.uid
        );

        setFollowing(filteredFollowingUsers);
      } catch (error) {
        console.error('Error fetching following users:', error.message);
      }
    };

    // Subscribe to real-time updates for following users
    const followingColRef = collection(db, 'users', user.uid, 'following');
    const unsubscribe = onSnapshot(followingColRef, (snapshot) => {
      const updatedFollowing = snapshot.docs.map((doc) => ({
        id: doc.id,
        ref: doc.ref,
        ...doc.data(),
      }));

      // Exclude the signed-in user from the list
      const filteredFollowingUsers = updatedFollowing.filter(
        (followingUser) => followingUser.id !== user.uid
      );

      setFollowing(filteredFollowingUsers);

      // Update suggested accounts by removing the followed user
      setSuggested((prevSuggested) => {
        return prevSuggested.filter(
          (suggestedUser) =>
            !filteredFollowingUsers.some(
              (followingUser) => followingUser.id === suggestedUser.id
            )
        );
      });
    });

    fetchFollowing();

    return () => unsubscribe();
  }, [user, setSuggested]); // Added setSuggested to the dependency array

  if (following.length === 0) {
    return null;
  }

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
