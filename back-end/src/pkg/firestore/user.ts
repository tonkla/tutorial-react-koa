import admin from './'
import { DB_USER } from '../../constants'
import { User } from '../../typings'

const db = admin.firestore()

export async function get(firebaseId: string): Promise<User | null> {
  try {
    let user: User | null = null
    const docs = await db.collection(DB_USER).where('firebaseId', '==', firebaseId).get()
    docs.forEach((d) => (user = d.data() as User))
    return user
  } catch (e) {
    return null
  }
}

export async function create(user: User): Promise<boolean> {
  try {
    await db.collection(DB_USER).doc(user.id).set(user)
    return true
  } catch (e) {
    return false
  }
}

export async function update(user: User): Promise<boolean> {
  try {
    await db.collection(DB_USER).doc(user.id).set(user)
    return true
  } catch (e) {
    return false
  }
}

export default {
  get,
  create,
  update,
}
