#!/bin/bash

set -e

projectRoot=$1
if [[ -z "$projectRoot" ]]; then
    projectRoot='./'
fi
echo "Project root: $projectRoot"

echo "Install AWS CLI..."
pip install --user awscli

echo "Deploy client to S3..."
( cd $projectRoot/zhongwenguji-client && aws s3 sync build/ s3://$DEPLOY_S3_BUCKET )
