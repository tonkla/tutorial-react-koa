import Koa, { Context } from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import Router from 'koa-tree-router'

import auth from './pkg/auth'
import { notice, error } from './pkg/logging'
import { party, user } from './routes'
import { ROUTE_PARTY, ROUTE_USER } from './constants'

async function handleError(ctx: Context, next: Function) {
  try {
    await next()
  } catch (e) {
    error(e)
    ctx.status = 500
  }
}

async function authorize(ctx: Context, next: Function) {
  const { authorization } = ctx.headers
  if (authorization) {
    const uid = await auth.authorize(authorization)
    // TODO: check owner at object level
    if (uid) return await next()
  }
  ctx.status = 401
}

const r = new Router()
r.get(`/${ROUTE_PARTY}`, party.list)
r.get(`/${ROUTE_PARTY}/:id`, party.get)
r.post(`/${ROUTE_PARTY}`, party.create)
r.put(`/${ROUTE_PARTY}/:id`, party.update)
r.delete(`/${ROUTE_PARTY}/:id`, party.remove)
r.post(`/${ROUTE_PARTY}/join`, party.join)
r.post(`/${ROUTE_PARTY}/exit`, party.exit)
r.get(`/my-${ROUTE_PARTY}/:uid`, party.listMyParties)
r.get(`/my-${ROUTE_PARTY}/:uid/joined`, party.listMyJoinedParties)

r.get(`/${ROUTE_USER}/:id`, user.get)
r.post(`/${ROUTE_USER}`, user.create)
r.put(`/${ROUTE_USER}/:id`, user.update)

const port = process.env.PORT || 8080

new Koa()
  .use(cors())
  .use(bodyParser())
  .use(handleError)
  .use(authorize)
  .use(r.routes())
  .listen({ port }, async () => notice(`🚀 API launched on port ${port}`))
