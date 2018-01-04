'use strict'

const path = require('path')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const IsomorphicModel = require('../index.js')

app.use('/example', express.static(__dirname + '/'))
app.use('/app', express.static(path.resolve(__dirname, '../isomorphic-model/')))
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

server.listen(2000, () => {
  console.info('Success! Navigate your browser to: http://localhost:2000')
})

const myData = new IsomorphicModel({
  parents: [
    {
      id: '1514537152535',
      name: 'Foo',
      children: [
        {
          id: '234234234232',
          name: 'Small Foo'
        }
      ]
    }
  ],
  cardName: 'Hola'
})

let subscribers = []

myData.on('operation', payload => {
  subscribers.filter(subscriber => subscriber !== payload.id)
    .forEach(subscriber => {
      io.to(subscriber).emit('operation', payload)
    })
})

io.on('connection', socket => {
  socket.join('room-foo')

  subscribers.push(socket.id)

  socket.on('operation', payload => {
    myData.applyOperation(socket.id, payload)
  })

  socket.on('disconnect', () => {
    subscribers = subscribers.filter(subscriber => subscriber.id !== socket.id)
  })

  socket.emit('initialize', myData.getData())
})
