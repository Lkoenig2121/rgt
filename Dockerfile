FROM node:16-alpine

ARG APP_NAME
ARG HOST
ARG PORT
ARG NODE_ENV
ARG DATABASE_URL
ARG PUBLIC_DOMAIN

RUN apk update
RUN apk upgrade
RUN apk add bash
RUN apk add openssl1.1-compat

WORKDIR /app

RUN npm install prisma

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000

STOPSIGNAL SIGTERM

CMD ["npm", "start"]