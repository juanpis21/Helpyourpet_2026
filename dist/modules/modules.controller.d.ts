import { ModulesService } from './modules.service';
import { Module } from './entities/module.entity';
export declare class ModulesController {
    private readonly modulesService;
    constructor(modulesService: ModulesService);
    findAll(): Promise<Module[]>;
    findOne(id: string): Promise<Module>;
    createInitialModules(): Promise<Module[]>;
    assignModulesToRole(roleId: string, body: {
        moduleNames: string[];
    }): Promise<any>;
}
