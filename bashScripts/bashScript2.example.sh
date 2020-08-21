#!/bin/bash

#grab id from image built by first bash script
imageID=[[[Replace with Image ID]]]
dockerUsername=[[[Replace with your Docker Hub Username]]]
dockerRepoName=[[[Replace with the repo name found on Docker Hub]]]
#Dont forget to give new version number
version=[[[Replace with version number]]]

#enter password when prompted
docker login --username=$dockerUsername

docker tag $imageID $dockerUsername/$dockerRepoName:$version

docker push $dockerUsername/$dockerRepoName:$version
