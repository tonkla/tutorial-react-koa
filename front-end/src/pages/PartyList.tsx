import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import Layout from '../components/LayoutSubpage'
import Loading from '../components/Loading'
import PartyItem from '../components/PartyItem'
import partyRepo from '../services/repos/party'
import { useStoreState, useStoreActions } from '../store'
import { ROUTE_PARTY } from '../constants'
import { Party } from '../typings'

export default () => {
  const [parties, setParties] = useState<Party[]>([])
  const [isLoading, setLoading] = useState(true)

  const user = useStoreState((s) => s.userState.user)
  const setParty = useStoreActions((a) => a.partyState.set)

  const history = useHistory()

  async function onJoin(partyId: string) {
    if (!user) return
    if (await partyRepo.join(partyId, user.id)) {
      const party = parties.find((p) => p.id === partyId)
      if (party) {
        if (party.members) party.members = [...party.members, user.id]
        const rest = parties.filter((p) => p.id !== partyId)
        const _parties = [...rest, party].sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
        setParties(_parties)
      }
    }
  }

  async function onExit(partyId: string) {
    if (!user) return
    if (await partyRepo.exit(partyId, user.id)) {
      const party = parties.find((p) => p.id === partyId)
      if (party) {
        if (party.members) party.members = party.members.filter((m) => m !== user.id)
        const rest = parties.filter((p) => p.id !== partyId)
        const _parties = [...rest, party].sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
        setParties(_parties)
      }
    }
  }

  async function onUpdate(party: Party) {
    setParty(party)
    history.push(`/${ROUTE_PARTY}/form`)
  }

  async function onDelete(party: Party) {
    Modal.confirm({
      title: 'Are you sure you want to delete this party?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        if (await partyRepo.remove(party)) setParties(parties.filter((p) => p.id !== party.id))
      },
    })
  }

  useEffect(() => {
    ;(async () => {
      const items = await partyRepo.list()
      setParties(items)
      setLoading(false)
    })()
  }, [])

  return (
    user && (
      <Layout title={'All Parties'}>
        {isLoading ? (
          <Loading />
        ) : parties && parties.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {parties.map((party) => (
              <PartyItem
                key={party.id}
                party={party}
                user={user}
                onJoin={onJoin}
                onExit={onExit}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          <div>{'There is no party.'}</div>
        )}
      </Layout>
    )
  )
}
