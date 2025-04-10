import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return {
      success: true,
      user: {
        firstName: result.user.displayName?.split(' ')[0] || '',
        lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
        email: result.user.email || '',
        photoURL: result.user.photoURL || '',
        uid: result.user.uid
      }
    };
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    let errorMessage = 'An error occurred during Google sign in';
    
    if (error.code === 'auth/unauthorized-domain') {
      errorMessage = 'This domain is not authorized. Please make sure to add your domain in the Firebase Console under Authentication > Settings > Authorized Domains.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'The sign in popup was blocked by your browser. Please allow popups for this site.';
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'The sign in was cancelled.';
    } else if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'The sign in popup was closed before completing authentication.';
    }
    
    return {
      success: false,
      error: errorMessage,
      code: error.code
    };
  }
};

export { auth };
