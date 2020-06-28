import axios, { AxiosInstance } from 'axios'

import { getFirebaseUser } from '../auth'

export async function init(): Promise<AxiosInstance | null> {
  const user = await getFirebaseUser()
  if (!user) return null
  const authorization = await user.getIdToken()
  return axios.create({ headers: { authorization } })
}
