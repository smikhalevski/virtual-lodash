#!/usr/bin/env bash

set -ex;

git config core.filemode false
git config --global user.name 'smikhalevski'
git config --global user.email 'smikhalevski@gmail.com'

npm run build;

VERSION=$(npm v lodash version);
if grep -q "$VERSION" package.json;
 then VERSION=$VERSION-$TRAVIS_BUILD_NUMBER;
fi;
npm version "$VERSION" -m 'Release v%s';

cp README.md LICENSE package.json build;
cd build;

npm config set '//registry.npmjs.org/:_authToken' "$NPM_TOKEN";
npm publish;

git push origin HEAD:$TRAVIS_BRANCH;
