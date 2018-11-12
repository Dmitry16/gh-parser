const axios = require('axios')
const moment = require('moment')
const config = require('../config')
const errorHandler = require('../errorHandlers')
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
//forking child process for data handling
// let cpDataDisplay = fork('./app/dataDisplay')

// let counter = 0
let commentsObj = {}
let userStatsArr = []
let resourceCounter = 0
let remaining 

function dataHandler(obj) {
  if (resourceCounter < 3) {
      if (!commentsObj[obj.value.user.login]) {
        commentsObj[obj.value.user.login] = [1, 0]
      } else if (commentsObj[obj.value.user.login]) {
        commentsObj[obj.value.user.login][0]++
      }
    }
    else if (resourceCounter === 3 && commentsObj[obj.value.author.login]) {
      commentsObj[obj.value.author.login][1] = obj.value.total
    } else if (resourceCounter === 4) {
      // rateLimit = obj.value.limit
      // remaining = obj.value.remaining
    }


  userStatsArr = Object.entries(commentsObj).map(key => {
    return `${chalk.yellow(leftPad(key[1][0], 4))} comments, ${chalk.red(
      key[0],
    )} (${chalk.yellow(key[1][1])} commits)\n`
  })
}

async function fetchData(conStrParam) {

  let processingStream = new Writable({
    write(object, encoding, callback) {

      dataHandler(object)
        logUpdate(`
          ${userStatsArr}
        `)
        // console.log(object.value.author.login)
        
        callback()
    },
    objectMode: true
  })
  //calculating fetching percentage
  // let chunksLength = 0
  // const calcChunksPorcentTo = (contLength, chunkLength) => {
  //   chunksLength = chunksLength + chunkLength
  //   return  Math.floor(chunksLength * 100/ contLength)
  // }
  const input =
    conStrParam !== '/rate_limit' ? conStrBase + conStrParam : conStrParam
  await axios
    .get(input, conParams)
    .then((response) => {
      const contLength = response.headers['content-length']
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
//Promisifing filtered data transfer from the child process
// function transferFilteredData(child) {
//   return new Promise(resolve => {
//     child.on('message', msg => {
//       resolve(cpDataDisplay.send(JSON.stringify(msg)))
//     })
//   })
// }
//sequentializing async tasks
//  function asyncTuskRunner(conParam) {
//   // const streamModifier = fork('./app/streamModifier.js')
//    fetchData(conParam)
//   // await transferFilteredData(streamModifier)
// }
async function sequentAsyncRunner() {
    for (const conStrParam of conStrParamsArr) {
      await fetchData(conStrParam)
    }
}

if (repo) {
  sequentAsyncRunner()
}
