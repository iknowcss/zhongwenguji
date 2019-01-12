#!/bin/bash

set -e

projectRoot=$1
if [[ -z "$projectRoot" ]]; then
    projectRoot='.'
fi

echo "Run server tests..."
(
  set -e
  cd $projectRoot/server
  npm run ci:test
)
