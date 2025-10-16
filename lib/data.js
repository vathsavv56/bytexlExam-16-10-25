const books = [
  { id: "1", title: "The Pragmatic Programmer", author: "Andrew Hunt", totalCopies: 3, availableCopies: 3 },
  { id: "2", title: "Clean Code", author: "Robert C. Martin", totalCopies: 5, availableCopies: 5 },
  { id: "3", title: "Design Patterns", author: "Erich Gamma", totalCopies: 2, availableCopies: 2 }
]

const users = [
  { id: "u1", name: "Alice" },
  { id: "u2", name: "Bob" },
  { id: "u3", name: "Charlie" }
]

const subscriptions = []
const transactions = []

function listBooks() {
  return books
}

function getBook(id) {
  return books.find(b => b.id === id) || null
}

function listSubscriptions() {
  return subscriptions
}

function getSubscription(userId) {
  return subscriptions.find(s => s.userId === userId) || null
}

function upsertSubscription(userId, plan) {
  const user = users.find(u => u.id === userId)
  if (!user) return { error: "USER_NOT_FOUND" }
  const existing = subscriptions.find(s => s.userId === userId)
  if (existing) {
    existing.plan = plan
    existing.active = true
    return { subscription: existing }
  }
  const sub = { userId, plan, active: true, startedAt: new Date().toISOString() }
  subscriptions.push(sub)
  return { subscription: sub }
}

function cancelSubscription(userId) {
  const sub = subscriptions.find(s => s.userId === userId)
  if (!sub) return { error: "SUBSCRIPTION_NOT_FOUND" }
  sub.active = false
  sub.canceledAt = new Date().toISOString()
  return { subscription: sub }
}

function borrowBook(userId, bookId) {
  const user = users.find(u => u.id === userId)
  if (!user) return { error: "USER_NOT_FOUND" }
  const sub = subscriptions.find(s => s.userId === userId && s.active)
  if (!sub) return { error: "SUBSCRIPTION_REQUIRED" }
  const book = books.find(b => b.id === bookId)
  if (!book) return { error: "BOOK_NOT_FOUND" }
  if (book.availableCopies <= 0) return { error: "NO_COPIES_AVAILABLE" }
  book.availableCopies -= 1
  const trx = { userId, bookId, type: "borrow", at: new Date().toISOString() }
  transactions.push(trx)
  return { book, transaction: trx }
}

function returnBook(userId, bookId) {
  const user = users.find(u => u.id === userId)
  if (!user) return { error: "USER_NOT_FOUND" }
  const book = books.find(b => b.id === bookId)
  if (!book) return { error: "BOOK_NOT_FOUND" }
  if (book.availableCopies >= book.totalCopies) return { error: "ALL_COPIES_ALREADY_RETURNED" }
  book.availableCopies += 1
  const trx = { userId, bookId, type: "return", at: new Date().toISOString() }
  transactions.push(trx)
  return { book, transaction: trx }
}

function getUserHistory(userId) {
  const user = users.find(u => u.id === userId)
  if (!user) return { error: "USER_NOT_FOUND" }
  const history = transactions.filter(t => t.userId === userId)
  return { user, history }
}

module.exports = {
  listBooks,
  getBook,
  listSubscriptions,
  getSubscription,
  upsertSubscription,
  cancelSubscription,
  borrowBook,
  returnBook,
  getUserHistory
}

