
#Pulling just built image
#You first have to login into docker with >docker login --username=nyzdeplo


dockerUsername=[[[Replace with your Docker Hub Username]]]
dockerRepoName=[[[Replace with the repo name found on Docker Hub]]]
#Dont forget to give new version number
version=[[[Replace with version number]]]

docker pull $dockerUsername/$dockerRepoName:$version

