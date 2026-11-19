import {createServer} from 'node:http'
import sirv from 'sirv'
import {leadPreview} from './lead-preview.mjs'

const assets = sirv('dist', {etag:true, dev:true})
const host = process.env.HOST || '127.0.0.1'
const port = Number(process.env.PORT || 4321)

function staticPreview(req, res) {
  if (req.url === '/') {
    res.writeHead(302, {Location:'/en/'})
    res.end()
    return
  }
  assets(req, res, () => {
    res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'})
    res.end('Page not found')
  })
}

createServer({requestTimeout:10_000}, (req, res) => {
  res.setHeader('X-Robots-Tag','noindex, nofollow')
  void leadPreview(req, res, () => staticPreview(req, res))
}).listen(port, host, () => console.log('Static preview on http://' + host + ':' + port))
