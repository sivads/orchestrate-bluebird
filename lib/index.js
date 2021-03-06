/**
 * @fileoverview Root of the Orchestrate Object
 */

var assert = require('assert');
var Client = require('./client')
var Model = require('./model')
var util = require('util')

var Orchestrate = module.exports = {}

/**
 * Creates an instance of Client which can be used to access
 * the Orchestrate API.
 *
 * @param {string} token
 */
Orchestrate.connect = function(token) {
  assert(token, 'API key required.')
  return new Client(token)
}

/**
 * Creates an instance of Model
 *
 * @param {string} collection Name of collection
 * @param {Promise} object - Promise resolves with Orchestrate.client
 * @return {Model}
 */
Orchestrate.model = function(collection, db) {
  function model(document, key) {
    if (!(this instanceof model)) {
      return new model(document)
    }

    Model.call(this, document, key)
  }
  util.inherits(model, Model)

  var props = Object.getOwnPropertyNames(Model);
  props.forEach(function(name) {
    if (!(name in model)) {
      var destination = Object.getOwnPropertyDescriptor(Model, name)
      Object.defineProperty(model, name, destination)
    }
  })

  model.prototype.db = model.db = db
  model.prototype.collection = model.collection = collection
  model.prototype.model = model

  return model
}

Orchestrate.Errors = require('./error')