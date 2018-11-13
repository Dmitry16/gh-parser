const dataHandler = require('../helpers/dataFilter')
const dataOutput = require('../helpers/dataOutput')
const { Writable } = require('stream')

function createProcessingStream(
  contLength,
  resourceCounter,
  chunksLength,
  commentsObj,
  period,
) {
  const calcChunksPorcent = (contLength, oneChunkLength) => {
    chunksLength = chunksLength + oneChunkLength
    return Math.floor(chunksLength * 100 / contLength)
  }

  return new Writable({
    write(object, encoding, callback) {
      let fetchPercent = calcChunksPorcent(
        contLength,
        JSON.stringify(object).length,
      )

      dataHandler(object, resourceCounter, commentsObj)

      dataOutput(commentsObj, fetchPercent, period)

      callback()
    },

    objectMode: true,
  })
}
module.exports = createProcessingStream
