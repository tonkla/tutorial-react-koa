import { init } from './'
import { ROUTE_USER } from '../../constants'
import { User } from '../../typings'

const baseUrl = process.env.REACT_APP_API_URL || ''

export async function get(firebaseId: string): Promise<User | null> {
  const client = await init()
  if (!client) return null
  const { data } = await client.get(`${baseUrl}/${ROUTE_USER}/${firebaseId}`)
  return data ? (data as User) : null
}

export async function create(user: User): Promise<boolean> {
  const client = await init()
  if (!client) return false
  const result = await client.post(`${baseUrl}/${ROUTE_USER}`, { user })
  return result.status === 200
}

export async function update(user: User): Promise<boolean> {
  const client = await init()
  if (!client) return false
  const result = await client.put(`${baseUrl}/${ROUTE_USER}/${user.id}`, { user })
  return result.status === 200
}

export default {
  get,
  create,
  update,
}
