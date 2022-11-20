const express = require('express')
const app = express()
require('dotenv').config()
const {connectDB} = require('./db/connect')

const port = process.env.PORT || 3000

const register = require('./routes/register')
const login = require('./routes/login')
const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')

//middleware
app.use(express.json())

//routes
app.use('/api/v1/register', register)
app.use('/api/v1/login', login)

app.use('*', notFound) //for none existing pages
app.use(errorHandler)

const start = async () => {
    try {
        connectDB.connect((err, db) => {
            if (err) {
                return console.error(err)
            }

            console.log('Connected to DB')
        })
        app.listen(port, (err, res) => {
            if (err) {
                return console.error(err)
            }

            console.log(`Server is listening on port ${port}...`)
        })
    }
    catch (err) {
        console.error(err)
    }
}

start()