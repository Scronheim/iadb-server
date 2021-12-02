module.exports = {
  jsonResponse: function(res, data, error, success=true, code=200) {
    return res.status(code).json({
      data,
      success,
      error,
    })
  },
}
