#!/usr/bin/env bash
ssh ubuntu@54.164.34.127 'cd /var/www/dropstarter.headzoo.io/ && git fetch --all && git reset --hard origin/master && yarn run build && bin/console cache:clear'
