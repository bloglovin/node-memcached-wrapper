// @fileoverview Memcache wrapper

var MemcachedClient = require('../node-memcached');

/**
 * MemcacheWrapper
 * @param obj config
 *  config.servers
 *  config.options
 */
var MemcachedWrapper = function (config) {
  this.Mc = null;
  this.prefix = config.options.prefix || '';
  var self = this;

  delete config.options.prefix;

  var getConnection = function getConnection() {
    self.Mc = new MemcachedClient(config.servers, config.options);
  };

  getConnection();

  errorHandler = function(cb) {
    if ( ! cb) {
      var cb = function(resp) {};
    }

    return function(err, resp) {
      console.log(resp);
      if (err) {
        console.log(err);
        cb(false);
      } else {
        cb(resp);
      }
    }
  }

  prefixKey = function(key) {
    key = self.prefix + key;
    return key;
  }
}

/**
 * get
 * @param string key
 * @param function cb
 */
MemcachedWrapper.prototype.get = function get(key,cb) {
  this.Mc.get(prefixKey(key), errorHandler(cb));
}

/**
 * set
 * @param string key
 * @param mixed value
 * @param int ttl (seconds)
 * @param function cb
 */
MemcachedWrapper.prototype.set = function set(key, value, ttl, cb) {
  this.Mc.set(prefixKey(key), value, ttl, errorHandler(cb));
}

/**
 * remove
 * Simply removes a key from memcached
 * @param string key
 * @param function cb
 */
MemcachedWrapper.prototype.remove = function remove(key, cb) {
  this.Mc.del(prefixKey(key), errorHandler(cb));
}

/**
 * end
 * Disconnects from the cluster
 * Might not want to use this since there's currently
 * no way to reconnect
 */
MemcachedWrapper.prototype.end = function end() {
  this.Mc.end();
}

module.exports = function (config) {
  return new MemcachedWrapper(config);
}
