FROM node:lts

RUN mkdir /restful-ecommerce-app

WORKDIR /restful-ecommerce-app

COPY ./ ./

RUN npm install

CMD npm start