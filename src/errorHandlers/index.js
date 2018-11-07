const chalk = require('chalk')

const errorHandler = err => { 
    console.error(`Oops! We couldn't fetch data from ${chalk.red(err.response.config.url)} resource.`, err.message)
    if (err.response.headers['x-ratelimit-remaining'] === 0) {
      console.log(`You've just exhausted your rate limit!`)
    }
}
module.exports = errorHandler