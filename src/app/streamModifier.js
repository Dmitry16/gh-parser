const dataHandler = require('../helpers/dataFilter')
const dataOutput = require('../helpers/dataOutput')
const calcChunksPorcentTo = require('../helpers/fetchingPercent')
const { Writable } = require('stream')

function createProcessingStream(params) {

  let [contLength, resourceCounter, commentsObj, userStatsArr, period] = params

  return new Writable({
    write(object, encoding, callback) {

      let fetchPercent = calcChunksPorcentTo(contLength, JSON.stringify(object).length)

      dataHandler(object, resourceCounter, commentsObj)

      dataOutput(commentsObj, fetchPercent)

      callback()
    },
    
    objectMode: true
  })
}
module.exports = createProcessingStream
