import { Repository } from 'typeorm';
import { Producto } from '../productos/entities/producto.entity';
import { MovimientoInventario } from '../movimientos/entities/movimiento-inventario.entity';
import { ProductosService } from '../productos/productos.service';
export declare class StockService {
    private productosRepository;
    private movimientosRepository;
    private productosService;
    constructor(productosRepository: Repository<Producto>, movimientosRepository: Repository<MovimientoInventario>, productosService: ProductosService);
    getProductosBajoStock(): Promise<Producto[]>;
    getProductosPorVencer(dias?: number): Promise<Producto[]>;
    getReporteStockPorCategoria(): Promise<any[]>;
    getReporteStockPorVeterinaria(): Promise<any[]>;
    getReporteValorTotalInventario(): Promise<any>;
    getAlertasStock(): Promise<any>;
}
