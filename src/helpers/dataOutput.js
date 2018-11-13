//modules for data output
const logUpdate = require('log-update')
const chalk = require('chalk')
const leftPad = require('left-pad')

const makeProgress = downloadPercent => {
  const n = Math.floor(downloadPercent / 10)
  return '#'.repeat(n) + '.'.repeat(10 - n)
}

function dataOutput(commentsObj, fetchPercent, period) {
  //preparing output
  let userStatsArr = Object.entries(commentsObj).map(key => {
    return `${chalk.yellow(leftPad(key[1][0], 4))} comments, ${chalk.red(
      key[0],
    )} (${chalk.yellow(key[1][1])} commits)\n`
  })

  //outputting the data
  return logUpdate(`

Fetching for past ${period} days. Progress: [${makeProgress(fetchPercent)}] ${
  fetchPercent
}%

${chalk.green(userStatsArr.toString().replace(/,/g, ''))}

    `)
}

module.exports = dataOutput
