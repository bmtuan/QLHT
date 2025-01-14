import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cors from 'cors';
import auth from './routes/auth.js'
import mongoose from 'mongoose'

const URI = 'mongodb+srv://messithanh2k:messithanh2k@qlht.kpuwx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const app = express()
const port = 3001

app.use(express.json())
app.use(morgan('combined'))
app.use(bodyParser.json({ limit: '30mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }))
app.use(cors())

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to DB')
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  }).catch((err) => {
    console.log('err', err)
  })

app.get('/', (req, res) => {
  res.send('HelloThanh!')
})

app.use('/auth', auth)
