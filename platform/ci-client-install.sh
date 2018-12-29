#!/bin/bash

set -e

projectRoot=$1
if [[ -z "$projectRoot" ]]; then
    projectRoot='.'
fi

echo "Install client dependencies..."
(
  set -e
  cd $projectRoot/zhongwenguji-client
  npm install
)
