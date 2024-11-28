import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

//testing logs, no longer using NODE_ENV instead our own one
console.log('Node Environment:', process.env.NODE_ENV);
console.log('App Environment:', process.env.REACT_APP_ENV);
//first 6 chars of api key for dev use only
// console.log('apikey', firebaseConfig.apiKey?.substring(0,6))




const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

if (process.env.REACT_APP_ENV === 'development') {
  console.log("Using Firebase Emulators");
  
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "localhost", 8080);
  
  //testing auth connection
  // auth.useDeviceLanguage();
  // console.log("Auth emulator URL:", auth.config.emulator?.url);
  // console.log("Firebase config:", firebaseConfig);
} else{
  console.log('Using Production Firebase');
}

export {auth, db}
export default app;