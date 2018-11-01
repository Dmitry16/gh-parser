const concat = require('concat-stream')
const { Readable, Transform } = require('stream')

const concatStream = concat(allChunks, callback)

// process.stdout.write('\n')

process.on('message', (chunk) => {
    const transform = new Transform({ 
        writableObjectMode: true,
    })
    // process.stdout.write('\n')
    if (chunk !== 'end') {
        transform.push(Buffer.from(chunk))
    }
    else { 
        transform.push(null)
    }
    transform
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