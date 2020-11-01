FROM node:alpine3.12
WORKDIR /pickly-posts
COPY . .

RUN yarn --ignore-engines
CMD ["node", "server.js"]