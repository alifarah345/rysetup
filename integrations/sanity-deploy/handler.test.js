import {createServer} from 'node:http'
import {once} from 'node:events'
import assert from 'node:assert/strict'
import test from 'node:test'
import {encodeSignatureHeader, SIGNATURE_HEADER_NAME} from '@sanity/webhook'
import {createHandler} from './handler.js'

const secret = 'test-signing-secret-used-only-in-local-tests'
const now = Date.now()
const event = {
  projectId:'ryikque3', dataset:'production', id:'ry.page.about', type:'page',
  operation:'update', wasApproved:true, isApproved:true, revision:'sample-revision',
}

async function withReceiver(dispatch, run) {
  const server = createServer(createHandler({secret,dispatch,clock:() => now})).listen(0,'127.0.0.1')
  await once(server,'listening')
  try {
    const base = 'http://127.0.0.1:' + server.address().port
    await run(async (payload, {timestamp = now, signingSecret = secret} = {}) => {
      const body = JSON.stringify(payload)
      const signature = await encodeSignatureHeader(body,timestamp,signingSecret)
      return fetch(base + '/sanity/publish',{
        method:'POST',headers:{[SIGNATURE_HEADER_NAME]:signature},body,
      })
    })
  } finally {
    server.close()
  }
}

test('approved publications and approved removals dispatch deterministic IDs', async () => {
  const dispatched = []
  await withReceiver(id => dispatched.push(id), async submit => {
    assert.equal((await submit(event)).status,202)
    assert.equal((await submit(event)).status,202)
    assert.equal((await submit({...event,operation:'delete',isApproved:false})).status,202)
    assert.match(dispatched[0],/^[0-9a-f]{64}$/)
    assert.equal(dispatched[0],dispatched[1])
    assert.notEqual(dispatched[0],dispatched[2])
  })
})

test('unapproved, draft, wrong dataset, expired and unsigned events never dispatch', async () => {
  await withReceiver(() => assert.fail('Unexpected dispatch'), async submit => {
    assert.equal((await submit({...event,id:'drafts.ry.page.about'})).status,200)
    assert.equal((await submit({...event,wasApproved:false,isApproved:false})).status,200)
    assert.equal((await submit({...event,dataset:'test'})).status,403)
    assert.equal((await submit(event,{timestamp:now - 31 * 60_000})).status,401)
    assert.equal((await submit(event,{signingSecret:'wrong secret'})).status,401)
  })
})

test('a failed GitHub dispatch is reported as retryable', async () => {
  await withReceiver(() => {throw new Error('sample failure')}, async submit => {
    assert.equal((await submit(event)).status,502)
  })
})
