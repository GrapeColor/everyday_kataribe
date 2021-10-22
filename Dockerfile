FROM node:16

WORKDIR /app/everyday_kataribe

COPY package*.json ./
RUN ["npm", "ci", "--production"]

COPY dist/ ./dist

CMD [ "node", "dist/index.js" ]
