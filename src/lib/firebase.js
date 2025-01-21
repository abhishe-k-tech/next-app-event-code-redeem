import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCppXVf8l1Cc1S8bxEyvNs1enyLccS0q1I",
    authDomain: "event-ticket-claim.firebaseapp.com",
    projectId: "event-ticket-claim",
    storageBucket: "event-ticket-claim.firebasestorage.app",
    messagingSenderId: "701435596826",
    appId: "1:701435596826:web:3ce2256301078e4d5d41a3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;