# Library API (Vercel-ready)

Endpoints

- GET /api/books
- GET /api/books/:id
- GET /api/subscriptions
- POST /api/subscriptions  body: {"userId":"u1","plan":"pro"}
- GET /api/subscriptions/:userId
- PUT|PATCH /api/subscriptions/:userId  body: {"plan":"pro"}
- DELETE /api/subscriptions/:userId
- POST /api/borrow  body: {"userId":"u1","bookId":"1"}
- POST /api/return  body: {"userId":"u1","bookId":"1"}
- GET /api/users/:userId/history

Preview

- Open index.html or deploy on Vercel to browse links.

Local syntax check

- npm run test:syntax

