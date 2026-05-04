"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const prometheus_service_1 = require("./monitoring/prometheus.service");
const metrics_interceptor_1 = require("./monitoring/metrics.interceptor");
const express_1 = require("express");
const path_1 = require("path");
const fs_1 = require("fs");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, express_1.json)({ limit: '10mb' }));
    app.use((0, express_1.urlencoded)({ limit: '10mb', extended: true }));
    const uploadsDirs = [
        (0, path_1.join)(__dirname, '..', 'uploads', 'publicaciones'),
        (0, path_1.join)(__dirname, '..', 'uploads', 'profiles'),
        (0, path_1.join)(__dirname, '..', 'uploads', 'pets')
    ];
    uploadsDirs.forEach(dir => {
        if (!(0, fs_1.existsSync)(dir)) {
            (0, fs_1.mkdirSync)(dir, { recursive: true });
        }
    });
    app.use('/uploads', (0, express_1.static)((0, path_1.join)(__dirname, '..', 'uploads')));
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    const prometheusService = app.get(prometheus_service_1.PrometheusService);
    app.useGlobalInterceptors(new metrics_interceptor_1.MetricsInterceptor(prometheusService));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('HelpyourPet API')
        .setDescription('API para gestión de clínica veterinaria')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(`Swagger documentation available at: http://localhost:${port}/api/docs`);
    console.log(`PgAdmin available at: http://localhost:5050`);
    console.log(`PostgreSQL running on: localhost:5432`);
}
bootstrap();
//# sourceMappingURL=main.js.map