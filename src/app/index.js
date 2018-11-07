const axios = require('axios')
const moment = require('moment')
const config = require('../config')
const errorHandler = require('../errorHandlers')
const showProgress = require('../helpers/progressBarDosifier')
const makeConStringWithDate = require('../helpers/conStringMaker')
const { getRepo, getPeriod } = require('../helpers/argvParser')
const { fork } = require('child_process')

const repo = process.env.REPO = getRepo()
const period = process.env.PERIOD = getPeriod()
const date = moment().subtract(period, 'days').toISOString()

const apiBase = 'https://api.github.com'
const conStrBase = `/repos/${repo}`
const conStrParamsArr = makeConStringWithDate(period, date)
const conParams = {
  responseType: 'stream',
  baseURL: apiBase,
  headers: {
    Authorization: `token ${config.GITHUB_PERSONAL_ACCESS_TOKEN}`,
  }
}
//forking child process for dataDisplay
let cpDataDisplay = fork('./app/dataDisplay')

//fetching data and sending it to the child processes
function fetchData(child, conStrParam) {
  
  const input = conStrParam !== '/rate_limit'
    ? conStrBase + conStrParam
    : conStrParam

  axios.get(input, conParams)
  .then(response => {
    response.data
      .on('data', chunk => {
        child.send(chunk)
        showProgress(cpDataDisplay)
      })
      .on('end', () => {
        child.send('end')
      })
  })
  .catch(errorHandler)
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
  const streamModifier = fork('./app/streamModifier.js')
  await fetchData(streamModifier, conParam)
  await transferFilteredData(streamModifier)
}

const sequentAsyncRunner = async () => {
  for (const conStrParam of conStrParamsArr)
    await asyncTuskRunner(conStrParam)
}

if (repo) sequentAsyncRunner()

