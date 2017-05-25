#!/bin/bash

set -ex;

VERSION=$(npm v lodash version);
if grep -q "$VERSION" package.json;
 then VERSION=$VERSION-$TRAVIS_BUILD_NUMBER;
fi;
npm version "$VERSION" -m 'Release v%s';

cp README.md LICENSE package.json build;
cd build;

npm config set '//registry.npmjs.org/:_authToken' "$NPM_TOKEN";
npm publish;

git config --global user.name 'smikhalevski'
git config --global user.email 'smikhalevski@gmail.com'
git push origin HEAD:$TRAVIS_BRANCH;
