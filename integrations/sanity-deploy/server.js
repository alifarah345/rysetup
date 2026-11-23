import {createServer} from 'node:http'
import {createHandler} from './handler.js'

const {SANITY_DEPLOY_SECRET, GITHUB_DEPLOY_TOKEN, HOST = '127.0.0.1', PORT = '4324'} = process.env
if (!SANITY_DEPLOY_SECRET || SANITY_DEPLOY_SECRET.length < 32 || !GITHUB_DEPLOY_TOKEN) {
  throw new Error('Configure the Sanity signing secret and GitHub deployment token.')
}

async function dispatch(eventId) {
  const response = await fetch('https://api.github.com/repos/alifarah345/rysetup/actions/workflows/sanity-publish.yml/dispatches', {
    method:'POST',
    headers:{
      Authorization:'Bearer ' + GITHUB_DEPLOY_TOKEN,
      Accept:'application/vnd.github+json',
      'X-GitHub-Api-Version':'2022-11-28',
      'Content-Type':'application/json',
    },
    body:JSON.stringify({ref:'main',inputs:{event_id:eventId}}),
    signal:AbortSignal.timeout(10_000),
  })
  if (!response.ok) throw new Error('GitHub rejected the dispatch')
}

createServer({requestTimeout:15_000}, createHandler({secret:SANITY_DEPLOY_SECRET,dispatch}))
  .listen(Number(PORT), HOST, () => console.log('Sanity deploy receiver listening'))
