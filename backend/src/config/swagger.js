// src/config/swagger.js
// Configuração do Swagger/OpenAPI - NOVAIX FITNESS

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NOVAIX FITNESS API',
      version: '1.0.0',
      description: 'API para o aplicativo de fitness NOVAIX',
      contact: {
        name: 'NOVAIX Support',
        email: 'suporte@novaixfitness.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: 'Token JWT do Supabase'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' }
          }
        },
        Workout: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            category: { type: 'string' },
            level: { type: 'string' },
            isPremium: { type: 'boolean' }
          }
        },
        Exercise: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            muscle_group: { type: 'string' },
            equipment: { type: 'string' }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
