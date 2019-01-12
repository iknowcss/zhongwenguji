#!/bin/bash

set -e

projectRoot=$1
if [[ -z "$projectRoot" ]]; then
    projectRoot='.'
fi

echo "Run client tests..."
(
  set -e
  cd $projectRoot/client
  npm run ci:test
)
