(function() {
  'use strict';
  var debug, injectRemoteCtx;

  debug = require('debug')('loopback:component:remoteCtx');

  injectRemoteCtx = require('./inject-remote-ctx');

  module.exports = function(app, options) {
    var loopback;
    debug('initializing component');
    loopback = app.loopback;
    if (!options || options.enabled !== false) {
      injectRemoteCtx(app, options);
    } else {
      debug('component not enabled.');
    }
  };

}).call(this);

//# sourceMappingURL=index.js.map
