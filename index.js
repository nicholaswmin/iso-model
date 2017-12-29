'use strict'

const EventEmitter = require('events').EventEmitter
const pathval = require('pathval')

class IsoModel extends EventEmitter {
  constructor(data) {
    super()
    this.data = data
  }

  getData() {
    return this.data
  }

  set(path, value, idSocket) {
    pathval.setPathValue(this.data, path, value)

    this.emit('set', { path, value }, idSocket)
    return this
  }

  push(path, item, idSocket) {
    const arr = pathval.getPathValue(this.data, path)
    arr.push(item)

    this.emit('push', { path, item }, idSocket)
    return this
  }

  splice(path, from, to, idSocket) {
    const arr = pathval.getPathValue(this.data, path)
    arr.splice(from, to)

    this.emit('splice', { path, from, to }, idSocket)
    return this
  }

  emit(operation, data, idSocket) {
    super.emit('operation', { operation, data, id: idSocket })
  }

  applyOperation(idSocket, payload) {
    switch (payload.operation) {
      case 'set':
        this.set(payload.data.path, payload.data.value, idSocket)
        break;

      case 'push':
        this.push(payload.data.path, payload.data.item, idSocket)
        break;

      case 'splice':
        this.splice(payload.data.path, payload.data.from, payload.data.to, idSocket)
        break;
      default:
        console.warn('Cannot determine operation', paylod.operation)
    }
  }
}

module.exports = IsoModel
