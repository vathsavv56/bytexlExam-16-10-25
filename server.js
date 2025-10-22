 // Minimal Express server to run Vercel-style API handlers on Render
const path = require('path')
const express = require('express')

// Import API route handlers
const booksIndex = require('./api/books/index')
const bookById = require('./api/books/[id]')
const subscriptionsIndex = require('./api/subscriptions/index')
const subscriptionByUser = require('./api/subscriptions/[userId]')
const borrowHandler = require('./api/borrow')
const returnHandler = require('./api/return')
const userHistory = require('./api/users/[userId]/history')

const app = express()

// Parse JSON bodies so lib/http.readJson can use req.body directly
app.use(express.json())

// Helper to adapt Next/Vercel handler signature to Express
function adapt(handler) {
  return async (req, res, next) => {
    try {
      // Merge path params into query to match req.query usage in handlers
      const mergedReq = Object.assign(Object.create(Object.getPrototypeOf(req)), req, {
        query: { ...(req.query || {}), ...(req.params || {}) }
      })
      await handler(mergedReq, res)
    } catch (err) {
      next(err)
    }
  }
}

// Routes
app.get('/api/books', adapt(booksIndex))
app.get('/api/books/:id', adapt(bookById))

app.get('/api/subscriptions', adapt(subscriptionsIndex))
app.post('/api/subscriptions', adapt(subscriptionsIndex))

app.get('/api/subscriptions/:userId', adapt(subscriptionByUser))
app.put('/api/subscriptions/:userId', adapt(subscriptionByUser))
app.patch('/api/subscriptions/:userId', adapt(subscriptionByUser))
app.delete('/api/subscriptions/:userId', adapt(subscriptionByUser))

app.post('/api/borrow', adapt(borrowHandler))
app.post('/api/return', adapt(returnHandler))

app.get('/api/users/:userId/history', adapt(userHistory))

// Serve the landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// Fallback 404 for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'NOT_FOUND', message: 'Route not found' })
})

// Error handler
app.use((err, req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' })
})

// Only start the server if run directly
if (require.main === module) {
  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
  })
}

module.exports = app

