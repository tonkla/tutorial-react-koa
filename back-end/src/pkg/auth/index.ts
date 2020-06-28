import dotenv from 'dotenv'

import admin from '../firestore'

dotenv.config()

export async function authorize(idToken: string): Promise<string | null> {
  try {
    const { aud, exp, uid } = await admin.auth().verifyIdToken(idToken, false)
    if (aud !== process.env.FIREBASE_PROJECT_ID) return null
    if (new Date(exp * 1000) < new Date()) return null
    return uid
  } catch (e) {
    return null
  }
}

export default {
  authorize,
}
