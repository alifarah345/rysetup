const interests = new Set(['general','business-setup/mainland','business-setup/free-zone','pro-services','visa-residency','packages'])
const recent = new Map()
const windowMs = 60_000

setInterval(() => {
  for (const [ip, entry] of recent) {
    if (entry.expires <= Date.now()) recent.delete(ip)
  }
}, windowMs).unref()

function respond(res, status, accepted = false) {
  res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'})
  res.end(JSON.stringify({accepted, delivered:false}))
}

export async function leadPreview(req, res, next) {
  if (req.url !== '/api/lead') return next()
  if (req.method !== 'POST') return respond(res, 405)
  if (!req.headers['content-type']?.startsWith('application/x-www-form-urlencoded')) return respond(res, 415)
  const allowedOrigins = (process.env.RY_PREVIEW_ORIGIN || 'http://127.0.0.1:4321,http://localhost:4321').split(',')
  if (!allowedOrigins.includes(req.headers.origin)) return respond(res, 403)

  const ip = req.socket.remoteAddress
  const now = Date.now()
  let attempt = recent.get(ip)
  if (!attempt || attempt.expires <= now) {
    attempt = {expires:now + windowMs,count:0}
    recent.set(ip, attempt)
  }
  if (++attempt.count > 10) return respond(res, 429)
  try {
    let body = ''
    for await (const chunk of req) {
      body += chunk
      if (body.length > 8192) {
        respond(res, 413)
        return
      }
    }
    const data = new URLSearchParams(body)
    const name = data.get('name')?.trim()
    const email = data.get('email')?.trim()
    const interest = data.get('interest')
    const locale = data.get('locale')
    const source = data.get('source') || ''
    const message = data.get('message') || ''
    const quiz = data.get('quiz') || ''
    if (!name || name.length > 100 || !email || email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        !interests.has(interest) || !['en','ar'].includes(locale) ||
        !/^\/(en|ar)\/[a-z/-]+\/$/.test(source) || !source.startsWith('/' + locale + '/') ||
        message.length > 1000 || (quiz && !/^(local|remote|unknown)\.(client|trade|other)\.(yes|no|unsure)$/.test(quiz)) ||
        data.get('consent') !== 'yes' || data.get('website')) {
      return respond(res, 422)
    }
    return respond(res, 200, true)
  } catch {
    if (!res.headersSent) respond(res, 400)
  }
}
