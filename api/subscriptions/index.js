const { ok, badRequest, methodNotAllowed } = require('../../lib/http')
const { listSubscriptions, upsertSubscription } = require('../../lib/data')
const { readJson } = require('../../lib/http')

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    return ok(res, { subscriptions: listSubscriptions() })
  }
  if (req.method === 'POST') {
    try {
      const body = await readJson(req)
      const userId = body.userId
      const plan = body.plan
      if (!userId || !plan) return badRequest(res, 'userId and plan are required')
      const result = upsertSubscription(userId, plan)
      if (result.error === 'USER_NOT_FOUND') return badRequest(res, 'User not found')
      return ok(res, result)
    } catch (e) {
      return badRequest(res, 'Invalid JSON')
    }
  }
  return methodNotAllowed(res, ['GET', 'POST'])
}
