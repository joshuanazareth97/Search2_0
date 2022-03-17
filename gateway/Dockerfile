FROM node:16 as base

WORKDIR /code
COPY package*.json ./

FROM base as dev
RUN npm ci
RUN npm i -g nodemon
COPY . .
