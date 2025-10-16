const { ok, notFound, methodNotAllowed } = require('../../lib/http')
const { getBook } = require('../../lib/data')

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query || {}
    const book = getBook(Array.isArray(id) ? id[0] : id)
    if (!book) return notFound(res, 'Book not found')
    return ok(res, { book })
  }
  return methodNotAllowed(res, ['GET'])
}
