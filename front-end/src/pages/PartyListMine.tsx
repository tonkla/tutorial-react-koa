import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Modal, Tabs } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import Layout from '../components/LayoutSubpage'
import Loading from '../components/Loading'
import PartyItem from '../components/PartyItem'
import partyRepo from '../services/repos/party'
import { useStoreState, useStoreActions } from '../store'
import { ROUTE_PARTY } from '../constants'
import { Party } from '../typings'

export default () => {
  const [createdParties, setCreatedParties] = useState<Party[]>([])
  const [joinedParties, setJoinedParties] = useState<Party[]>([])
  const [isLoading, setLoading] = useState(true)

  const user = useStoreState((s) => s.userState.user)
  const setParty = useStoreActions((a) => a.partyState.set)

  const history = useHistory()

  async function onJoin(partyId: string) {
    if (!user) return
    if (await partyRepo.join(partyId, user.id)) {
      const party = joinedParties.find((p) => p.id === partyId)
      if (party) {
        if (party.members) party.members = [...party.members, user.id]
        const rest = joinedParties.filter((p) => p.id !== partyId)
        const _parties = [...rest, party].sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
        setJoinedParties(_parties)
      }
    }
  }

  async function onExit(partyId: string) {
    if (!user) return
    if (await partyRepo.exit(partyId, user.id)) {
      const party = joinedParties.find((p) => p.id === partyId)
      if (party) {
        if (party.members) party.members = party.members.filter((m) => m !== user.id)
        const rest = joinedParties.filter((p) => p.id !== partyId)
        const _parties = [...rest, party].sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
        setJoinedParties(_parties)
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
        if (await partyRepo.remove(party))
          setCreatedParties(createdParties.filter((p) => p.id !== party.id))
      },
    })
  }

  useEffect(() => {
    ;(async () => {
      setCreatedParties(await partyRepo.listMyParties())
      setJoinedParties(await partyRepo.listMyJoinedParties())
      setLoading(false)
    })()
  }, [])

  return (
    user && (
      <Layout title="My Parties">
        {isLoading ? (
          <Loading />
        ) : (
          <Tabs>
            <Tabs.TabPane tab={`Created`} key="1">
              {createdParties && createdParties.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {createdParties.map((party) => (
                    <PartyItem
                      key={`created-${party.id}`}
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
                <div>{`You did not create any party.`}</div>
              )}
            </Tabs.TabPane>
            <Tabs.TabPane tab={`Joined`} key="2">
              {joinedParties && joinedParties.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {joinedParties.map((party) => (
                    <PartyItem
                      key={`joined-${party.id}`}
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
                <div>{`You did not join any party.`}</div>
              )}
            </Tabs.TabPane>
          </Tabs>
        )}
      </Layout>
    )
  )
}
