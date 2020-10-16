FROM node:alpine3.12
WORKDIR /pickly-backend
COPY . .
RUN yarn
CMD ["node", "server.js"]