import React from 'react'
import { Route, Redirect } from 'react-router-dom'

import { useStoreState } from '../store'

export default ({ component: Component, ...rest }: any) => {
  const user = useStoreState((s) => s.userState.user)
  return (
    <Route
      {...rest}
      render={(props) => (user ? <Component {...props} /> : <Redirect to="/login" />)}
    />
  )
}
