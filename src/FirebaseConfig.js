import { initializeApp } from 'firebase/app'
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyBCCK0yk7jORZfp23kzn-v8YAsVaa7llSQ",
    authDomain: "portafolio-grupo6.firebaseapp.com",
    projectId: "portafolio-grupo6",
    storageBucket: "portafolio-grupo6.appspot.com",
    messagingSenderId: "74074331231",
    appId: "1:74074331231:web:551777354ca0ab53e163ea",
    measurementId: "G-PJ5GWFV3NV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});


export default app;

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);