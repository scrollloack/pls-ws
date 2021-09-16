FROM node:14-buster

WORKDIR /app

RUN npm -v && node -v

COPY ./project/package*.json ./

RUN npm i -g @adonisjs/cli && \
  npm i -g pm2 && \
  npm i --quiet --production

COPY ./project .

EXPOSE 3333

RUN pwd && ls ./app -al

CMD ["pm2-runtime", "start", "server.js"]
