import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { User } from '../users/entities/user.entity';
import { Module } from '../modules/entities/module.entity';
export declare class RolesSeeder implements OnApplicationBootstrap {
    private readonly rolesRepository;
    private readonly usersRepository;
    private readonly moduleRepository;
    private readonly logger;
    constructor(rolesRepository: Repository<Role>, usersRepository: Repository<User>, moduleRepository: Repository<Module>);
    onApplicationBootstrap(): Promise<void>;
}
