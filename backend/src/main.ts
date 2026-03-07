import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import helmet from 'helmet';
import compression from 'compression';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { Request, Response } from 'express';

async function bootstrap() {
  const logger = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          winston.format.colorize(),
          winston.format.simple(),
        ),
      }),
    ],
  });

  const app = await NestFactory.create(AppModule, { logger });

  const allowedOrigins = (
    process.env.ALLOWED_ORIGINS?.split(',') || ['http://127.0.0.1:3001']
  )
    .map((origin) => origin.trim())
    .filter(Boolean);

  // Security
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          scriptSrc: [
            `'self'`,
            `'unsafe-inline'`,
            `'unsafe-eval'`,
            'https://cdnjs.cloudflare.com',
          ],
          styleSrc: [
            `'self'`,
            `'unsafe-inline'`,
            'https://cdnjs.cloudflare.com',
            'https://fonts.googleapis.com',
          ],
          fontSrc: [`'self'`, 'https://fonts.gstatic.com'],
          imgSrc: [`'self'`, 'data:', 'https://validator.swagger.io'],
          connectSrc: [`'self'`, ...allowedOrigins],
        },
      },
    }),
  );
  app.use(compression());

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes('*')
      ) {
        callback(null, true);
      } else {
        console.log('Blocked Origin:', origin);
        callback(null, false);
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Versioning
  app.setGlobalPrefix('api/v1', {
    exclude: ['health'],
  });

  // Global Pipes & Filters
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger Documentation
  const SWAGGER_PATH = 'api/docs';

  // Redirect Swagger UI assets to CDN to resolve MIME type issues on Vercel
  app.use(
    `/${SWAGGER_PATH}/swagger-ui-bundle.js`,
    (_req: Request, res: Response) => {
      res.redirect(
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
      );
    },
  );
  app.use(
    `/${SWAGGER_PATH}/swagger-ui-standalone-preset.js`,
    (_req: Request, res: Response) => {
      res.redirect(
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
      );
    },
  );
  app.use(`/${SWAGGER_PATH}/swagger-ui.css`, (_req: Request, res: Response) => {
    res.redirect(
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    );
  });

  const config = new DocumentBuilder()
    .setTitle('TeamFlow API')
    .setDescription('Scalable REST API with Auth, RBAC and Multi-tenancy')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document, {
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
    ],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api/v1`);
  console.log(
    `Swagger documentation available at: http://localhost:${port}/api/docs`,
  );
}
void bootstrap();
