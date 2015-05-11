# react-level

levelup API wrapper for react-native AsyncStorage
This modules uses our other module [asyncstorage-down](https://github.com/tradle/asyncstorage-down), which does all the work

```js
var level = require('react-level')
var db = level('path/to/db', { /*...options...*/ })
db.put('blah');
db.batch([
  { type: 'put', key: 'tasty', value: 'wheat' },
  { type: 'put', key: 'chicken', value: 'feet' }
])
```
