const logUpdate = require('log-update')
const leftPad = require('left-pad')
const chalk = require('chalk')

let resourceCounter = 0
let userStatsArr = []
let commentsObj = {}
let progress = ''
let repo = process.env.REPO
let period = process.env.PERIOD

process.on('message', msg => {
    
    if (msg === '#') {
        progress += msg
        if (progress.length === 80) progress = '' 
    }
    else {
        // console.log('dataDisplay::', JSON.parse(msg))
        dataHandler(JSON.parse(msg))
    }

    logUpdate(`

Fetching comments for past ${chalk.yellow(period)} days for "${chalk.yellow(repo)}"...

${progress}

${ chalk.green(userStatsArr.toString().replace(/,/g,'')) }
            
    `)
})

const dataHandler = (data) => {

    Object.values(data).forEach( (key, ind) => {
        if (data.length > 0 && resourceCounter < 3) {
            if (!commentsObj[key.user.login]) {
                commentsObj[key.user.login] = [1, 0]
            } else
            if (commentsObj[key.user.login]) {
                commentsObj[key.user.login][0]++
            }
        } else if (commentsObj[key.author.login]) {
            commentsObj[key.author.login][0] = key.total
        } 
        // else if (!commentsObj[key.author.login]) {
        //     commentsObj[key.author.login] = [0, key.total]
        // }
    })
    
    userStatsArr = Object.entries(commentsObj).map( key => {
        return `${chalk.yellow(leftPad(key[1][0], 4))} comments, ${chalk.red(key[0])} (${chalk.yellow(key[1][1])} commits)\n`
    })

    resourceCounter++
}