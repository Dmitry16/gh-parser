
const logUpdate = require('log-update')

let resourceCounter = 0
let comments = 0
let user = ''
let commits = 0
let progress = ''
let repo = process.env.REPO
let period = process.env.PERIOD

process.on('message', msg => {
    
    if (msg === '#') 
        progress += msg
    else 
        dataHandler(JSON.parse(msg))
    
logUpdate(`

Fetching comments for past ${period} days for "${repo}"...

${progress}

${comments} comments, ${user} (${commits} commits)

`);

})

const dataHandler = (data) => {
    resourceCounter++
    Object.values(data).forEach( key => {
        if (resourceCounter < 3) { 
            if (data.length > 0 && user === key.user.login) {
                comments++
            } else if (data.length > 0 && user === '') {
                comments = 1
                user = key.user.login
            }
        } else { 
            commits = key.total
            // process.exit()
        }
    })
} 