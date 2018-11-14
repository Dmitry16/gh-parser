function dataHandler(obj, resourceCounter, statsObj) {
  if (resourceCounter < 4) {
    if (!statsObj[obj.value.user.login]) {
      statsObj[obj.value.user.login] = [1, 0]
    } else if (statsObj[obj.value.user.login]) {
      statsObj[obj.value.user.login][0]++
    }
  } else if (resourceCounter === 4 && statsObj[obj.value.author.login]) {
    statsObj[obj.value.author.login][1] = obj.value.total
  } else if (resourceCounter === 5) {
    statsObj.remaining = obj.value.rate.remaining
  }
}

module.exports = dataHandler
