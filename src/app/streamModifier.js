const dataHandler = require('../helpers/dataFilter')
const dataOutput = require('../helpers/dataOutput')
const { Writable } = require('stream')

function createProcessingStream(
  contLength,
  resourceCounter,
  chunksLength,
  statsObj,
  period,
) {
  const calcFetchPercent = (contLength, oneChunkLength) => {
    chunksLength = chunksLength + oneChunkLength
    return Math.floor(chunksLength * 100 / contLength)
  }

  return new Writable({
    write(object, encoding, callback) {
      let fetchPercent = calcFetchPercent(
        contLength,
        JSON.stringify(object).length,
      )
      dataHandler(object, resourceCounter, statsObj)

      dataOutput(statsObj, fetchPercent, period)

      callback()
    },

    objectMode: true,
  })
}
module.exports = createProcessingStream
