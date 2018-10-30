const apiBase = 'https://api.github.com'
const axios = require('axios')
const config = require('./config')
const fs = require('fs')
const { Transform, Readable } = require('stream')
// const chalk = require('chalk')
const { getRepo, getPeriod } = require('./argvParser')
const { fork } = require('child_process')

const params = {
  responseType: 'stream',
  baseURL: apiBase,
  headers: {
    Authorization: `token ${config.GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
}
const INPUT = `/repos/${getRepo()}/comments`;


console.log('Progress of fetching: ')

const reportProgress = new Transform({
  transform(chunk, encoding, callback) {
    process.stdout.write('......')
    callback(null, chunk)
  }
})

const childProcess = fork('childProcess.js')

  axios.get(INPUT, params)
    .then((response) => {
      response.data
        .pipe(reportProgress)
        .on('data', (chunk) => {
          childProcess.send(chunk)
        })
    })
