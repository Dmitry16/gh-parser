
process.on('message', msg => {
    process.stdout.write('\n')
    let data = JSON.parse(msg)
    // data = Object.values(data).reduce((acc, el, ind) => {
    //     acc.push(el.body)
    // }, [])
    console.log(data)
})