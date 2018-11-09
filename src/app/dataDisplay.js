const logUpdate = require('log-update')
const leftPad = require('left-pad')
const chalk = require('chalk')

let resourceCounter = 0
let userStatsArr = []
let commentsObj = {}
let progress = '..........'
let rateLimit = 5000
let remaining = 'x'
let repo = process.env.REPO
let period = process.env.PERIOD === '0' ? 'All' : process.env.PERIOD
let downloadPercent = 0
let resorceName = ''

const makeProgress = (downloadPercent) => {
  const n = Math.floor(downloadPercent/ 10)
  progress = '#'.repeat(n) + '.'.repeat(10-n)
}

process.on('message', msg => {

  if (typeof msg === 'object') {
    resorceName = msg.resourseName
    downloadPercent = msg.downloadPercent
    makeProgress(downloadPercent)
  } else if (typeof msg === 'string') {
    dataHandler(JSON.parse(msg))
  } else if (!msg) {
    makeProgress(downloadPercent = 100)
  }

  logUpdate(`

Fetching comments for past ${chalk.yellow(period)} days for "${chalk.yellow(
  repo,
)}"...

Rate Limit: ${rateLimit}, Remaining: ${remaining}

[${progress}] ${downloadPercent}% from ${resorceName}

${chalk.green(userStatsArr.toString().replace(/,/g, ''))}
            
    `)
})

function dataHandler(data) {
  Object.values(data).forEach((key, ind) => {
    if (resourceCounter < 3) {
      if (!commentsObj[key.user.login]) {
        commentsObj[key.user.login] = [1, 0]
      } else if (commentsObj[key.user.login]) {
        commentsObj[key.user.login][0]++
      }
    } else if (resourceCounter === 3 && commentsObj[key.author.login]) {
      commentsObj[key.author.login][1] = key.total
    } else if (resourceCounter === 4) {
      rateLimit = key.limit
      remaining = key.remaining
    }
  })

  userStatsArr = Object.entries(commentsObj).map(key => {
    return `${chalk.yellow(leftPad(key[1][0], 4))} comments, ${chalk.red(
      key[0],
    )} (${chalk.yellow(key[1][1])} commits)\n`
  })

  resourceCounter++
}
