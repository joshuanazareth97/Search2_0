#! /bin/bash
git pull
docker kill $(docker ps -q)
sudo docker-compose -f docker-compose.yaml up --build
