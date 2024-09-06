import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Restful E-Commerce",
    version: "1.0.0",
    description: "A simple Node E-Commerce application for testing RESTful web services",
  },
  servers: [
    {
      url: "http://localhost:3004",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./app.js"],
};

const swaggerSpec = swaggerJsDoc(options);

export {swaggerUi, swaggerSpec};
