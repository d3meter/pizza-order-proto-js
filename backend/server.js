const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()

app.use(express.json()) 

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`))
})

app.use('/img', express.static(`${__dirname}/data/img`))

app.use('/public', express.static(`${__dirname}/../frontend/public`))

app.get('/pizza', (req, res) => {
    fs.readFile(`${__dirname}/data/pizza.json`, (err, data) => {
      if (err) {
        console.log('hiba:', err)
        res.status(500).send('hibavan')
      } else {
        res.status(200).send(JSON.parse(data))
      }
    })
  })

  app.post('/',(req, res) => {
    let orderData = JSON.stringify(req.body)
    let currentDate = Date.now()
    let filePath = `${__dirname}/data/orders/pizzas-order-${currentDate}.json`
    fs.writeFile(filePath, orderData, (err) => {
      if(err) {
          return res.send(err)
      } else {
          return res.send({response: 'done'})
      }
    })
}) 


app.listen(2000, console.log('server listening on http://127.0.0.1:2000'))