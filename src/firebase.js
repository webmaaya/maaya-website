// ============================================================
//  firebase.js — Firebase Configuration
// ============================================================

import { initializeApp }  from "firebase/app";
import { getFirestore }   from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey:            "AIzaSyDv7qydF7odkXqJCXcCD7Ix-3qkJ0_L9zc",
  authDomain:        "maaya-enterprises.firebaseapp.com",
  projectId:         "maaya-enterprises",
  storageBucket:     "maaya-enterprises.firebasestorage.app",
  messagingSenderId: "101570355014",
  appId:             "1:101570355014:web:a52e046f0d31922f72cf47",
  measurementId:     "G-4JXM1JS0JW",
};

const app  = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);

// ── Permanent session — user never gets logged out ────────────
setPersistence(auth, browserLocalPersistence).catch(() => {});
