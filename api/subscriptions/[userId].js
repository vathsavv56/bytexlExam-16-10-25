const { ok, badRequest, notFound, methodNotAllowed } = require('../../lib/http')
const { getSubscription, upsertSubscription, cancelSubscription } = require('../../lib/data')
const { readJson } = require('../../lib/http')

module.exports = async function handler(req, res) {
  const { userId } = req.query || {}
  const uid = Array.isArray(userId) ? userId[0] : userId

  if (req.method === 'GET') {
    const sub = getSubscription(uid)
    if (!sub) return notFound(res, 'Subscription not found')
    return ok(res, { subscription: sub })
  }

  if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const body = await readJson(req)
      const plan = body.plan
      if (!plan) return badRequest(res, 'plan is required')
      const result = upsertSubscription(uid, plan)
      if (result.error === 'USER_NOT_FOUND') return badRequest(res, 'User not found')
      return ok(res, result)
    } catch (e) {
      return badRequest(res, 'Invalid JSON')
    }
  }

  if (req.method === 'DELETE') {
    const result = cancelSubscription(uid)
    if (result.error === 'SUBSCRIPTION_NOT_FOUND') return notFound(res, 'Subscription not found')
    return ok(res, result)
  }

  return methodNotAllowed(res, ['GET', 'PUT', 'PATCH', 'DELETE'])
}
