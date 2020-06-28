import admin from './'
import { DB_PARTY, DB_USER } from '../../constants'
import { Party, PartyUser } from '../../typings'

const db = admin.firestore()

export async function get(partyId: string): Promise<Party | null> {
  try {
    const doc = await db.collection(DB_PARTY).doc(partyId).get()
    return doc.exists ? (doc.data() as Party) : null
  } catch (e) {
    return null
  }
}

export async function create(party: Party): Promise<boolean> {
  try {
    await db.collection(DB_PARTY).doc(party.id).set(party)
    return true
  } catch (e) {
    return false
  }
}

export async function update(party: Party): Promise<boolean> {
  try {
    await db.collection(DB_PARTY).doc(party.id).set(party)
    return true
  } catch (e) {
    return false
  }
}

export async function remove(partyId: string): Promise<boolean> {
  try {
    await db.collection(DB_PARTY).doc(partyId).delete()
    return true
  } catch (e) {
    return false
  }
}

export async function list(): Promise<Party[]> {
  try {
    const parties: Party[] = []
    const docs = await db.collection(DB_PARTY).orderBy('createdAt', 'desc').get()
    docs.forEach((d) => parties.push(d.data() as Party))
    return await Promise.all(
      parties.map(async (party) => {
        const members = await listPartyMembers(party.id)
        return { ...party, members: members.map((m) => m.userId) }
      })
    )
  } catch (e) {
    return []
  }
}

export async function listMyParties(uid: string): Promise<Party[]> {
  try {
    const parties: Party[] = []
    const docs = await db.collection(DB_PARTY).where('createdBy', '==', uid).get()
    docs.forEach((d) => parties.push(d.data() as Party))
    // Note: cannot use .orderBy() and .where() with different field
    const _parties = await Promise.all(
      parties.map(async (party) => {
        const members = await listPartyMembers(party.id)
        return { ...party, members: members.map((m) => m.userId) }
      })
    )
    return _parties.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
  } catch (e) {
    return []
  }
}

export async function join(partyId: string, userId: string): Promise<boolean> {
  try {
    await db
      .collection(`${DB_PARTY}_${DB_USER}`)
      .doc(`${partyId}_${userId}`)
      .set({ partyId, userId })
    return true
  } catch (e) {
    return false
  }
}

export async function exit(partyId: string, userId: string): Promise<boolean> {
  try {
    await db.collection(`${DB_PARTY}_${DB_USER}`).doc(`${partyId}_${userId}`).delete()
    return true
  } catch (e) {
    return false
  }
}

export async function listPartyMembers(partyId: string): Promise<PartyUser[]> {
  try {
    let joints: PartyUser[] = []
    const docs = await db.collection(`${DB_PARTY}_${DB_USER}`).where('partyId', '==', partyId).get()
    docs.forEach((d) => joints.push(d.data() as PartyUser))
    return joints
  } catch (e) {
    return []
  }
}

export async function listMyJoinedParties(userId: string): Promise<Party[]> {
  try {
    let joints: PartyUser[] = []
    const docs = await db.collection(`${DB_PARTY}_${DB_USER}`).where('userId', '==', userId).get()
    docs.forEach((d) => joints.push(d.data() as PartyUser))
    const parties = await Promise.all(joints.map(async (j) => await get(j.partyId)))
    const _parties = parties.filter((p): p is Party => p !== null).map((p) => p)
    return await Promise.all(
      _parties.map(async (party) => {
        const members = await listPartyMembers(party.id)
        return { ...party, members: members.map((m) => m.userId) }
      })
    )
  } catch (e) {
    return []
  }
}

export default {
  get,
  create,
  update,
  remove,
  join,
  exit,
  list,
  listMyParties,
  listMyJoinedParties,
  listPartyMembers,
}
