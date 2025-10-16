function sendJson(res, status, data) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(data))
}

function methodNotAllowed(res, allowed) {
  res.setHeader('Allow', allowed.join(', '))
  sendJson(res, 405, { error: 'METHOD_NOT_ALLOWED', allowed })
}

function badRequest(res, message, details) {
  sendJson(res, 400, { error: 'BAD_REQUEST', message, details })
}

function notFound(res, message) {
  sendJson(res, 404, { error: 'NOT_FOUND', message })
}

function ok(res, data) {
  sendJson(res, 200, data)
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch (e) {
    throw new Error('INVALID_JSON')
  }
}

module.exports = { sendJson, methodNotAllowed, badRequest, notFound, ok, readJson }

