const bufferArr = []

process.on('message', chunk => {
  if (chunk !== 'end') {
    bufferArr.push(Buffer.from(chunk))
  } else {
    let buffer = Buffer.concat(bufferArr)
    process.send(JSON.parse(buffer.toString()))
  }
})
