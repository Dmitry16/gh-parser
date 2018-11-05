const apiBase = 'https://api.github.com'
const axios = require('axios')
const config = require('./config')
const fs = require('fs')
const moment = require('moment')
const { Transform, Readable, Writable } = require('stream')
const { getRepo, getPeriod } = require('./argvParser')
const { fork } = require('child_process')

const conParams = {
  responseType: 'stream',
  baseURL: apiBase,
  headers: {
    Authorization: `token ${config.GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
}

const repo = process.env.REPO = getRepo()
const period = process.env.PERIOD = getPeriod()
const date = moment().subtract(period, 'days').toISOString()

const conStrBase = `/repos/${repo}`
const conStrParamsArr = [
    `/comments?since${date}`
  ,`/issues/comments?since${date}`
  , `/pulls/comments?since${date}`
  ,`/stats/contributors`
]
//forking child processes for dataDisplay
let cpDataDisplay = fork('dataDisplay.js')

//fetching data and sending it to the child processes
function fetchData(child, conStrParam) {
  axios.get(conStrBase + conStrParam, conParams)
  .then(response => {
    response.data
      .on('data', (chunk) => {
        child.send(chunk)
        cpDataDisplay.send('#')
      })
      .on('end', () => {
        child.send('end')
      })
  })
  .catch((err) => console.error(err.message))
}
//Promisifing filtered data transfer from the child process
function transferFilteredData(child) {
  return new Promise( resolve => {
    child.on('message', msg => {
        resolve(cpDataDisplay.send(JSON.stringify(msg)))
    })
  })
}
//sequentializing async tasks
async function asyncTuskRunner(conParam) {
  const streamModifier = fork('streamModifier.js')
  await fetchData(streamModifier, conParam)
  await transferFilteredData(streamModifier)
}

const sequentAsyncRunner = async () => {
  for (const conStrParam of conStrParamsArr)
    await asyncTuskRunner(conStrParam)
}

if (repo && period) sequentAsyncRunner()

