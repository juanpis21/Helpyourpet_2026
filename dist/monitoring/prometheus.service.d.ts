import { OnModuleInit } from '@nestjs/common';
import { Registry } from 'prom-client';
export declare class PrometheusService implements OnModuleInit {
    private register;
    private httpRequestsTotal;
    private activeConnections;
    private databaseConnections;
    private httpRequestDuration;
    private databaseQueryDuration;
    constructor();
    onModuleInit(): void;
    incrementHttpRequests(method: string, route: string, statusCode: string): void;
    observeHttpRequestDuration(method: string, route: string, duration: number): void;
    setActiveConnections(count: number): void;
    setDatabaseConnections(count: number): void;
    observeDatabaseQueryDuration(queryType: string, duration: number): void;
    getMetrics(): Promise<string>;
    getRegistry(): Registry;
}
