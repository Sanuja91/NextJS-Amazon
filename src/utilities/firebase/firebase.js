import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const config = {
  apiKey: "AIzaSyCOfK5bOxut1yhLj0yzGYa8b2I8SGfZjH8",
  authDomain: "clone-e367b.firebaseapp.com",
  projectId: "clone-e367b",
  storageBucket: "clone-e367b.appspot.com",
  messagingSenderId: "428903398234",
  appId: "1:428903398234:web:3427e8132840f9db161163"
}

const app = !getApps().length ? initializeApp(config) : getApp()

export const db = getFirestore()