const concat = require('concat-stream')
const fs = require('fs')
const { Transform, Readable } = require('stream')

const bufferStream = (chunk) => {
    const readable = new Readable({encoding:'utf8'})
    readable._read = () => {};
    readable.push(Buffer.from(chunk))
    return readable
}

const concatStream = concat(() => bufferStream(chunk))

process.on('message', (chunk) => {
    process.stdout.write('\n\n')
    bufferStream(chunk)
    .pipe(process.stdout)
})