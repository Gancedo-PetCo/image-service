
#BEFORE YOU RUN THE IMAGE YOU PULLED IN bashScript5.sh, if your DB is not running, you will have to run this file first
#NOTE: if the network isn't already running, you have to >docker network create "network name, without quotes"
networkName=[[[Replace with the network your DB is running on. To connect to existing network, run >docker network ls   and find correct network name]]]
aliasName=[[[Replace with the aliasName your DB is known by, on the network.  To connect to existing volume, run >docker volume ls   and find correct volume name]]]
volumeName=[[[Replace with the volume your DBs data will be persisted to]]]
mongoVersion=[[[Replace with the version of mongo you want to run]]]

docker run -d --network $networkName --network-alias $aliasName -v $volumeName:/etc/mongo mongo:$mongoVersion

