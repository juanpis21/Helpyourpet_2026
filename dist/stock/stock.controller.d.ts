import { StockService } from './stock.service';
export declare class StockController {
    private readonly stockService;
    constructor(stockService: StockService);
    getProductosBajoStock(): Promise<import("../productos/entities/producto.entity").Producto[]>;
    getProductosPorVencer(dias?: number): Promise<import("../productos/entities/producto.entity").Producto[]>;
    getReporteStockPorCategoria(): Promise<any[]>;
    getReporteStockPorVeterinaria(): Promise<any[]>;
    getReporteValorTotalInventario(): Promise<any>;
    getAlertasStock(): Promise<any>;
}
