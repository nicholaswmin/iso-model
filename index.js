'use strict'

const EventEmitter = require('events').EventEmitter
const pathval = require('pathval')

class IsoModel extends EventEmitter {
  constructor(data) {
    super()
    this.data = data
  }

  set(path, value) {
    pathval.setPathValue(this.data, path, value)

    this.emit('set', { path, value })
    return this
  }

  push(path, item) {
    const arr = pathval.getPathValue(this.data, path)
    arr.push(item)

    this.emit('push', { path, item })
    return this
  }

  splice(path, from, to) {
    const arr = pathval.getPathValue(this.data, path)
    arr.splice(from, to)

    this.emit('splice', { from, to })
    return this
  }

  emit(operation, data) {
    super.emit('emit', { operation, data })
  }
}

const partyData = new IsoModel({
  parties: [],
  roomName: 'Hola'
})

partyData.on('emit', data => {
  console.log(data)
})

partyData.set('roomName', 'Bar')
  .push('parties', { name: 'Kitsios' })
  .push('parties', 'world')
  .set('parties.0.name', 'Kostas')
  .splice('parties', 0, 2)

console.log(JSON.stringify(partyData.data, null, 2))
