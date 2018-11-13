// calculating fetching percentage
let chunksLength = 0

const calcChunksPorcent = (contLength, oneChunkLength) => {
  console.log('contLength', contLength)
  chunksLength = chunksLength + oneChunkLength
  return Math.floor(chunksLength * 100 / contLength)
}

module.exports = calcChunksPorcent
