import { init } from './'
import userRepo from './user'
import { getFirebaseUser } from '../auth'
import { ROUTE_PARTY } from '../../constants'
import { Party } from '../../typings'

const baseUrl = process.env.REACT_APP_API_URL || ''

export async function list(): Promise<Party[]> {
  const client = await init()
  if (!client) return []
  const { data } = await client.get(`${baseUrl}/${ROUTE_PARTY}`)
  return data ? (data as Party[]) : []
}

export async function listMyParties(): Promise<Party[]> {
  const client = await init()
  if (!client) return []
  const fbUser = await getFirebaseUser()
  if (!fbUser) return []
  const user = await userRepo.get(fbUser.uid)
  if (!user) return []
  const { data } = await client.get(`${baseUrl}/my-${ROUTE_PARTY}/${user.id}`)
  return data ? (data as Party[]) : []
}

export async function listMyJoinedParties(): Promise<Party[]> {
  const client = await init()
  if (!client) return []
  const fbUser = await getFirebaseUser()
  if (!fbUser) return []
  const user = await userRepo.get(fbUser.uid)
  if (!user) return []
  const { data } = await client.get(`${baseUrl}/my-${ROUTE_PARTY}/${user.id}/joined`)
  return data ? (data as Party[]) : []
}

export async function get(partyId: string): Promise<Party | null> {
  const client = await init()
  if (!client) return null
  const { data } = await client.get(`${baseUrl}/${ROUTE_PARTY}/${partyId}`)
  return data ? (data as Party) : null
}

export async function create(party: Party): Promise<boolean> {
  const client = await init()
  if (!client) return false
  const result = await client.post(`${baseUrl}/${ROUTE_PARTY}`, { party })
  return result.status === 200
}

export async function update(party: Party): Promise<boolean> {
  const client = await init()
  if (!client) return false
  const result = await client.put(`${baseUrl}/${ROUTE_PARTY}/${party.id}`, { party })
  return result.status === 200
}

export async function remove(party: Party): Promise<boolean> {
  const client = await init()
  if (!client) return false
  const result = await client.delete(`${baseUrl}/${ROUTE_PARTY}/${party.id}`)
  return result.status === 200
}

export async function join(partyId: string, userId: string): Promise<boolean> {
  const client = await init()
  if (!client) return false
  const result = await client.post(`${baseUrl}/${ROUTE_PARTY}/join`, { partyId, userId })
  return result.status === 200
}

export async function exit(partyId: string, userId: string): Promise<boolean> {
  const client = await init()
  if (!client) return false
  const result = await client.post(`${baseUrl}/${ROUTE_PARTY}/exit`, { partyId, userId })
  return result.status === 200
}

export default {
  list,
  listMyParties,
  listMyJoinedParties,
  get,
  create,
  update,
  remove,
  join,
  exit,
}
