const axios = require('axios')
const moment = require('moment')
const config = require('../config')
const errorHandler = require('../errorHandlers')
const dataHandler = require('../helpers/dataFilter')
const showProgress = require('../helpers/progressBarDosifier')
const makeConStringWithDate = require('../helpers/conStringMaker')
const { getRepo, getPeriod } = require('../helpers/argvParser')
const { fork } = require('child_process')
//modules for stream parsing
const {parser} = require('stream-json')
const { Writable } = require('stream')
const {streamArray} = require('stream-json/streamers/StreamArray')
const {streamValues} = require('stream-json/streamers/StreamValues')
//modules for data output
const logUpdate = require('log-update')
const chalk = require('chalk')
const leftPad = require('left-pad')
//getting repo and period parameters
const repo = (process.env.REPO = getRepo())
const period = (process.env.PERIOD = getPeriod())
const date = moment()
  .subtract(period, 'days')
  .toISOString()
//constructing connection string
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

let commentsObj = {}
let userStatsArr = []
let resourceCounter = 0
let contLength

const makeProgress = (downloadPercent) => {
  const n = Math.floor(downloadPercent/ 10)
  return progress = '#'.repeat(n) + '.'.repeat(10-n)
}

async function fetchData(conStrParam) {
  
  //instantiating stream for filtering and writing data
  let processingStream = new Writable({
    write(object, encoding, callback) {

    // calculating fetching percentage
    const calcChunksPorcentTo = (contLength, oneChunkLength) => {
      chunksLength = chunksLength + oneChunkLength
      return  Math.floor(chunksLength * 100/ contLength)
      // return chunkLength
    }
    let fetchPercent = calcChunksPorcentTo(contLength, JSON.stringify(object).length)
  
    dataHandler(object, resourceCounter, commentsObj)

    userStatsArr = Object.entries(commentsObj).map(key => {
      return `${chalk.yellow(leftPad(key[1][0], 4))} comments, ${chalk.red(
        key[0],
      )} (${chalk.yellow(key[1][1])} commits)\n`
    })
    //filtered data output
    logUpdate(`

Fetching Progress: [${makeProgress(fetchPercent)}] ${fetchPercent}%

${chalk.green(userStatsArr.toString().replace(/,/g, ''))}

    `)
      
      callback()
    },
    objectMode: true
  })
  let chunksLength = 0
  let progress = '.'.repeat(10)
  const input =
    conStrParam !== '/rate_limit' ? conStrBase + conStrParam : conStrParam

  await axios
  .get(input, conParams)
  .then((response) => {
    contLength = response.headers['content-length']
    response.data
      .pipe(parser())
      .pipe(streamArray())
      .pipe(processingStream)
      .on('finish', () => {
        resourceCounter++
        // console.log(resourceCounter)
        if (resourceCounter === 5) process.exit()
      })
    })
    .catch(errorHandler)

}

async function sequentAsyncRunner() {
    for (const conStrParam of conStrParamsArr) {
      await fetchData(conStrParam)
    }
}

if (repo) {
  sequentAsyncRunner()
}
