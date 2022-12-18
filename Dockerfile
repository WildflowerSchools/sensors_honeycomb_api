FROM node:12.22.11-alpine

RUN mkdir -p /app
COPY package.json /app
COPY package-lock.json /app

WORKDIR /app

RUN npm install --only=production

COPY src/ /app/

CMD node index.js
