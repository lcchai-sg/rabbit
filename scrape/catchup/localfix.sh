#!/bin/bash
export MESSAGE_HOST=127.0.0.1
export MESSAGE_USER=synopsis
export MESSAGE_PASS=synopsis
export MESSAGE_VHOST=/lc

ts-node fix.js
