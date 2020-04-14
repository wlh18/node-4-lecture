const express = require('express')
const massive = require('massive')
const session = require('express-session')
require('dotenv').config()
const authCtrl = require('./controllers/authController')
const checkForSession = require('./middlewares/checkForSession')
const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env

const app = express()

app.use(express.json())
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
    secret: SESSION_SECRET,
  })
)

app.post('/auth/register', checkForSession, authCtrl.register)
app.post('/auth/login', checkForSession, authCtrl.login)
app.delete('/auth/logout', authCtrl.logout)

massive({
  connectionString: CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
}).then((dbInstance) => {
  app.set('db', dbInstance)
  console.log('DB Connected')
  app.listen(SERVER_PORT, () =>
    console.log(`Authenticate me on port ${SERVER_PORT}`)
  )
})
