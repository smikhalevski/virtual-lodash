import fs from 'fs';
import _, {isFunction, range} from 'lodash';

function getArgs(func) {
  // First match everything inside the function argument parens.
  var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];

  // Split the arguments string into an array comma delimited.
  return args.split(',').map(function(arg) {
    // Ensure no inline comments are parsed and trim the whitespace.
    return arg.replace(/\/\*.*\*\//, '').trim();
  }).filter(function(arg) {
    // Ensure no undefined values are added.
    return arg;
  });
}

let index = '';

fs.mkdirSync('./build');

for (const [key, value] of Object.entries(_)) {
  if (isFunction(value)) {

    if (fs.existsSync(`node_modules/lodash/${key}.js`)) {
      const args = getArgs(value);
      args[0] = 'this';

      fs.writeFileSync(`./build/${key}.js`, `
var _${key} = require('lodash/${key}');

module.exports = function ${key}(${args.slice(1)}) {
  return _${key}.call(${args});
};
    `);
    }
  }
}
