import { Repository } from 'typeorm';
import { Permission, ModuleName } from './entities/permission.entity';
export declare class PermissionsService {
    private permissionRepository;
    constructor(permissionRepository: Repository<Permission>);
    findByUserId(userId: number): Promise<Permission[]>;
    hasPermission(userId: number, moduleName: ModuleName, action?: string): Promise<boolean>;
    createDefaultPermissions(userId: number): Promise<Permission[]>;
    updatePermission(userId: number, moduleName: ModuleName, updates: Partial<Permission>): Promise<Permission>;
    grantModuleAccess(userId: number, moduleNames: ModuleName[]): Promise<void>;
    revokeModuleAccess(userId: number, moduleNames: ModuleName[]): Promise<void>;
}
