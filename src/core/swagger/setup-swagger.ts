import path from 'path';
import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

/*Объект, описывающий опции документации Swagger.*/
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Bloggers API', version: '1.0.0', description: 'Bloggers API' },
  },

  /*Указываем откуда брать документацию для Swagger. В данном случае все файлы .yml в папке "src". С таким способом
  указания пути Swagger работает на vercel.com.*/
  apis: [path.resolve(process.cwd(), 'src/**/*.swagger.yml')],
};

/*Генерируем документацию API в формате Swagger.*/
const swaggerSpec = swaggerJsdoc(swaggerOptions);

/*Функция "setupSwagger()" для инициализации документации Swagger. В данном случае UI собираем удаленно, чтобы Swagger
работал на vercel.com.*/
export const setupSwagger = (app: Express) => {
  app.get('/swagger.json', (_req, res) => res.json(swaggerSpec));

  app.use(
    '/api',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerOptions: { url: '/swagger.json' },
      customCssUrl: 'https://unpkg.com/swagger-ui-dist@latest/swagger-ui.css',
      customJs: [
        'https://unpkg.com/swagger-ui-dist@latest/swagger-ui-bundle.js',
        'https://unpkg.com/swagger-ui-dist@latest/swagger-ui-standalone-preset.js',
      ],
    }),
  );
};
