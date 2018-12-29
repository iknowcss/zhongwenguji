#!/bin/bash

set -e

projectRoot=$1
if [[ -z "$projectRoot" ]]; then
    projectRoot='.'
fi

echo "Deploy client to S3..."
(
  set -e
  cd $projectRoot/zhongwenguji-server
  ./node_modules/.bin/sls deploy
)
