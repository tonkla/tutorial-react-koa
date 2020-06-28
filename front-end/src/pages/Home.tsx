import React from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { Button, Modal, Space } from 'antd'
import {
  ExclamationCircleOutlined,
  LogoutOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
} from '@ant-design/icons'

import Layout from '../components/Layout'
import { useStoreActions, useStoreState } from '../store'
import { ROUTE_PARTY } from '../constants'

export default () => {
  const user = useStoreState((s) => s.userState.user)
  const signOut = useStoreActions((a) => a.userState.signOut)
  const setParty = useStoreActions((a) => a.partyState.set)

  const history = useHistory()

  async function handleClickCreateParty() {
    setParty(null)
    history.push(`/${ROUTE_PARTY}/form`)
  }

  async function handleClickSignOut() {
    Modal.confirm({
      title: 'Are you sure you want to sign out?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        await signOut()
      },
    })
  }

  return user ? (
    <Layout className="h-screen justify-center">
      <Space direction="vertical" align="center" size="middle">
        <span>Welcome, {user.name}</span>
        <Button
          size="large"
          className="w-64 pl-10 flex items-center"
          onClick={() => history.push(`/${ROUTE_PARTY}/my`)}
        >
          <div className="w-10 flex items-center">
            <ShoppingCartOutlined />
          </div>
          My Parties
        </Button>
        <Button
          size="large"
          className="w-64 pl-10 flex items-center"
          onClick={() => history.push(`/${ROUTE_PARTY}`)}
        >
          <div className="w-10 flex items-center">
            <ShopOutlined />
          </div>
          All Parties
        </Button>
        <Button
          size="large"
          className="w-64 pl-10 flex items-center"
          onClick={handleClickCreateParty}
        >
          <div className="w-10 flex items-center">
            <PlusOutlined />
          </div>
          Create Party
        </Button>
        <Button size="large" className="w-64 pl-10 flex items-center" onClick={handleClickSignOut}>
          <div className="w-10 flex items-center">
            <LogoutOutlined />
          </div>
          Sign Out
        </Button>
      </Space>
    </Layout>
  ) : (
    <Redirect to="/login" />
  )
}
