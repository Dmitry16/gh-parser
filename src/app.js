const apiBase = 'https://api.github.com'
const axios = require('axios')
const config = require('./config')
const fs = require('fs')
const { Transform, Readable, Writable } = require('stream')
// const chalk = require('chalk')
const { getRepo, getPeriod } = require('./argvParser')
const { fork } = require('child_process')

const conParams = {
  responseType: 'stream',
  baseURL: apiBase,
  headers: {
    Authorization: `token ${config.GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
}
console.log('Progress of fetching: ')

const reportProgress = new Writable({
  write(chunk, encoding, callback) {
    process.stdout.write('.')
    callback(null, chunk)
  }
})

const conStrBase = `/repos/${getRepo()}`
const conStrParamsArr = ['/comments', '/issues/comments', '/pulls/comments', '/stats/contributors']

conStrParamsArr.forEach( conStrParam => {
  const childProcess = fork('childProcess.js')
  axios.get(conStrBase + conStrParam, conParams)
  .then(response => {
    response.data
      .on('data', () => {
        reportProgress.write('')
      })
      .on('data', (chunk) => {
        childProcess.send(chunk)
      })
      .on('end', () => {
        childProcess.send('end')
      })
  })
})
