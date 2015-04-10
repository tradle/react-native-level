'use strict';

var React = require('react-native');
var Promise = require('promise-es6').Promise;
var Readable = require('stream').Readable
var crypto = require('crypto');
var BATCH_SIZE = 10;

var {
  AsyncStorage
} = React;

function nodeify(promise, cb, ctx) {
  if (typeof cb !== 'function') return;

  promise.then(function (value) {
    cb.call(ctx, null, value);
  }, function (err) {
    cb.call(ctx, err);
  });
}

function DB(path) {
  this._path = path;
  this._prefix = crypto.createHash('sha256').update(path).digest('hex');
  this.createReadStream = streamer().bind(this);
  this.createValueStream = streamer(true).bind(this);
}

DB.prototype._normalizeKey = function(key) {
  return this._prefix + key;
}

DB.prototype._isKey = function(key) {
  return key.length > this._prefix.length &&
    key.slice(0, this._prefix.length) === this._prefix;
}

DB.prototype._denormalizeKey = function(key) {
  return key.slice(this._prefix.length);
}

DB.prototype.get = function(key, cb) {
  key = this._normalizeKey(key);
  nodeify(AsyncStorage.getItem(key), cb, this);
}

DB.prototype.put = function(key, val, cb) {
  key = this._normalizeKey(key);
  nodeify(AsyncStorage.setItem(key, val), cb, this);
}

DB.prototype.del = function(key, cb) {
  key = this._normalizeKey(key);
  nodeify(AsyncStorage.removeItem(key, val), cb, this);
}

DB.prototype.createKeyStream = function(options) {
  var self = this;

  if (options) throw new Error('options are not supported yet');

  var stream = new Readable();

  AsyncStorage.getAllKeys(function(err, keys) {
    keys.forEach(function(key) {
      if (self._isMyKey(key)) {
        stream.push(self._denormalizeKey(key));
      }
    });

    stream.end();
  });

  return stream;
}

function streamer(valOnly) {
  return function(options) {
    if (options) throw new Error('options are not supported yet');

    var self = this;
    var stream = new Readable();
    var togo = 0;

    AsyncStorage.getAllKeys(function(err, keys) {
      if (err) return stream.emit('error', err);

      var batch = [];
      for (var i = 0, l = keys.length; i < l; i++) {
        var key = keys[i];
        if (!self._isMyKey(key)) continue;

        batch.push(key);
        togo++;

        if (batch.length === BATCH_SIZE || i === l - 1) {
          execBatch(batch)
          batch.length = 0;
        }
      }
    });

    function execBatch(batch) {
      AsyncStorage.multiGet(batch, function(pairs) {
        for (var i = 0; i < BATCH_SIZE; i++, togo--) {
          var pair = pairs[i];
          if (valOnly) stream.push(pair[1]);
          else stream.push({
            key: self._denormalizeKey(pair[0]),
            value: pair[1]
          });
        }

        if (!togo) stream.end();
      });
    }

    return stream;
  }
}

module.exports = DB;
