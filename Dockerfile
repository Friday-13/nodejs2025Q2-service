FROM node:22.16-alpine

WORKDIR /usr/app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
