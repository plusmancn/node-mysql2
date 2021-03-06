var mysql = require('../../../../index.js');
var common = require('../../../common');
var connection = common.createConnection();
var assert = require('assert');

var payload = 'привет, мир';

function tryEncoding (encoding, cb) {
  connection.query('set character_set_results = ?', [encoding], function (err) {
    connection.query('SELECT ?', [payload], function (err, rows, fields) {
      assert.ifError(err);
      var iconvEncoding = encoding;
      if (encoding == 'utf8mb4') {
        iconvEncoding = 'utf8';
      }
      assert.equal(mysql.CharsetToEncoding[fields[0].characterSet], iconvEncoding);
      assert.equal(fields[0].name, payload);
      assert.equal(rows[0][fields[0].name], payload);
      cb();
    });
  });
}

tryEncoding('cp1251', function () {
  tryEncoding('koi8r', function () {
    tryEncoding('cp866', function () {
      tryEncoding('utf8mb4', function () {
        connection.end();
      });
    });
  });
});
