import { signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';

import db, { auth, googleAuthProvider } from '../lib/firebase';

export default function LogIn({ setUser, setNewUser }) {
  async function signIn() {
    try {
      const data = await signInWithPopup(auth, googleAuthProvider);
      if (data) {
        await checkUsername(data.user.uid);
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  }

  async function checkUsername(uid) {
    const usernameRef = collection(db, 'usernames');
    const usernameQuery = query(usernameRef, where('uid', '==', uid));

    try {
      const querySnapshot = await getDocs(usernameQuery);
      setNewUser(querySnapshot.empty);
    } catch (error) {
      console.error('Error checking username', error);
    }
  }

  return (
    <div className='login-container'>
      <header className='login-header'></header>
      <div className='login-wrapper'>
        <div className='login-options-container'>
          <div className='login-title-container'>
            <div className='login-title'>Sign up for Tiktok</div>
          </div>

          <div className='login-options'>
            <LoginOption src='/email.png' text='Use phone or email' />
            <LoginOption src='/facebook.png' text='Continue with Facebook' />
            <LoginOption
              src='/google.png'
              text='Continue with Google'
              onClick={signIn}
            />
            <LoginOption src='/twitter.png' text='Continue with Twitter' />
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginOption({ text, src, onClick }) {
  return (
    <div className='login-option-wrapper' onClick={onClick}>
      <div className='login-option-icon-wrapper'>
        <img src={src} alt={text} className='login-option-icon' />
      </div>
      <div className='login-option-text'>{text}</div>
    </div>
  );
}
