"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrometheusService = void 0;
const common_1 = require("@nestjs/common");
const prom_client_1 = require("prom-client");
let PrometheusService = class PrometheusService {
    constructor() {
        this.register = new prom_client_1.Registry();
        this.register.setDefaultLabels({
            app: 'clinic-pet-api',
        });
    }
    onModuleInit() {
        this.httpRequestsTotal = new prom_client_1.Counter({
            name: 'http_requests_total',
            help: 'Total number of HTTP requests',
            labelNames: ['method', 'route', 'status_code'],
            registers: [this.register],
        });
        this.activeConnections = new prom_client_1.Gauge({
            name: 'active_connections',
            help: 'Number of active connections',
            registers: [this.register],
        });
        this.databaseConnections = new prom_client_1.Gauge({
            name: 'database_connections',
            help: 'Number of active database connections',
            registers: [this.register],
        });
        this.httpRequestDuration = new prom_client_1.Histogram({
            name: 'http_request_duration_seconds',
            help: 'Duration of HTTP requests in seconds',
            labelNames: ['method', 'route'],
            buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
            registers: [this.register],
        });
        this.databaseQueryDuration = new prom_client_1.Histogram({
            name: 'database_query_duration_seconds',
            help: 'Duration of database queries in seconds',
            labelNames: ['query_type'],
            buckets: [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5],
            registers: [this.register],
        });
    }
    incrementHttpRequests(method, route, statusCode) {
        this.httpRequestsTotal.inc({ method, route, status_code: statusCode });
    }
    observeHttpRequestDuration(method, route, duration) {
        this.httpRequestDuration.observe({ method, route }, duration);
    }
    setActiveConnections(count) {
        this.activeConnections.set(count);
    }
    setDatabaseConnections(count) {
        this.databaseConnections.set(count);
    }
    observeDatabaseQueryDuration(queryType, duration) {
        this.databaseQueryDuration.observe({ query_type: queryType }, duration);
    }
    async getMetrics() {
        return await this.register.metrics();
    }
    getRegistry() {
        return this.register;
    }
};
exports.PrometheusService = PrometheusService;
exports.PrometheusService = PrometheusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrometheusService);
//# sourceMappingURL=prometheus.service.js.map