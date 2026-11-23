import {createHash} from 'node:crypto'
import {isValidSignature, decodeSignatureHeader, SIGNATURE_HEADER_NAME} from '@sanity/webhook'

const maxAge = 30 * 60_000
const documentTypes = new Set(['page','faq','siteSettings'])

export function createHandler({secret, dispatch, clock = Date.now}) {
  return async function handle(req, res) {
    const respond = (status, body) => {
      res.writeHead(status, {'Content-Type':'application/json','Cache-Control':'no-store'})
      res.end(JSON.stringify(body))
    }
    if (req.url === '/health' && req.method === 'GET') return respond(200,{ok:true})
    if (req.url !== '/sanity/publish') return respond(404,{ok:false})
    if (req.method !== 'POST') return respond(405,{ok:false})
    const signature = req.headers[SIGNATURE_HEADER_NAME]
    if (typeof signature !== 'string') return respond(401,{ok:false})

    let body
    try {
      const chunks = []
      let size = 0
      for await (const chunk of req) {
        size += chunk.length
        if (size > 8192) return respond(413,{ok:false})
        chunks.push(chunk)
      }
      body = Buffer.concat(chunks).toString('utf8')
    } catch {
      return respond(400,{ok:false})
    }

    try {
      const {timestamp} = decodeSignatureHeader(signature)
      if (Math.abs(clock() - timestamp) > maxAge || !await isValidSignature(body,signature,secret)) {
        return respond(401,{ok:false})
      }
    } catch {
      return respond(401,{ok:false})
    }

    let event
    try {
      event = JSON.parse(body)
    } catch {
      return respond(400,{ok:false})
    }
    if (event?.projectId !== 'ryikque3' || event.dataset !== 'production') return respond(403,{ok:false})
    if (typeof event.id !== 'string' || !event.id || /^(drafts|versions)\./.test(event.id) ||
        !documentTypes.has(event.type) || !['create','update','delete'].includes(event.operation) ||
        (event.wasApproved !== true && event.isApproved !== true)) {
      return respond(200,{ok:true,ignored:true})
    }
    if (typeof event.revision !== 'string' || !event.revision) return respond(400,{ok:false})

    const eventId = createHash('sha256').update(JSON.stringify([event.id,event.operation,event.revision])).digest('hex')
    try {
      await dispatch(eventId)
      return respond(202,{ok:true})
    } catch {
      console.error('Sanity deployment dispatch failed')
      return respond(502,{ok:false})
    }
  }
}
