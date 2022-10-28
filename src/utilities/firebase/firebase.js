import { initializeApp, getApps, getApp } from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, signInWithPopup, signInWithEmailAndPassword, signOut, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'

const config = {
  apiKey: "AIzaSyCOfK5bOxut1yhLj0yzGYa8b2I8SGfZjH8",
  authDomain: "clone-e367b.firebaseapp.com",
  projectId: "clone-e367b",
  storageBucket: "clone-e367b.appspot.com",
  messagingSenderId: "428903398234",
  appId: "1:428903398234:web:3427e8132840f9db161163"
}

const app = !getApps().length ? initializeApp(config) : getApp()

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

export const auth = getAuth()
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider)
export const db = getFirestore()

export const createUserDocumentFromAuth = async (userAuth, additionalInfo) => {
  if (!userAuth) return
  const userDocRef = doc(db, 'users', userAuth.uid)
  const userSnapshot = await getDoc(userDocRef)
  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth
    const createdAt = new Date()
    try { await setDoc(userDocRef, { displayName, email, createdAt, ...additionalInfo }) }
    catch (error) { console.log(error) }
  }
  return userDocRef
}

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return
  return await createUserWithEmailAndPassword(auth, email, password)
}

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return
  return await signInWithEmailAndPassword(auth, email, password)
}

export const signOutUser = () => signOut(auth)
export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback) 