var tape   = require('tape')
var reactLevel = require('../')
var testCommon = require('abstract-leveldown/testCommon')

var testBuffer = new Buffer('foo')

/*** compatibility with basic LevelDOWN API ***/
require('abstract-leveldown/abstract/leveldown-test').args(reactLevel, tape, testCommon)
require('abstract-leveldown/abstract/open-test').open(reactLevel, tape, testCommon)
require('abstract-leveldown/abstract/put-test').all(reactLevel, tape, testCommon)
require('abstract-leveldown/abstract/del-test').all(reactLevel, tape, testCommon)
require('abstract-leveldown/abstract/get-test').all(reactLevel, tape, testCommon)
require('abstract-leveldown/abstract/put-get-del-test').all(reactLevel, tape, testCommon, testBuffer)
require('abstract-leveldown/abstract/batch-test').all(reactLevel, tape, testCommon)
require('abstract-leveldown/abstract/chained-batch-test').all(reactLevel, tape, testCommon)
require('abstract-leveldown/abstract/close-test').close(reactLevel, tape, testCommon)
require('abstract-leveldown/abstract/iterator-test').all(reactLevel, tape, testCommon)
require('abstract-leveldown/abstract/ranges-test').all(reactLevel, tape, testCommon)

// non abstract-leveldown tests:
// require('./custom-tests.js').all(reactLevel, tape, testCommon)
