FROM node:14

WORKDIR /app/everyday_kataribe

COPY package*.json ./
RUN npm ci

COPY . .

CMD [ "node", "src/index.js" ]
