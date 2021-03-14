#!/bin/bash

set -e

projectRoot=$1
if [[ -z "$projectRoot" ]]; then
    projectRoot='.'
fi

echo "Install server dependencies..."
(
  set -e
  cd "$projectRoot/server"
  yarn
)
