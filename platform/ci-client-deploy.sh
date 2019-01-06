#!/bin/bash

set -e

projectRoot=$1
if [[ -z "$projectRoot" ]]; then
    projectRoot='.'
fi

# Make env variables available to react build
REACT_APP_STAGE=$STAGE

echo "Deploy client to S3..."
(
  set -e
  cd $projectRoot/zhongwenguji-client
  npm run ci:build
  aws s3 sync build/ s3://$DEPLOY_S3_BUCKET
)
