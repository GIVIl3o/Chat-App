FROM node:12

WORKDIR /usr/src/app
COPY ./package.json ./

RUN npm install --silent

ENV databaseHostname=database

COPY . .

CMD [ "node", "index" ]
