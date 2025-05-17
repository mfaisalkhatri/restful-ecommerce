FROM node:lts-alpine3.20 AS builder

WORKDIR /restful-ecommerce-app

COPY package*.json ./
RUN npm ci --only=production

COPY ./ ./

RUN npm cache clean --force && \
    rm -rf /root/.npm

FROM gcr.io/distroless/nodejs18-debian11

WORKDIR /restful-ecommerce-app

COPY --from=builder /restful-ecommerce-app /restful-ecommerce-app

EXPOSE 3004

CMD ["./app.js"]