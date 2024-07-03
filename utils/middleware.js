const errorHandler = (err, req, res, next) => {
  console.log(err.message)
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted Id' })
  }
}

const unknownPath = (req, res) => {
  res.status(404).send({ error: 'Path not found' })
}

module.exports = {
  errorHandler, unknownPath
}
