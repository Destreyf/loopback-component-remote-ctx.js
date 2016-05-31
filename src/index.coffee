'use strict'
debug = require('debug')('loopback:component:remoteCtx')
injectRemoteCtx = require('./inject-remote-ctx')

module.exports = (app, options) ->
  debug 'initializing component'
  loopback = app.loopback
  loopbackMajor = loopback and loopback.version and loopback.version.split('.')[0] or 1
  if loopbackMajor < 2
    throw new Error('loopback-component-remeote-ctx requires loopback 2.0 or newer')

  injectRemoteCtx(app, options)
  return
