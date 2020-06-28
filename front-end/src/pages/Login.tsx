import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Alert, Button, Input, Space } from 'antd'

import Layout from '../components/Layout'
import Loading from '../components/Loading'
import { getFirebaseUser, signIn } from '../services/auth'
import userRepo from '../services/repos/user'
import { useStoreActions } from '../store'

export default () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setLoading] = useState(false)

  const history = useHistory()

  const setUser = useStoreActions((a) => a.userState.set)

  function isValid() {
    return email.trim() !== '' && password.trim() !== '' && /(.+)@(.+){2,}\.(.+){2,}/.test(email)
  }

  async function handleClickSignIn() {
    if (!isValid()) return
    setLoading(true)
    const error = await signIn(email, password)
    if (error) {
      setError(error)
      setTimeout(() => {
        setError('')
      }, 5000)
      setLoading(false)
    } else {
      const fbUser = await getFirebaseUser()
      setLoading(false)
      if (!fbUser) return
      setUser(await userRepo.get(fbUser.uid))
      history.push('/')
    }
  }

  return (
    <Layout className="items-center justify-center">
      <h1 className="mb-4 text-2xl">Template</h1>
      <Space direction="vertical" align="center" size="large">
        <div className="p-6 bg-gray-200 rounded-md">
          <Space direction="vertical" align="center">
            <Input
              placeholder="Email"
              size="large"
              className="w-64"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              size="large"
              className="w-64"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              disabled={!isValid() || isLoading}
              type="primary"
              size="large"
              className="px-6 mt-3"
              onClick={handleClickSignIn}
            >
              Sign In
            </Button>
          </Space>
        </div>
      </Space>
      {error && (
        <div className="mt-4">
          <Alert message={error} type="error" showIcon />
        </div>
      )}
      {isLoading && <Loading />}
      <div className="mt-6">
        If you don't have an account,
        <Button type="link" className="p-0 ml-1" onClick={() => history.push('/register')}>
          Sign Up
        </Button>
      </div>
    </Layout>
  )
}
