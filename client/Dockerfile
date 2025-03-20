FROM node:23-alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm install -qy

COPY . .

ENTRYPOINT [ "npx", "expo", "start" ]