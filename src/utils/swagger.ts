import { Express, Request, Response } from 'express';
import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hive API V1',
      description: 'Hive API Information',
      contact: {
        name: 'Hampus Nilsson'
      },
      version: '1.0.0'
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'apiKey',
                name: 'x-auth-token',
                scheme: 'bearer',
                in: 'header',
            },
        }
    },
  },
  apis: [path.join(__dirname, '../api/v1/view/routes/**/*.ts')]
}

export function swaggerDocs(app: Express) {
    app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerOptions)));
}
