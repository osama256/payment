FROM node:alpine3.11

WORKDIR /market

COPY . .

RUN npm i

CMD ["npm","start"]