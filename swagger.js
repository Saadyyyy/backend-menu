const swaggerJsdoc = require('swagger-jsdoc');

const baseUrl =
  process.env.SWAGGER_BASE_URL ||
  `http://localhost:${process.env.PORT || 5055}`;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Menu API',
      version: '1.0.0',
      description: 'A simple Express Menu API',
    },
    servers: [{ url: baseUrl }],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
