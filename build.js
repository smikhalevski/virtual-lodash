const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const getParameterNames = require('get-parameter-names');

const BUILD_DIR = './build';

function createModuleSource(key, value) {
  // Prevent baseSetToString to mimic original toString.
  value.toString = Function.prototype.toString;

  if (value.toString().includes('arguments') || _.isNative(value)) {
    return `var _${key} = require('lodash/${key}');

module.exports = function ${key}() {
  var length = arguments.length;
  var args = Array(length + 1);
  args[0] = this;
  for (var i = 0; i < length; ++i) {
    args[i + 1] = arguments[i];
  }
  return _${key}.apply(void 0, args);
};`;
  }

  const params = getParameterNames(value);
  if (params.length) {
    params[0] = 'this';

    return `var _${key} = require('lodash/${key}');

module.exports = function ${key}(${params.slice(1)}) {
  return _${key}(${params});
};`;
  }

  return `module.exports = require('lodash/${key}');`;
}

function createIndexSource(wrappedKeys) {
  return `module.exports = {
  ${wrappedKeys.map(key => `${key}: require('./${key}')`).join(',\n  ')}
};`;
}

fs.mkdirSync(BUILD_DIR);

const wrappedKeys = [];

for (const key of Object.keys(_)) {
  if (_.isFunction(_[key]) && fs.existsSync(`node_modules/lodash/${key}.js`)) {
    wrappedKeys.push(key);

    fs.writeFileSync(
        path.join(BUILD_DIR, key + '.js'),
        createModuleSource(key, _[key]) + '\n'
    );
  }
}

fs.writeFileSync(
    path.join(BUILD_DIR, 'index.js'),
    createIndexSource(wrappedKeys) + '\n'
);
