import { Context } from 'koa'

import partyRepo from '../pkg/firestore/party'

async function list(ctx: Context) {
  ctx.body = await partyRepo.list()
}

async function listMyParties(ctx: Context) {
  ctx.body = await partyRepo.listMyParties(ctx.params.uid)
}

async function get(ctx: Context) {
  const { partyId } = ctx.reqest.boyd
  ctx.body = await partyRepo.get(partyId)
}

async function create(ctx: Context) {
  const { party } = ctx.request.body
  if (party && (await partyRepo.create(party))) ctx.status = 200
}

async function update(ctx: Context) {
  const { party } = ctx.request.body
  if (party && (await partyRepo.update(party))) ctx.status = 200
}

async function remove(ctx: Context) {
  if (await partyRepo.remove(ctx.params.id)) ctx.status = 200
}

async function join(ctx: Context) {
  const { partyId, userId } = ctx.request.body
  if (await partyRepo.join(partyId, userId)) ctx.status = 200
}

async function exit(ctx: Context) {
  const { partyId, userId } = ctx.request.body
  if (await partyRepo.exit(partyId, userId)) ctx.status = 200
}

async function listPartyMembers(ctx: Context) {
  ctx.body = await partyRepo.listPartyMembers(ctx.params.id)
}

async function listMyJoinedParties(ctx: Context) {
  ctx.body = await partyRepo.listMyJoinedParties(ctx.params.uid)
}

export default {
  get,
  create,
  update,
  remove,
  join,
  exit,
  list,
  listMyParties,
  listMyJoinedParties,
  listPartyMembers,
}
