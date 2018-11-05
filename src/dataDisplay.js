const logUpdate = require('log-update')

let resourceCounter = 0
let comments = 0
let user = ''
let userStatsArr = []
let commentsObj = {}
let commits = 0
let progress = ''
let repo = process.env.REPO
let period = process.env.PERIOD

process.on('message', msg => {
    
    if (msg === '#') 
        progress += msg
    else {
        
        dataHandler(JSON.parse(msg))
    }

    logUpdate(`

Fetching comments for past ${period} days for "${repo}"...

${progress}

${ userStatsArr.toString().replace(/,/g,'') }
            
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
            commentsObj[key.author.login][1] = key.total
        } 
        // else if (!commentsObj[key.author.login]) {
        //     commentsObj[key.author.login] = [0, key.total]
        // }
    })

    let detailsArr = Object.entries(commentsObj).map( key => {
        return `${key[1][0]} comments, ${key[0]} (${key[1][1]} commits)\n`
    })

    resourceCounter++
    userStatsArr = [...detailsArr]
}