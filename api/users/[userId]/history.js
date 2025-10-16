const { ok, notFound, methodNotAllowed } = require('../../../lib/http')
const { getUserHistory } = require('../../../lib/data')

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query || {}
    const uid = Array.isArray(userId) ? userId[0] : userId
    const result = getUserHistory(uid)
    if (result.error === 'USER_NOT_FOUND') return notFound(res, 'User not found')
    return ok(res, result)
  }
  return methodNotAllowed(res, ['GET'])
}
