#!/usr/bin/env bash
ssh ubuntu@3.233.21.193 'cd /var/www/admin/ && git fetch --all && git reset --hard origin/master && bin/console assets:install --symlink && yarn run build && bin/console cache:clear'
