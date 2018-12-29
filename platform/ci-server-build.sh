#!/bin/bash

set -e

projectRoot=$1
if [[ -z "$projectRoot" ]]; then
    projectRoot='./'
fi
echo "Project root: $projectRoot"

echo "Run server tests..."
( cd $projectRoot/zhongwenguji-server && npm run ci:test )

echo "Build server artifacts..."
( cd $projectRoot/zhongwenguji-server && npm run ci:build )
