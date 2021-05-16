#!/usr/bin/env bash

set -euxo pipefail

cd `dirname $0`

docker rm mo-dice-nginx || true

docker run \
  --name mo-dice-nginx \
  -p 8088:80 \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro \
  -v $(pwd)/modice.js:/etc/nginx/modice.js:ro \
  -v $(pwd)/core.js:/etc/nginx/core.js:ro \
  nginx:stable-alpine
