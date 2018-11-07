let repo, period

const repoArgvIndex = process.argv.indexOf('--repo')
const periodArgvIndex = process.argv.indexOf('--period')

module.exports.getRepo = function() {
  //repo parametr check up
  if (repoArgvIndex !== -1) {
    return process.argv[repoArgvIndex + 1]
  }
  if (repoArgvIndex === -1) {
    console.log('pls provide --repo parameter')
    process.exit()
  }
}
module.exports.getPeriod = function() {
  //period parametr check up
  if (periodArgvIndex !== -1) {
    return parseInt(process.argv[periodArgvIndex + 1])
  }
  if (periodArgvIndex === -1) {
    // console.log('pls provide --period parameter')
    // process.exit()
    return 0
  }
}
