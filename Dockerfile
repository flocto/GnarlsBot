FROM node:20.8-bookworm as build

RUN mkdir -p /usr/src/GnarlsBot
WORKDIR /usr/src/GnarlsBot
COPY . /usr/src/GnarlsBot

RUN npm install

CMD ["npm", "run", "dev"]