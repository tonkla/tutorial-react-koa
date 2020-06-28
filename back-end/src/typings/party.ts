export interface Party {
  id: string
  name: string
  membersRequired: number
  createdBy: string
  createdAt: string
  updatedAt?: string
  members?: string[]
}
