import React from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import { StoreProvider } from 'easy-peasy'

import store from './store'
import Home from './pages/Home'
import Login from './pages/Login'
import PartyForm from './pages/PartyForm'
import PartyList from './pages/PartyList'
import PartyListMine from './pages/PartyListMine'
import Register from './pages/Register'
import AuthorizedRoute from './components/AuthorizedRoute'
import { ROUTE_PARTY } from './constants'

import 'antd/dist/antd.css'
import './styles/main.css'
import './App.css'

export default () => (
  <StoreProvider store={store}>
    <Router>
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <AuthorizedRoute path="/" exact component={Home} />
        <AuthorizedRoute path={`/${ROUTE_PARTY}`} exact component={PartyList} />
        <AuthorizedRoute path={`/${ROUTE_PARTY}/my`} exact component={PartyListMine} />
        <AuthorizedRoute path={`/${ROUTE_PARTY}/form`} exact component={PartyForm} />
        <Redirect to="/" />
      </Switch>
    </Router>
  </StoreProvider>
)
