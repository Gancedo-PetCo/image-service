#if a previous version of your image is already running, run the following. If brand new image, go to "bashScript5.sh" instead

#in AWS instance, run >docker ps to list your containers. Grab correct ID and enter below
runningContainerID=[[[Replace with container ID, see comment abovefor more info]]]
#in AWS instance, run >docker images to list your containers. Grab correct ID and enter below
runningImageID=[[[Replace with image ID, see comment abovefor more info]]]

docker stop $runningContainerID

docker rm $runningContainerID

# enter y when prompted
docker system prune

docker rmi $runningImageID


