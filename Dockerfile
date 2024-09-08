FROM node:lts

RUN mkdir /restful-ecommerce

WORKDIR /restful-ecommerce

COPY ./ ./

RUN npm install

CMD npm start