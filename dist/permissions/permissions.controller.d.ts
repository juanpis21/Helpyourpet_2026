import { PermissionsService } from './permissions.service';
import { Permission, ModuleName } from './entities/permission.entity';
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    getUserPermissions(userId: string): Promise<Permission[]>;
    getMyPermissions(req: any): Promise<Permission[]>;
    checkPermission(req: any, moduleName: ModuleName): Promise<{
        hasAccess: boolean;
    }>;
    createDefaultPermissions(userId: string): Promise<Permission[]>;
    updatePermission(userId: string, moduleName: ModuleName, updates: Partial<Permission>): Promise<Permission>;
    grantModuleAccess(userId: string, body: {
        moduleNames: ModuleName[];
    }): Promise<void>;
    revokeModuleAccess(userId: string, body: {
        moduleNames: ModuleName[];
    }): Promise<void>;
}
