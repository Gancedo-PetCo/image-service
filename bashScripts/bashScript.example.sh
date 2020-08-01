#!/bin/bash

imageTagName=[[[Replace with tag name you use locally]]]

npm run build

docker build -t $imageTagName .
