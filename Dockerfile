FROM node:12.6-alpine
WORKDIR /deliver-pickup
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .
CMD npm run start