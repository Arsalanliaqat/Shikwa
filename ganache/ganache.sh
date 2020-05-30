#!/usr/bin/env bash
# I don't have a better way to pass double quotes to docker CMD/ENTRYPOINT
# Sorry about it :P
node /app/ganache-core.docker.cli.js --quiet