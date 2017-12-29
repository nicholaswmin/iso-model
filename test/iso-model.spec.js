'use strict'

const chai = require('chai')
const IsoModel = require('../index.js')

chai.should()

const idSocket = 'foo-id-socket'
const testData = {
  parents: [
    {
      id: '1514537152535',
      name: 'Foo',
      children: [
        {
          id: '234234234232',
          name: 'Small Foo'
        },
        {
          id: '239894923888',
          name: 'Small Bac'
        }
      ]
    }
  ],
  cardName: 'Hawaii'
}

let model

beforeEach(() => {
  model = new IsoModel(testData)
})

describe('instantiation', () => {
  it('instantiates', () => {
    model.should.be.ok
  })
})

describe('#getData', () => {
  it('returns the current data structure', () => {
    const data = model.getData()

    data.should.deep.equal(testData)
  })
})

describe('#applyOperation', () => {
  describe('--set', () => {
    it('sets the value of a property by path', () => {
      const data = model.applyOperation(idSocket, {
        operation: 'set',
        data: {
          path: 'cardName',
          value: 'Honolulu'
        }
      }).getData()

      data.cardName.should.equal('Honolulu')
    })

    it('emits the operation', done => {
      model.on('operation', payload => {
        payload.id.should.equal(idSocket)
        payload.operation.should.equal('set')
        payload.data.path.should.equal('cardName')
        payload.data.value.should.equal('Hawaii')
        done()
      })

      model.applyOperation(idSocket, {
        operation: 'set',
        data: {
          path: 'cardName',
          value: 'Hawaii'
        }
      })
    })
  })

  describe('--push', () => {
    it('pushes an item in an Array property by path', () => {
      const data = model.applyOperation(idSocket, {
        operation: 'push',
        data: {
          path: 'parents.0.children',
          item: {
            id: '918239819991',
            name: 'Small Bar'
          }
        }
      }).getData()

      data.parents[0].children.should.have.length(3)
    })

    it('emits the operation', done => {
      model.on('operation', payload => {
        payload.id.should.equal(idSocket)
        payload.operation.should.equal('push')
        payload.data.path.should.equal('parents.0.children')
        payload.data.item.should.deep.equal({
          id: '918239819991',
          name: 'Small Baz'
        })
        done()
      })

      model.applyOperation(idSocket, {
        operation: 'push',
        data: {
          path: 'parents.0.children',
          item: {
            id: '918239819991',
            name: 'Small Baz'
          }
        }
      })
    })
  })

  describe('--splice', () => {
    it('splices an Array from a position to another position', () => {
      const data = model.applyOperation(idSocket, {
        operation: 'splice',
        data: {
          path: 'parents.0.children',
          from: 0,
          to: 1
        }
      }).getData()

      data.parents[0].children.should.have.length(1)
      data.parents[0].children[0].id.should.equal('239894923888')
    })

    it('emits the operation', done => {
      model.on('operation', payload => {
        payload.id.should.equal(idSocket)
        payload.operation.should.equal('splice')
        payload.data.path.should.equal('parents.0.children')
        payload.data.should.deep.equal({
          path: 'parents.0.children', from: 0, to: 1
        })
        done()
      })

      model.applyOperation(idSocket, {
        operation: 'splice',
        data: {
          path: 'parents.0.children',
          from: 0,
          to: 1
        }
      })
    })
  })
})
