import { Express } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { zodTypeToOpenApi } from '@/pkg/zodToOpenapi';
import { createUserDto } from '@auth/controllers/dto/createUser.dto';
import { signInDto } from '@auth/controllers/dto/signin.dto';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Express API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        CreateUserDto: zodTypeToOpenApi(createUserDto),
        LoginUserDto: zodTypeToOpenApi(signInDto),
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/apps/**/routes/**/*.ts'], // <--- adjust path
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
