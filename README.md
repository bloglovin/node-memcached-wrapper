node-memcached-wrapper
======================

A small memcached wrapper using node-memcached

Example usage
-------------
Init

```javascript
app.Mc = require('./memcache-wrapper')(config)

app.Mc.set('test_key', 'hejsan', 1200, function(resp) {})
```

Config 

```javascript
{
  "servers": {
    "127.0.0.1:11211":100
  },
  "options": {
    "maxKeySize":250,
    "maxExpiration":2592000,
    "maxValue":1048576,
    "poolSize":10,
    "algorithm":"crc32",
    "reconnect":20,
    "timeout":3,
    "retries":1,
    "retry":3,
    "remove":true,
    "keyCompression":true,
    "namespace:":""
  }
}
```

More documentation of options can be found at https://github.com/3rd-Eden/node-memcached