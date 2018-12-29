#!/bin/bash

set -e

echo "Install client dependencies..."
( cd ../zhongwenguji-client && npm i )

echo "Install server dependencies..."
( cd ../zhongwenguji-server && npm i )
