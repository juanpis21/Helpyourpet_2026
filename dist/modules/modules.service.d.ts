import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Module } from './entities/module.entity';
import { Role } from '../roles/entities/role.entity';
export declare class ModulesService implements OnModuleInit {
    private moduleRepository;
    private roleRepository;
    constructor(moduleRepository: Repository<Module>, roleRepository: Repository<Role>);
    onModuleInit(): Promise<void>;
    findAll(): Promise<Module[]>;
    findOne(id: number): Promise<Module>;
    findByName(name: string): Promise<Module>;
    createInitialModules(): Promise<Module[]>;
    assignModulesToRole(roleId: number, moduleNames: string[]): Promise<Role>;
}
