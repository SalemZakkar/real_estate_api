FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY . /usr/src/app/

COPY .env.docker /usr/src/app/

RUN mv -f /usr/src/app/.env.docker /usr/src/app/.env

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start:prod"]