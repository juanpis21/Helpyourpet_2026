import { HealthCheckService, TypeOrmHealthIndicator, DiskHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';
import { PrometheusService } from './prometheus.service';
export declare class HealthController {
    private health;
    private db;
    private disk;
    private memory;
    private prometheusService;
    constructor(health: HealthCheckService, db: TypeOrmHealthIndicator, disk: DiskHealthIndicator, memory: MemoryHealthIndicator, prometheusService: PrometheusService);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult>;
    ready(): Promise<import("@nestjs/terminus").HealthCheckResult>;
    live(): Promise<import("@nestjs/terminus").HealthCheckResult>;
    getMetrics(): Promise<string>;
}
