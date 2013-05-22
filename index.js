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
    /**
     * get
     * @param string key
     * @param function cb
     */
    get: function(key,cb){
      Mc.get(key, errorHandler(cb))
    },

    /**
     * set
     * @param string key
     * @param mixed value
     * @param int ttl (seconds)
     * @param function cb
     */
    set: function(key, value, ttl, cb) {
      Mc.set(key, value, ttl, errorHandler(cb))
    },

    /**
     * remove
     * Simply removes a key from memcached
     * @param string key
     * @param function cb
     */
    remove: function(key, cb) {
      Mc.del(key, errorHandler(cb))
    },

    /**
     * end
     * Disconnects from the cluster
     * Might not want to use this since there's currently
     * no way to reconnect
     */
    end: function() {
      Mc.end()
    }
  }
}

module.exports = function (config) {
  return new MemcachedWrapper(config)
}
