#!/bin/sh

set -e

trap 'kill %1; kill %2' SIGINT
(cd client && BROWSER=none npm run start) & (cd server && npm run start)
