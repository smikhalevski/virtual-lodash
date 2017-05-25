#!/usr/bin/env bash

set -ex;

LODASH_VERSION='4.17.0-test';

if ! grep -q "$LODASH_VERSION" package.json;
then

  npm version "$LODASH_VERSION" -m 'Release v%s';

  cp README.md LICENSE package.json build;
  cd build;

  npm config set '//registry.npmjs.org/:_authToken' "$NPM_TOKEN";
  npm publish;

  git config core.filemode false
  git remote set-url origin https://${GH_TOKEN}@github.com/smikhalevski/virtual-lodash.git
  git push origin HEAD:$TRAVIS_BRANCH;

fi;
