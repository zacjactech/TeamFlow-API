"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const nest_winston_1 = require("nest-winston");
const winston = __importStar(require("winston"));
async function bootstrap() {
    const logger = nest_winston_1.WinstonModule.createLogger({
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(winston.format.timestamp(), winston.format.ms(), winston.format.colorize(), winston.format.simple()),
            }),
        ],
    });
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { logger });
    const allowedOrigins = (process.env.ALLOWED_ORIGINS?.split(',') || ['http://127.0.0.1:3001'])
        .map((origin) => origin.trim())
        .filter(Boolean);
    app.use((0, helmet_1.default)({
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
    }));
    app.use((0, compression_1.default)());
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin ||
                allowedOrigins.includes(origin) ||
                allowedOrigins.includes('*')) {
                callback(null, true);
            }
            else {
                console.log('Blocked Origin:', origin);
                callback(null, false);
            }
        },
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Accept, Authorization',
    });
    app.setGlobalPrefix('api/v1', {
        exclude: ['health'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const httpAdapterHost = app.get(core_1.HttpAdapterHost);
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter(httpAdapterHost));
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    const SWAGGER_PATH = 'api/docs';
    app.use(`/${SWAGGER_PATH}/swagger-ui-bundle.js`, (_req, res) => {
        res.redirect('https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js');
    });
    app.use(`/${SWAGGER_PATH}/swagger-ui-standalone-preset.js`, (_req, res) => {
        res.redirect('https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js');
    });
    app.use(`/${SWAGGER_PATH}/swagger-ui.css`, (_req, res) => {
        res.redirect('https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css');
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('TeamFlow API')
        .setDescription('Scalable REST API with Auth, RBAC and Multi-tenancy')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup(SWAGGER_PATH, app, document, {
        customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
        customJs: [
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
        ],
    });
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}/api/v1`);
    console.log(`Swagger documentation available at: http://localhost:${port}/api/docs`);
}
void bootstrap();
//# sourceMappingURL=main.js.map