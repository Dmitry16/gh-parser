const showProgress = () => {
  let chunksCounter = 0

  return (childProcess, period) => {
    if (chunksCounter < 100 && chunksCounter % 5 === 0) {
      childProcess.send('#')
    }
    if (chunksCounter >= 100 && period < 300 && chunksCounter % 300 === 0) {
      childProcess.send('#')
    }
    if (chunksCounter >= 100 && period > 300 && chunksCounter % 700 === 0) {
      childProcess.send('#')
    }
    chunksCounter++
  }
}
module.exports = showProgress()
