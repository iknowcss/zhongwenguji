#!/bin/bash

set -e

projectRoot=$1
if [[ -z "$projectRoot" ]]; then
    projectRoot='.'
fi

# Make env variables available to react build
export PUBLIC_URL="/"
export REACT_APP_STAGE=$STAGE

[ "$STAGE" = "staging" ] && DEPLOY_S3_BUCKET=staging.hanzishan.com
[ "$STAGE" = "production" ] && DEPLOY_S3_BUCKET=hanzishan.com

echo "Deploy client to S3..."
(
  set -e
  cd $projectRoot/client
  npm run ci:build
  aws s3 sync build/ s3://$DEPLOY_S3_BUCKET
)
