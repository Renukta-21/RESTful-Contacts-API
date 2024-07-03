const morgan = require('morgan')

morgan.token('body', (req, res) => {
  if (req.method === 'POST' || req.method === 'PUT') return JSON.stringify(req.body)
})
const logger = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res).padEnd(5, ' '),
    tokens.url(req, res).padEnd(12, ' '),
    tokens.status(req, res).padEnd(5, ' '),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req, res)
  ].join(' ')
})

module.exports = {
  logger
}
