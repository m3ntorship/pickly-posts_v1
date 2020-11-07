FROM node:12.19.0-alpine3.10
WORKDIR /pickly-posts
COPY . .

RUN yarn --ignore-engines
CMD ["node", "server.js"]