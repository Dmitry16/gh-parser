// calculating fetching percentage
let chunksLength = 0

const calcChunksPorcentTo = (contLength, oneChunkLength) => {
    chunksLength = chunksLength + oneChunkLength
    return  Math.floor(chunksLength * 100/ contLength)
}

module.exports = calcChunksPorcentTo