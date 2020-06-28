import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Input, Space } from 'antd'
import { nanoid } from 'nanoid'

import Layout from '../components/LayoutSubpage'
import { create, update } from '../services/repos/party'
import { useStoreState } from '../store'
import { Party } from '../typings'

export default () => {
  const party = useStoreState((s) => s.partyState.party)
  const user = useStoreState((s) => s.userState.user)

  const [name, setName] = useState(party ? party.name : '')
  const [member, setMember] = useState(party ? party.membersRequired.toString() : '')

  const history = useHistory()

  function isValid() {
    return (
      name.trim() !== '' && member.trim() !== '' && !isNaN(parseInt(member)) && parseInt(member) > 0
    )
  }

  async function handleClickCreate() {
    if (!isValid() || !user) return
    const party: Party = {
      id: nanoid(),
      name: name.trim(),
      membersRequired: parseInt(member),
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    }
    if (await create(party)) history.goBack()
  }

  async function handleClickUpdate() {
    if (!isValid() || !user || !party) return
    const newParty: Party = {
      ...party,
      name: name.trim(),
      membersRequired: parseInt(member),
      updatedAt: new Date().toISOString(),
    }
    if (await update(newParty)) history.goBack()
  }

  const title = party ? 'Update Party' : 'Create Party'

  return (
    <Layout title={title}>
      <Space direction="vertical">
        <Input
          placeholder="Party name"
          size="large"
          defaultValue={party ? party.name : ''}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Party members"
          type="number"
          size="large"
          defaultValue={party ? party.membersRequired : ''}
          onChange={(e) => setMember(e.target.value)}
        />
        {party ? (
          <Button
            type="primary"
            size="large"
            className="w-full mt-3"
            disabled={!isValid()}
            onClick={handleClickUpdate}
          >
            {title}
          </Button>
        ) : (
          <Button
            type="primary"
            size="large"
            className="w-full mt-3"
            disabled={!isValid()}
            onClick={handleClickCreate}
          >
            {title}
          </Button>
        )}
      </Space>
    </Layout>
  )
}
