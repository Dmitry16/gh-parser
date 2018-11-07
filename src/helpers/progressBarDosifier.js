const showProgress = () => {
  let chunksCounter = 0

  return childProcess => {
    if (chunksCounter < 200 && chunksCounter % 5 === 0) {
      childProcess.send('#')
    }
    if (chunksCounter === 200 || chunksCounter % 100 === 0) {
      childProcess.send('#')
    }
    chunksCounter++
  }
}
module.exports = showProgress()
