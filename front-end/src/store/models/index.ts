import { persist } from 'easy-peasy'

import partyState, { PartyStateModel } from './party'
import userState, { UserStateModel } from './user'

export interface StoreModel {
  partyState: PartyStateModel
  userState: UserStateModel
}

const storeModel: StoreModel = persist(
  { partyState, userState },
  {
    storage: 'localStorage',
    whitelist: ['userState'],
  }
)

export default storeModel
