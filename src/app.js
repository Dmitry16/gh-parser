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
const cpStreamFilter = fork('streamFilter.js')
const cpFetchProgress = fork('fetchProgress.js')
//a variable to store filtered data
let filteredData = []
//fetching data and sending it to the child processes
function fetchData(conStrParam) {
  axios.get(conStrBase + conStrParam, conParams)
  .then(response => {
    console.log('filteredData1:')
    response.data
    .on('data', (chunk) => {
      console.log('filteredData2:')
      cpStreamFilter.send(chunk)
      cpFetchProgress.send('msg')
    })
    .on('end', () => {
      cpStreamFilter.send('end')
    })
  })
  .catch((err) => console.error(err.message))
}
//Promisifing collecting filtered data from the child process
function collectFilteredData() {
  return new Promise( resolve => {
    cpStreamFilter.on('message', msg => {
      resolve(filteredData = [...filteredData, ...msg])
    })
  })
}
//sequentializing async tasks
async function justDoIt() {
  await fetchData('/comments')
  await collectFilteredData()
  .then(console.log)
}

console.log('Progress of fetching: ')
justDoIt()

// const promises = conStrParamsArr.map(fetchData)
// const results = Promise.all(promises)
// results.then( data => console.log('data:::', data) )
