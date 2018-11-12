const makeConStringWithDate = (period, date) => {
  if (period !== 0) {
    return [
      '/comments',
      `/issues/comments?since=${date}`,
      `/pulls/comments?since=${date}`,
      '/stats/contributors',
      // '/rate_limit',
    ]
  }
  if (period === 0) {
    return [
      '/comments',
      '/issues/comments',
      '/pulls/comments',
      '/stats/contributors',
      // '/rate_limit',
    ]
  }
}
module.exports = makeConStringWithDate
