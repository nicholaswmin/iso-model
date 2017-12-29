'use strict'

const app = require('http').createServer()
const io = require('socket.io')(app)
const IsoModel = require('./index.js')

app.listen(2000, () => {
  console.info('Listening on 2000')
})

const partyData = new IsoModel({
  parties: [],
  roomName: 'Hola'
})

let subscribers = []

partyData.on('operation', payload => {
  subscribers.filter(subscriber => subscriber !== payload.id)
    .forEach(subscriber => {
      io.to(subscriber).emit('operation', payload)
    })
})

io.on('connection', socket => {
  socket.join('room-foo')

  subscribers.push(socket.id)

  socket.on('operation', payload => {
    partyData.applyOperation(socket.id, payload)
  })

  socket.on('disconnect', () => {
    subscribers = subscribers.filter(subscriber => subscriber.id !== socket.id)
  })

  socket.emit('initialize', partyData.getData())
})
