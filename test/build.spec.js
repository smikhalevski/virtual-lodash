const fs = require('fs');
const assert = require('assert');

describe('build.js', () => {

  it('creates index file', () => {
    const _ = require('../build/index');
    assert('cloneDeepWith' in _, 'Method cloneDeepWith not found in index.js exports');
  });

  it('clones arguments for functions with varargs', () => {
    const invokeMapSource = fs.readFileSync('./build/invokeMap.js');

    assert.equal(invokeMapSource, `var _invokeMap = require('lodash/invokeMap');

module.exports = function invokeMap() {
  var length = arguments.length;
  var args = Array(length + 1);
  args[0] = this;
  for (var i = 0; i < length; ++i) {
    args[i + 1] = arguments[i];
  }
  return _invokeMap.apply(void 0, args);
};
`);
  });

  it('clones arguments for native functions', () => {
    const isArraySource = fs.readFileSync('./build/isArray.js');

    assert.equal(isArraySource, `var _isArray = require('lodash/isArray');

module.exports = function isArray() {
  var length = arguments.length;
  var args = new Array(length + 1);
  args[0] = this;
  for (var i = 0; i < length; ++i) {
    args[i + 1] = arguments[i];
  }
  return _isArray.apply(void 0, args);
};
`);
  });

  it('creates simple for functions with named arguments', () => {
    const camelCaseSource = fs.readFileSync('./build/camelCase.js');

    assert.equal(camelCaseSource, `var _camelCase = require('lodash/camelCase');

module.exports = function camelCase() {
  return _camelCase(this);
};
`);
  });

  it('does not create proxies for functions without any arguments', () => {
    const stubArraySource = fs.readFileSync('./build/stubArray.js');

    assert.equal(stubArraySource, `module.exports = require('lodash/stubArray');
`);
  });

});

describe('lodash proxy', () => {

  it('functions with varargs can be virtually bound', () => {
    const concat = require('../build/concat');
    assert.deepEqual([1,2,3,4], concat.call([1], [2], [3,4]));
  });

  it('native functions can be virtually bound', () => {
    const isArray = require('../build/isArray');
    assert.equal(isArray.call([]), true);
    assert.equal(isArray.call(1), false);
  });

  it('functions with named arguments can be virtually boud', () => {
    const camelCase = require('../build/camelCase');
    assert.equal(camelCase.call('FOO_BAR'), 'fooBar');
  });

});
