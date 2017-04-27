#!/usr/bin/env bash

cd /opt
rm -Rf /opt/tikva
git clone git@github.com:irsan/tikva.git
cd /opt/tikva

cd public
bower install --allow-root

cd ../

npm i
grunt --gruntfile $GRUNTFILE | bunyan -L