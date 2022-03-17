FROM node:16 as base

WORKDIR /code
COPY package*.json ./

EXPOSE 8000

FROM base as dev
ENV NODE_ENV=development
RUN npm ci
COPY . .

CMD ["npm", "start"]
