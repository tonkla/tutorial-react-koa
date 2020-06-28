import firebase from 'firebase/app'
import 'firebase/auth'

import { User } from '../typings'

import firebaseConfig from '../configs/firebase.json'
firebase.initializeApp(firebaseConfig)

export async function getFirebaseUser(): Promise<firebase.User | null> {
  return new Promise((resolve) => {
    firebase.auth().onAuthStateChanged((fbUser) => {
      if (fbUser) resolve(fbUser)
      else resolve(null)
    })
  })
}

export async function signUp(user: User): Promise<string> {
  if (!user.password) return ''
  try {
    await firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    const fbUser = await getFirebaseUser()
    if (fbUser) {
      await fbUser.updateProfile({ displayName: user.name })
      return ''
    }
    return 'Sign-up failed.'
  } catch (e) {
    return e.message
  }
}

export async function signIn(email: string, password: string): Promise<string> {
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password)
    return ''
  } catch (e) {
    return e.message
  }
}

export async function signOut() {
  await firebase.auth().signOut()
}

export default {
  getFirebaseUser,
  signUp,
  signIn,
  signOut,
}
