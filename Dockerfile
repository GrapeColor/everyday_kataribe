FROM node:16

WORKDIR /app/everyday_kataribe

COPY package*.json ./
RUN npm ci

COPY . .

CMD [ "node", "src/index.js" ]
