#!/usr/bin/env bash
set -e

npx yarn build
rm -rf ./dist
mv src/web/dist ./dist
