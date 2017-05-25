# virtual-lodash

[![npm version](https://badge.fury.io/js/virtual-lodash.svg?maxAge=600)](https://www.npmjs.com/package/virtual-lodash)
[![travis ci status](https://travis-ci.org/smikhalevski/virtual-lodash.svg?maxAge=600)](https://travis-ci.org/smikhalevski/virtual-lodash)

Wrapper functions for [Lodash](https://lodash.com) that can be used as virtual methods with [es6 bind operator](https://github.com/tc39/proposal-bind-operator).

```es6
import {camelCase} from 'virtual-lodash';
// or
import camelCase from 'virtual-lodash/camelCase';

'FOO_BAR'::camelCase(); // → 'fooBar'
```

## Performance

Implementation of wrapper functions is performance oriented and uses `arguments` only if wrapped Lodash method does so.

For example, here is a wrapper function for `cloneWith` that has fixed [arity](https://en.wikipedia.org/wiki/Arity):
```js
var _cloneWith = require('lodash/cloneWith');

module.exports = function cloneWith(customizer) {
  return _cloneWith(this, customizer);
};
```

On the other hand, `union` method uses `arguments` object and so does corresponding wrapper:
```js
var _union = require('lodash/union');

module.exports = function union() {
  var length = arguments.length;
  var args = Array(length + 1);
  args[0] = this;
  for (var i = 0; i < length; ++i) {
    args[i + 1] = arguments[i];
  }
  return _union.apply(void 0, args);
};
```

## Versions

`virtual-lodash` has same versioning as Lodash itself, so `virtual-lodash@4.17.2` uses `lodash@4.17.2` under the hood. Project is automatically rebuild on the same day when new Lodash update arrives.

## License

The code is available under [MIT licence](LICENSE).
