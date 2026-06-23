import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

export const getFirebaseApp = () => {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
};

export const getFirebaseAuth = () => {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
};

export const getGoogleProvider = () => {
  if (!googleProvider) {
    googleProvider = new GoogleAuthProvider();
    googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    googleProvider.addScope('profile');
    googleProvider.addScope('email');
  }
  return googleProvider;
};
