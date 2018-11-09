const axios = require('axios')
const moment = require('moment')
const config = require('../config')
const errorHandler = require('../errorHandlers')
const showProgress = require('../helpers/progressBarDosifier')
const makeConStringWithDate = require('../helpers/conStringMaker')
const { getRepo, getPeriod } = require('../helpers/argvParser')
const { fork } = require('child_process')

const repo = (process.env.REPO = getRepo())
const period = (process.env.PERIOD = getPeriod())
const date = moment()
  .subtract(period, 'days')
  .toISOString()

const apiBase = 'https://api.github.com'
const conStrBase = `/repos/${repo}`
const conStrParamsArr = makeConStringWithDate(period, date)
const conParams = {
  responseType: 'stream',
  baseURL: apiBase,
  headers: {
    Authorization: `token ${config.GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
}
//forking child process for data handling
let cpDataDisplay = fork('./app/dataDisplay')

//fetching data and sending it to the child processes
function fetchData(child, conStrParam) {
  //calculating fetching percentage
  let chunksLength = 0
  const calcChunksPorcentTo = (contLength, chunkLength) => {
    chunksLength = chunksLength + chunkLength
    return  Math.floor(chunksLength * 100/ contLength)
  }

  const input =
    conStrParam !== '/rate_limit' ? conStrBase + conStrParam : conStrParam

  axios
    .get(input, conParams)
    .then(response => {
      const contLength = response.headers['content-length']
      response.data
        .on('data', chunk => {
          let downloadPercent = calcChunksPorcentTo(contLength, chunk.length)
          const contentStats = { 
            'resourseName': conStrParam,
            'downloadPercent': downloadPercent
          }
          child.send(chunk)
          showProgress(cpDataDisplay, period, contentStats)
        })
        .on('end', () => {
          showProgress(cpDataDisplay, period, false)
          child.send('end')
        })
    })
    .catch(errorHandler)
}
//Promisifing filtered data transfer from the child process
function transferFilteredData(child) {
  return new Promise(resolve => {
    child.on('message', msg => {
      resolve(cpDataDisplay.send(JSON.stringify(msg)))
    })
  })
}
//sequentializing async tasks
async function asyncTuskRunner(conParam) {
  const streamModifier = fork('./app/streamModifier.js')
  await fetchData(streamModifier, conParam)
  await transferFilteredData(streamModifier)
}

async function sequentAsyncRunner() {
  for (const conStrParam of conStrParamsArr) {
    await asyncTuskRunner(conStrParam)
  }
  process.exit(0)
}

if (repo) {
  sequentAsyncRunner()
}
