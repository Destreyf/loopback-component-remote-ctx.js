
/*
Usage on operator hooks:
 the `ctx.options` is the remoteCtx.
    console.log('remoteCtx', ctx.options.remoteCtx.req.currentUser)
 */

(function() {
  var debug, extend, isFunction, semver,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  debug = require('debug')('loopback:component:remoteCtx');

  isFunction = require('util-ex/lib/is/type/function');

  extend = require('util-ex/lib/_extend');

  semver = require('semver');

  module.exports = function(app, options) {
    var ARG_NAME, BLACK_LIST, Model, REMOTE_ARG, WHITE_LIST, hasHttpCtxOption, item, j, k, l, len, len1, len2, loopback, methodBlackList, methodWhiteList, modelBlackList, modelWhiteList, ref, vModelName;
    loopback = app.loopback;
    if (!semver.gte(loopback.version, '2.37.0')) {
      throw new Error('loopback-component-remeote-ctx requires loopback 2.37.0 or newer');
    }
    ARG_NAME = options.argName || 'remoteCtx';
    REMOTE_ARG = 'options';
    BLACK_LIST = options.blackList || [];
    WHITE_LIST = options.whiteList || [];
    methodBlackList = [];
    methodWhiteList = [];
    modelBlackList = [];
    modelWhiteList = [];
    for (j = 0, len = BLACK_LIST.length; j < len; j++) {
      item = BLACK_LIST[j];
      if (item.indexOf('.') !== -1) {
        methodBlackList.push(item);
      } else {
        modelBlackList.push(item);
      }
    }
    for (k = 0, len1 = WHITE_LIST.length; k < len1; k++) {
      item = WHITE_LIST[k];
      if (item.indexOf('.') !== -1) {
        methodWhiteList.push(item);
      } else {
        modelWhiteList.push(item);
      }
    }
    ref = app.models();
    for (l = 0, len2 = ref.length; l < len2; l++) {
      Model = ref[l];
      vModelName = Model.modelName;
      if (!(!modelWhiteList.length || indexOf.call(modelWhiteList, vModelName) >= 0)) {
        continue;
      }
      if (modelBlackList.length && indexOf.call(modelBlackList, vModelName) >= 0) {
        continue;
      }
      Model.createOptionsFromRemotingContext = function(ctx) {
        var result;
        result = {};
        result[ARG_NAME] = ctx;
        return result;
      };
    }
    debug('argName:%s', ARG_NAME);
    debug('methodBlackList: %s', methodBlackList);
    debug('methodWhiteList: %s', methodWhiteList);
    debug('modelBlackList: %s', modelBlackList);
    debug('modelWhiteList: %s', modelWhiteList);
    hasHttpCtxOption = function(accepts) {
      var argDesc, i;
      i = 0;
      while (i < accepts.length) {
        argDesc = accepts[i];
        if (argDesc.arg === 'options' && argDesc.http && (argDesc.http === 'optionsFromRequest' || (isFunction(argDesc.http) && argDesc.http.name === 'createOptionsViaModelMethod'))) {
          return true;
        }
        i++;
      }
    };
    if (!process.env.GENERATING_SDK) {
      app.remotes().methods().forEach(function(method) {
        var vMethodName;
        vModelName = method.sharedClass.name;
        vMethodName = method.stringName;
        if (!(!modelWhiteList.length || indexOf.call(modelWhiteList, vModelName) >= 0)) {
          return;
        }
        if (!(!methodWhiteList.length || indexOf.call(methodWhiteList, vMethodName) >= 0)) {
          return;
        }
        if (modelBlackList.length && indexOf.call(modelBlackList, vModelName) >= 0) {
          return;
        }
        if (methodBlackList.length && indexOf.call(methodBlackList, vMethodName) >= 0) {
          return;
        }
        if (!hasHttpCtxOption(method.accepts)) {
          debug('method %s injected.', vMethodName);
          method.accepts.push({
            arg: REMOTE_ARG,
            description: '**Do not implement in clients**.',
            type: Object,
            http: function createOptionsViaModelMethod(ctx){
                var EMPTY_OPTIONS = {};
                var ModelCtor = ctx.method && ctx.method.ctor;
                if (!ModelCtor)
                  return EMPTY_OPTIONS;
                if (typeof ModelCtor.createOptionsFromRemotingContext !== 'function')
                  return EMPTY_OPTIONS;
                debug('createOptionsFromRemotingContext for %s', ctx.method.stringName);
                return ModelCtor.createOptionsFromRemotingContext(ctx);
                }
          });
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=inject-remote-ctx.js.map
