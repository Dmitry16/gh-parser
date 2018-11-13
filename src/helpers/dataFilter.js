function dataHandler(obj, resourceCounter, commentsObj) {
    if (resourceCounter < 3) {
        if (!commentsObj[obj.value.user.login]) {
          commentsObj[obj.value.user.login] = [1, 0]
        } else if (commentsObj[obj.value.user.login]) {
          commentsObj[obj.value.user.login][0]++
        }
      }
      else if (resourceCounter === 3 && commentsObj[obj.value.author.login]) {
        commentsObj[obj.value.author.login][1] = obj.value.total
      } else if (resourceCounter === 4) {
        rateLimit = obj.value.limit
        remaining = obj.value.remaining
      }
}
module.exports = dataHandler