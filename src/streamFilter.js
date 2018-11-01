const concat = require('concat-stream')
const { Readable } = require('stream')

const concatStream = concat(allChunks, callback)

process.on('message', (msg) => {
    process.stdout.write('\n')
    const readable = new Readable({encoding:'utf8'})
    readable._read = () => {}
    if (msg !== 'end') readable.push(Buffer.from(msg))
    else readable.push(null)
    readable
    .pipe(concatStream)
})

function allChunks(all) {
    const data = Object.values(JSON.parse(all))
    process.send(data)
}
function callback(err) {
    if (err) {
      console.error(err)
      process.exit(1)
    }
}