// @fileoverview Memcache wrapper

var MemcachedClient = require('memcached')

/**
 * MemcacheWrapper
 * @param obj config
 *  config.servers
 *  config.options
 */
var MemcachedWrapper = function(config) {
  var Mc = null

  getConnection = function() {
    Mc = new MemcachedClient(config.servers, config.options)
  }

  getConnection()

  errorHandler = function(cb) {
    return function(err, resp) {
      if (err) {
        console.log(err)
        cb(false)
      } else {
        cb(resp)
      }
    }
  }

  return {
    get: function(key,cb){
      Mc.get(key, errorHandler(cb))
    },
    
    set: function(key, value, ttl, cb) {
      Mc.set(key, value, ttl, errorHandler(cb))
    },

    remove: function(key, cb) {
      Mc.del(key, errorHandler(cb))
    },

    end: function() {
      Mc.end()
    }
  }
}

module.exports = function (config) {
  return new MemcachedWrapper(config)
}
