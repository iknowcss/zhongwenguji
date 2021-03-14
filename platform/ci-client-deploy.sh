#!/bin/bash

set -e

projectRoot=$1
if [[ -z "$projectRoot" ]]
then
    projectRoot='.'
fi

if [ "$STAGE" = "staging" ]
then
  PUBLIC_URL="/"
  DEPLOY_S3_BUCKET=staging.hanzishan.com
elif [ "$STAGE" = "production" ]
then
  PUBLIC_URL="https://d3s6t86za6yn71.cloudfront.net/"
  DEPLOY_S3_BUCKET=hanzishan.com
fi

# Make env variables available to react build
export REACT_APP_STAGE="$STAGE"
export PUBLIC_URL="$PUBLIC_URL"

echo "Deploy client to S3..."
(
  set -e
  cd "$projectRoot/client"
  yarn ci:build
  aws s3 sync build/ s3://$DEPLOY_S3_BUCKET
)
