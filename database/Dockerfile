FROM node:20-slim

RUN apt-get update && apt-get install

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=3002
EXPOSE 3002

CMD ["node", "index.js"]