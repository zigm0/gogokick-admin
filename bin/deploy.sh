#!/usr/bin/env bash
ssh ubuntu@18.208.184.10 'cd /var/www/gogokick.headzoo.io/ && git fetch --all && git reset --hard origin/master && bin/console assets:install --symlink && yarn run build && bin/console cache:clear'
