import express from 'express'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173', credentials: true }))

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
const ADMIN_PASSWORDS = (process.env.ADMIN_PASSWORDS || '').split(',').map(s => s.trim()).filter(Boolean)
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'dev_secret_change_me'

function checkAdmin(email, password) {
  const e = (email || '').toLowerCase().trim()
  if (ADMIN_EMAILS.length === 0 || ADMIN_PASSWORDS.length === 0) {
    // Local dev fallback (not for production)
    const demoEmails = ['fenilmuneer@gmail.com']
    const demoPasswords = ['vpm@2522']
    return demoEmails.includes(e) && demoPasswords.includes(password)
  }
  return ADMIN_EMAILS.includes(e) && ADMIN_PASSWORDS.includes(password)
}

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ message: 'Missing credentials' })
  if (!checkAdmin(email, password)) return res.status(401).json({ message: 'Invalid credentials' })

  const token = jwt.sign({ email, admin: true }, JWT_SECRET, { expiresIn: '8h' })
  res.cookie('hc_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000,
  })
  return res.json({ ok: true })
})

app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('hc_token')
  return res.json({ ok: true })
})

// Middleware to protect endpoints — example usage for future admin APIs
export function ensureAdmin(req, res, next) {
  const token = req.cookies?.hc_token || (req.headers.authorization && req.headers.authorization.split(' ')[1])
  if (!token) return res.status(401).json({ message: 'Missing token' })
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    if ((payload).admin) {
      req.admin = payload
      return next()
    }
    return res.status(403).json({ message: 'Forbidden' })
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

app.get('/', (req, res) => res.send('Admin auth server running'))

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Admin auth server listening on http://localhost:${PORT}`)
})
