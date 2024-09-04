const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Orders API',
        version: '1.0.0',
        description: 'An API to manage orders with authentication',
    },
    servers: [
        {
            url: 'http://localhost:3004', 
        },
    ],
};

// Options for swagger-jsdoc
const options = {
    swaggerDefinition,
    apis: ['./app.js'],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
