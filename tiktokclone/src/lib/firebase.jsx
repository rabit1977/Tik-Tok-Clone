import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  // FieldValue as serverTimestamp,
  increment,
} from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import firebaseConfig from './firebaseConfig';

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const googleAuthProvider = new GoogleAuthProvider(app);
// const facebookProvider = new FacebookAuthProvider();
// const twitterProvider = new TwitterAuthProvider();

export {
  auth,
  googleAuthProvider,
  // facebookProvider,
  // twitterProvider,
  storage,
  // serverTimestamp,
  increment,
};
export default db;
