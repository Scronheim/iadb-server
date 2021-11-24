module.exports = {
  jsonResponse: function(res, data, errors=[], success=true, code=200) {
    return res.status(code).json({
      data: data,
      success: success,
      errors: errors,
    })
  },
}