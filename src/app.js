const apiBase = 'https://api.github.com'

const axios = require('axios')
const config = require('./config')
const chalk = require('chalk')

const { getRepo, getPeriod } = require('./argvParser')

console.log('repoooo:::', getRepo())
console.log('period:::', getPeriod())

const http = axios.create({
  baseURL: apiBase,
  headers: {
    Authorization: `token ${config.GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
})

async function getRepoComments() {
  try {
    const response = await http.get(`/repos/${getRepo()}/comments`)
    console.log('-------------------------------------')
    console.dir(response.data, { colors: true, depth: 4 })
  } catch (err) {
    console.error(chalk.red(err))
    console.dir(err.response.data, { colors: true, depth: 4 })
  }
}

getRepoComments()
