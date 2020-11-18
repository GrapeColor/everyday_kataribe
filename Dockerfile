FROM node:14

WORKDIR /discord_bot/everyday_kataribe

COPY package*.json ./
RUN npm i

COPY . .

CMD [ "npm", "start" ]
