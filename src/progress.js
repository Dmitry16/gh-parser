const logUpdate = require('log-update')
const leftPad = require('left-pad')
const chalk = require('chalk')

let progress = ''

process.on('message', msg => {

    progress += '#'
    if (progress.length === 80) progress = '' 

    logUpdate(`
        Fetching progress:${progress}
        `)
})