FROM node:21-alpine

WORKDIR /app

COPY package*.json ./
COPY /dist ./dist

RUN npm ci


EXPOSE 3000

CMD ["node", "dist/main.js"]
