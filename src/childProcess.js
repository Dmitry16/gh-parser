const concat = require('concat-stream')
const fs = require('fs')
const { Transform, Readable } = require('stream')

// const bufferStream = (chunk) => {
//     const readable = new Readable({encoding:'utf8'})
//     readable._read = () => {};
//     readable.push(Buffer.from(chunk))
//     readable.push(null)
//     return readable
// }

const concatStream = concat(allChunks, callback)

process.on('message', (msg) => {
    process.stdout.write('\n\n')
    const readable = new Readable({encoding:'utf8'})
    readable._read = () => {}
    if (msg !== 'end') readable.push(Buffer.from(msg))
    else readable.push(null)
    readable
    .pipe(concatStream)
    // .pipe(process.stdout)
})

function allChunks(all) {
    console.log(all)
}
function callback (err) {
    if (err) {
      console.error(err)
      process.exit(1)
    }
}