const { ok, badRequest, notFound, methodNotAllowed } = require('../lib/http')
const { borrowBook } = require('../lib/data')
const { readJson } = require('../lib/http')

module.exports = async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const body = await readJson(req)
      const { userId, bookId } = body || {}
      if (!userId || !bookId) return badRequest(res, 'userId and bookId are required')
      const result = borrowBook(userId, bookId)
      if (result.error === 'USER_NOT_FOUND') return notFound(res, 'User not found')
      if (result.error === 'BOOK_NOT_FOUND') return notFound(res, 'Book not found')
      if (result.error === 'SUBSCRIPTION_REQUIRED') return badRequest(res, 'Active subscription required')
      if (result.error === 'NO_COPIES_AVAILABLE') return badRequest(res, 'No copies available')
      return ok(res, result)
    } catch (e) {
      return badRequest(res, 'Invalid JSON')
    }
  }
  return methodNotAllowed(res, ['POST'])
}

