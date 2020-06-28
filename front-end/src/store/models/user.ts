import { Action, action, Thunk, thunk } from 'easy-peasy'

import auth from '../../services/auth'
import { User } from '../../typings'

export interface UserStateModel {
  user: User | null
  set: Action<UserStateModel, User | null>
  signOut: Thunk<UserStateModel>
}

const userState: UserStateModel = {
  user: null,
  set: action((state, user) => {
    delete user?.password
    state.user = user
  }),
  signOut: thunk(async (actions) => {
    await auth.signOut()
    actions.set(null)
  }),
}

export default userState
