const apiBase = 'https://api.github.com'
const axios = require('axios')
const config = require('./config')
const fs = require('fs')
const { Transform, Readable } = require('stream');
// const chalk = require('chalk')
const { getRepo, getPeriod } = require('./argvParser')

const params = {
  responseType: 'stream',
  baseURL: apiBase,
  headers: {
    Authorization: `token ${config.GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
}
const INPUT = `/repos/${getRepo()}/comments`;


const reportProgress = new Transform({
  transform(chunk, encoding, callback) {
    process.stdout.write('......')
    callback(null, chunk)
  }
});

axios.get(INPUT, params)
  .then((response) => {
    response.data
      .pipe(reportProgress)
      .on('data', (chunk) => {
        const chunkStream = new Readable({
          read() {
            this.push(chunk),
            this.push(null)
          }
        })
        chunkStream.pipe(process.stdout)
      });
  })

// async function getRepoComments() {
//   try {
//     const response = await http.get(`/repos/${getRepo()}/comments`)
//     console.log('-------------------------------------')
//     console.dir(response.data, { colors: true, depth: 4 })
//   } catch (err) {
//     console.error(chalk.red(err))
//     console.dir(err.response.data, { colors: true, depth: 4 })
//   }
// }
