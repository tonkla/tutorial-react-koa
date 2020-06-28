import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { nanoid } from 'nanoid'
import { Alert, Button, Checkbox, Input, Modal, Space } from 'antd'

import Layout from '../components/LayoutSubpage'
import Loading from '../components/Loading'
import { getFirebaseUser, signUp } from '../services/auth'
import userRepo from '../services/repos/user'
import { User } from '../typings'

export default () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [acceptToU, setAcceptToU] = useState(false)
  const [subscribe, setSubscribe] = useState(false)
  const [showToU, setShowToU] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setLoading] = useState(false)

  const history = useHistory()

  function isValid() {
    return (
      name.trim() !== '' &&
      email.trim() !== '' &&
      password.trim() !== '' &&
      password === password2 &&
      acceptToU &&
      /(.+)@(.+){2,}\.(.+){2,}/.test(email)
    )
  }

  async function handleClickSignUp() {
    if (!isValid()) return
    const user: User = {
      id: nanoid(),
      firebaseId: '',
      name,
      email,
      password,
      subscribeNewsletter: subscribe,
    }
    setLoading(true)
    const error = await signUp(user)
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
      delete user.password
      await userRepo.create({ ...user, firebaseId: fbUser.uid })
      history.push('/login')
    }
  }

  return (
    <Layout className="items-center bg-white">
      <Space direction="vertical" align="center" size="large">
        <h1 className="text-xl">Sign Up</h1>
        <div className="p-6 bg-gray-200 rounded-md">
          <Space direction="vertical" align="center">
            <Input
              placeholder="Name"
              size="large"
              className="w-64"
              onChange={(e) => setName(e.target.value)}
            />
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
            <Input
              placeholder="Retype password"
              type="password"
              size="large"
              className="w-64"
              onChange={(e) => setPassword2(e.target.value)}
            />
            <div className="w-64 py-3 flex flex-col">
              <div>
                <Checkbox onChange={(e) => setAcceptToU(e.target.checked)}>
                  <span>I accept the</span>
                  <Button type="link" className="p-0 ml-1" onClick={(e) => setShowToU(true)}>
                    Terms of Use
                  </Button>
                  <span>.</span>
                </Checkbox>
              </div>
              <div>
                <Checkbox onChange={(e) => setSubscribe(e.target.checked)}>
                  I want to subscribe a newsletter.
                </Checkbox>
              </div>
            </div>
            <Button
              disabled={!isValid() || isLoading}
              type="primary"
              size="large"
              className="px-6"
              onClick={handleClickSignUp}
            >
              Sign Up
            </Button>
          </Space>
        </div>
      </Space>
      {isLoading && <Loading />}
      {error && (
        <div className="mt-4">
          <Alert message={error} type="error" showIcon />
        </div>
      )}
      <Modal
        title="Terms of Use"
        visible={showToU}
        closable={false}
        onOk={() => setShowToU(false)}
        onCancel={() => setShowToU(false)}
      >
        We will protect your privacy as best as we can.
      </Modal>
    </Layout>
  )
}
