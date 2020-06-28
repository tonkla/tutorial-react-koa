export interface User {
  id: string
  firebaseId: string
  name: string
  email: string
  password?: string
  subscribeNewsletter?: boolean
}
