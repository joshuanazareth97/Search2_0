#! /bin/bash
git pull
docker build . -f Dockerfile.production -t frontend && docker run -p 80:50102 -it frontend:latest
