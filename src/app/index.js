const axios = require('axios')
const moment = require('moment')
const config = require('../config')
const errorHandler = require('../errorHandlers')
const makeConStringWithDate = require('../helpers/conStringMaker')
const { getRepo, getPeriod } = require('../helpers/argvParser')
//modules for stream parsing
const { parser } = require('stream-json')
const { streamArray } = require('stream-json/streamers/StreamArray')
// const {streamValues} = require('stream-json/streamers/StreamValues')

//getting repo and period parameters
const repo = getRepo()
const period = getPeriod() === 0 ? 'All' : getPeriod()
const date = moment()
  .subtract(period, 'days')
  .toISOString()
//making connection string
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
let chunksLength = 0
let commentsObj = {}
let resourceCounter = 0

async function fetchData(conStrParam) {
  //instantiating stream for filtering and writing data
  const createProcessingStream = require('./streamModifier')

  const input =
    conStrParam !== '/rate_limit' ? conStrBase + conStrParam : conStrParam

  await axios
    .get(input, conParams)
    .then(response => {
      let contLength = response.headers['content-length']
      let processingStream = createProcessingStream(
        contLength,
        resourceCounter,
        chunksLength,
        commentsObj,
        period
      )
      response.data
        .pipe(parser())
        .pipe(streamArray())
        .pipe(processingStream)
        .on('finish', () => {
          resourceCounter++
          if (resourceCounter === 5) {
            process.exit()
          }
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
