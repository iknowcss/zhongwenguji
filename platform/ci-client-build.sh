#!/bin/bash

set -e

projectRoot=$1
if [[ -z "$projectRoot" ]]; then
    projectRoot='./'
fi
echo "Project root: $projectRoot"

echo "Run client tests..."
( cd $projectRoot/zhongwenguji-client && npm run ci:test)

echo "Build client artifacts..."
( cd $projectRoot/zhongwenguji-client && npm run ci:build)
