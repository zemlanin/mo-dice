#!/usr/bin/env bash

set -euxo pipefail

cd `dirname $0`

docker run \
  --name mo-dice \
  -p 8088:80 \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro \
  -v $(pwd)/modice.js:/etc/nginx/modice.js:ro \
  -v $(pwd)/core.js:/etc/nginx/core.js:ro \
  nginx:stable-alpine
