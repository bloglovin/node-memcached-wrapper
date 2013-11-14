// @fileoverview Memcache wrapper

var MemcachedClient = require('memcached');

/**
 * MemcacheWrapper
 * @param obj config
 *  config.servers
 *  config.options
 */
var MemcachedWrapper = function (config) {
  this.Mc = null;
  this.prefix = config.options.prefix || '';
  this.compress = config.options.compress || true; // Not used because of broken library
  var self = this;

  delete config.options.prefix;
  delete config.options.compress;

  var getConnection = function getConnection() {
    self.Mc = new MemcachedClient(config.servers, config.options);
  };

  getConnection();
};

/**
 * get
 * @param string key
 * @param function cb
 */
MemcachedWrapper.prototype.get = function get(key,cb) {
  key = this._prefixKey(key);
  var self = this;
  
  this.Mc.get(key, function(err, resp) {
    if (!err && resp) {
      resp = JSON.parse(resp);
    }
    cb = self._errorHandler(cb);
    cb(err, resp);
  });
};

/**
 * set
 * @param string key
 * @param mixed value
 * @param int ttl (seconds)
 * @param function cb
 */
MemcachedWrapper.prototype.set = function set(key, value, ttl, cb) {
  value = JSON.stringify(value);
  this.Mc.set(this._prefixKey(key), value, ttl, this._errorHandler(cb));
};

/**
 * remove
 * Simply removes a key from memcached
 * @param string key
 * @param function cb
 */
MemcachedWrapper.prototype.remove = function remove(key, cb) {
  this.Mc.del(this._prefixKey(key), this._errorHandler(cb));
};

/**
 * end
 * Disconnects from the cluster
 * Might not want to use this since there's currently
 * no way to reconnect
 */
MemcachedWrapper.prototype.end = function end() {
  this.Mc.end();
};

// Private methods

MemcachedWrapper.prototype._errorHandler = function(cb) {
  if (!cb) {
    cb = function(resp) {};
  }

  return function(err, resp) {
    if (err) {
      console.log(err);
      cb(false);
    } else {
      cb(resp);
    }
  };
};

MemcachedWrapper.prototype._prefixKey = function(key) {
  key = this.prefix + key;
  return key;
};

module.exports = function (config) {
  return new MemcachedWrapper(config);
};

