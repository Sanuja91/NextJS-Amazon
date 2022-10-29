import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

const config = {
  apiKey: "AIzaSyCOfK5bOxut1yhLj0yzGYa8b2I8SGfZjH8",
  authDomain: "clone-e367b.firebaseapp.com",
  projectId: "clone-e367b",
  storageBucket: "clone-e367b.appspot.com",
  messagingSenderId: "428903398234",
  appId: "1:428903398234:web:3427e8132840f9db161163"
}

const app = !getApps().length ? initializeApp(config) : getApp()

const db = getFirestore(app)

// Get a list of cities from your database
export const getDocsFromFirestore = async (path) => {
  const col = collection(db, path)
  const snapshot = await getDocs(col)
  const docs = snapshot.docs.map(doc => doc.data())
  return docs
}