import { Context } from 'koa'

import userRepo from '../pkg/firestore/user'

async function get(ctx: Context) {
  ctx.body = await userRepo.get(ctx.params.id)
}

async function create(ctx: Context) {
  const { user } = ctx.request.body
  if (user && (await userRepo.create(user))) ctx.status = 200
}

async function update(ctx: Context) {
  const { party } = ctx.request.body
  if (party && (await userRepo.update(party))) ctx.status = 200
}

export default {
  get,
  create,
  update,
}
