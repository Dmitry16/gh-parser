// require('events').EventEmitter.defaultMaxListeners = 200

// const concat = require('concat-stream')
// const { Readable } = require('stream')

// const concatStream = concat({}, allChunks)
const bufferArr = []

console.log('kuku!')

process.on('message', (chunk) => {
    // const readable = new Readable({ read() {} })
    if (chunk !== 'end') {
        // readable.push(Buffer.from(chunk))
        bufferArr.push(Buffer.from(chunk))
    }
    else { 
        // readable.push(null)
        // console.log('bufferArr', bufferArr)
        const buffer = Buffer.concat(bufferArr)
        process.send(JSON.parse(buffer.toString()))
    }
    // readable
    //     .pipe(concatStream)
})

// function allChunks(joined) {
//     const data = Object.values(JSON.parse(joined))
//     process.send(data)
// }

// function callback(err) {
//     if (err) {
//       console.error(err)
//       process.exit(1)
//     }
// }