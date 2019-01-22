FROM node:8.15.0-alpine

ENV NODE_ENV=development
WORKDIR /app

COPY ./app /app
RUN npm install

EXPOSE 3035