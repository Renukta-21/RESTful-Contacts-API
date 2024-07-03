require('./utils/config.js')
const app = require('./app.js')

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server started on ${PORT}`)
  console.log('')
})
