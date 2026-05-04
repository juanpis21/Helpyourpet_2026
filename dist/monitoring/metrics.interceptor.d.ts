import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrometheusService } from './prometheus.service';
export declare class MetricsInterceptor implements NestInterceptor {
    private readonly prometheusService;
    constructor(prometheusService: PrometheusService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
