#!/usr/bin/env bash

cd /opt
rm -Rf /opt/tikva
git clone git@github.com:irsan/tikva.git
cd /opt/tikva

npm i
grunt | bunyan -L