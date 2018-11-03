const logUpdate = require('log-update')
let resourceCounter = 0
let comments = 0
let user = ''
let commits = 0

process.on('message', msg => {
    // process.stdout.write('\n')
    let data = JSON.parse(msg)

    dataHandler(data)
    
    logUpdate(`
        ${comments} comments, ${user} (${commits} commits)
    `);
    // console.log(data)
})

const dataHandler = (data) => {
    resourceCounter++
    Object.values(data).forEach((key, ind) => {
        if (resourceCounter < 3) { 
            if (data.length > 0) {
                comments++
                user = key.user.login
            }
        } else { commits = key.total }
    })
} 