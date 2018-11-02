const apiBase = 'https://api.github.com'
const axios = require('axios')
const config = require('./config')
const fs = require('fs')
const { Transform, Readable, Writable } = require('stream')
// const chalk = require('chalk')
const { getRepo, getPeriod } = require('./argvParser')
const { fork } = require('child_process')

const conParams = {
  responseType: 'stream',
  baseURL: apiBase,
  headers: {
    Authorization: `token ${config.GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
}

const conStrBase = `/repos/${getRepo()}`
const conStrParamsArr = [
    '/comments'
  , '/issues/comments'
  , '/pulls/comments'
  , '/stats/contributors'
]
//forking child processes for streamFilter and fetchProgress
let cpFetchProgress = fork('fetchProgress.js', [], {silent: true})
let cpDataDisplay = fork('dataDisplay.js')
// cpFetchProgress.stdout.on('data', data => process.stdout.write(data) )
//a variable to store filtered data
let filteredData = []
// fetching data and sending it to the child processes
function fetchData(child, conStrParam) {
  axios.get(conStrBase + conStrParam, conParams)
  .then(response => {
    response.data
    .on('data', (chunk) => {
      child.send(chunk)
      // cpFetchProgress.send('')
      process.stdout.write('#')
    })
    .on('end', () => {
      child.send('end')
    })
  })
  .catch((err) => console.error(err.message))
}
//Promisifing filtered data transfer from the child process
function collectFilteredData(child) {
  return new Promise( resolve => {
    child.on('message', msg => {
        resolve(cpDataDisplay.send(JSON.stringify(msg)))
    })
  })
}
//sequentializing async tasks
async function asyncTuskRunner(conParam) {
  const cpStreamFilter = fork('streamFilter.js')
  await fetchData(cpStreamFilter, conParam)
  await collectFilteredData(cpStreamFilter)
}

console.log('Progress of fetching: ')

const sequentAsyncRunner = async () => {
  for (const conStrParam of conStrParamsArr)
    await asyncTuskRunner(conStrParam)
}

sequentAsyncRunner()

