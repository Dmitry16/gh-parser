const showProgress = () => {
  let chunksCounter = 0

  return (childProcess, period, contentStats) => {

    if (chunksCounter < 100 && chunksCounter % 5 === 0) {
      childProcess.send(contentStats)
    }
    if (chunksCounter >= 100 && period < 300 && chunksCounter % 300 === 0) {
      childProcess.send(contentStats)
    }
    if (chunksCounter >= 100 && period > 300 && chunksCounter % 700 === 0) {
      childProcess.send(contentStats)
    }
    if (!contentStats) childProcess.send(contentStats)

    chunksCounter++
  }
}
module.exports = showProgress()
