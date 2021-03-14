#!/bin/sh

set -e

trap 'kill %1; kill %2' INT
(cd client && BROWSER=none yarn start) & (cd server && yarn start)
