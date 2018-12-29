#!/bin/bash

set -e

projectRoot=$1
if [[ -z "$projectRoot" ]]; then
    projectRoot='./'
fi
echo "Project root: $projectRoot"

echo "Deploy client to S3..."
( cd $projectRoot/zhongwenguji-server && ./node_modules/.bin/sls deploy )
