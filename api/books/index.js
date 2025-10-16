const { ok, methodNotAllowed } = require('../../lib/http')
const { listBooks } = require('../../lib/data')

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    return ok(res, { books: listBooks() })
  }
  return methodNotAllowed(res, ['GET'])
}
