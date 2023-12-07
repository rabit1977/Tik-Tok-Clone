import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import db, { auth } from '../lib/firebase'; // Assuming that 'db' is the Firebase app instance
import { removeWhiteSpace } from '../lib/validate';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const toastOptions = {
  position: 'top-right',
  style: {
    fontFamily: 'proxima-regular',
    borderRadius: 10,
    background: '#333',
    color: '#fff',
  },
};

export default function SignUp({ user }) {
  const [isTaken, setTaken] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (user) {
      console.log('User authenticated', user);
      const defaultUsername = removeWhiteSpace(user.displayName);
      setUsername(defaultUsername);
    }
  }, [user]);

  useEffect(() => {
    const u = removeWhiteSpace(username);

    async function checkUsername() {
      if (u.length >= 3 && u.length <= 20) {
        const usernameDoc = doc(db, `usernames/@${u}`);
        const usernameSnapshot = await getDoc(usernameDoc);
        setTaken(usernameSnapshot.exists());
      }
    }

    if (u) {
      checkUsername();
    }
  }, [username]);

  async function signUp(event) {
    event.preventDefault();

    if (isTaken) {
      return toast.error('This username is taken', toastOptions);
    } else if (username.length < 3) {
      return toast.error('Username is under 3 character limit', toastOptions);
    } else if (username.length > 20) {
      return toast.error('Username is over 20 character limit', toastOptions);
    }

    const { uid, displayName, photoURL } = user;
    const formattedUsername = `@${removeWhiteSpace(username)}`;

    try {
      setLoading(true);

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth, // Assuming 'auth' is the auth instance
        `${uid}@example.com`, // Use a dummy email (not used for authentication, just for Firebase)
        'your-password' // Replace with a secure password
      );

      // Update the user profile
      await updateProfile(userCredential.user, {
        displayName: username,
        photoURL,
      });

      // Add user data to Firestore
      await setDoc(doc(db, 'users', uid), {
        uid,
        username: formattedUsername,
        displayName,
        photoURL,
      });

      // Add username data to Firestore
      await setDoc(doc(db, 'usernames', formattedUsername), { uid });

      window.location.reload();
    } catch (error) {
      console.error('Error during sign up:', error);
      alert('An error occurred during sign up.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='signup-container'>
      <header className='signup-header'>
        <div className='signup-header-title'>Sign up</div>
      </header>
      <form onSubmit={signUp} className='signup-form'>
        <div className='signup-form-inner'>
          <div className='signup-form-title'>Create username</div>
          <div className={`signup-input ${isTaken ? 'signup-error' : ''}`}>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type='text'
              placeholder='Username'
            />
            <div className='signup-error-icon'></div>
          </div>
          <div className='signup-error-text'>
            {isTaken
              ? 'This username is taken.'
              : 'You can always change this later.'}
          </div>
        </div>
        <button
          type='submit'
          className='signup-submit'
          disabled={isTaken || isLoading}
        >
          Sign up
        </button>
      </form>
    </div>
  );
}
