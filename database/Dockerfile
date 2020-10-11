FROM node:12.6-alpine
WORKDIR /database
RUN npm install bluebird mysql
COPY ./database/ ./database/
COPY ./config.js ./
CMD node database/initiateSeeding.js
