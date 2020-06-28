import React from 'react'
import dayjs from 'dayjs'
import { Button, Space } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons'

import partyRepo from '../services/repos/party'
import { Party, User } from '../typings'

interface Props {
  party: Party
  user: User
  onJoin: (partyId: string) => void
  onExit: (partyId: string) => void
  onUpdate: (party: Party) => void
  onDelete: (party: Party) => void
}

export default ({ party, user, onJoin, onExit, onUpdate, onDelete }: Props) => {
  async function handleClickJoin(partyId: string) {
    if (!user) return
    if (await partyRepo.join(partyId, user.id)) {
      onJoin(partyId)
    }
  }

  async function handleClickExit(partyId: string) {
    if (!user) return
    if (await partyRepo.exit(partyId, user.id)) {
      onExit(partyId)
    }
  }

  async function handleClickEdit(party: Party) {
    onUpdate(party)
  }

  async function handleClickDelete(party: Party) {
    onDelete(party)
  }

  return (
    <div key={party.id} className="bg-white rounded-md">
      <div className="bg-gray-300 rounded-tl-md rounded-tr-md" style={{ height: 160 }}>
        <img
          src="https://picsum.photos/seed/picsum/200"
          alt="Party Cover"
          className="rounded-tl-md rounded-tr-md"
          style={{ height: 160, width: '100%' }}
        />
      </div>
      <div className="p-3">
        <div className="mb-2 text-lg">{party.name}</div>
        <div className="mb-2">
          <span>Members: </span>
          <span className="text-red-500">{party.members ? party.members.length + 1 : 1}</span>
          <span>/{party.membersRequired}</span>
        </div>
        <div className="mb-4 text-gray-600 text-sm">
          Date: {dayjs(party.createdAt).format('YYYY-MM-DD')}
        </div>
        <div className="flex justify-center">
          {party.createdBy === user.id ? (
            <Space>
              <Button
                className="center-all"
                onClick={() => handleClickEdit(party)}
                icon={<EditOutlined />}
                title="Edit"
              ></Button>
              <Button
                className="center-all"
                onClick={() => handleClickDelete(party)}
                icon={<DeleteOutlined />}
                title="Delete"
              ></Button>
            </Space>
          ) : party.members?.includes(user.id) ? (
            <Button
              className="center-all"
              onClick={() => handleClickExit(party.id)}
              icon={<MinusCircleOutlined />}
            >
              Exit
            </Button>
          ) : (
            <Button
              disabled={party.members && party.members.length === party.membersRequired}
              type={
                party.members && party.members.length === party.membersRequired
                  ? 'dashed'
                  : 'default'
              }
              className="center-all"
              onClick={() => handleClickJoin(party.id)}
              icon={<PlusCircleOutlined />}
            >
              Join
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
