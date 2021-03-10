#!/bin/bash
export MESSAGE_HOST=127.0.0.1
export MESSAGE_USER=synopsis
export MESSAGE_PASS=synopsis
export MESSAGE_VHOST=/lc

export DB_HOST=127.0.0.1
export DB_PORT=27017
export DB_USER=root
export DB_PASS=sysadmin
export DB_NAME=synopsis

node submit_lo.js
