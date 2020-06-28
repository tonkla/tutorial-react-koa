import { Action, action } from 'easy-peasy'

import { Party } from '../../typings'

export interface PartyStateModel {
  party: Party | null
  set: Action<PartyStateModel, Party | null>
}

const partyState: PartyStateModel = {
  party: null,
  set: action((state, party) => {
    state.party = party
  }),
}

export default partyState
