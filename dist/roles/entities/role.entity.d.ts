import { User } from '../../users/entities/user.entity';
import { Emergencia } from '../../emergencias/entities/emergencia.entity';
import { Module } from '../../modules/entities/module.entity';
export declare class Role {
    id: number;
    name: string;
    description: string;
    users: User[];
    emergencias: Emergencia[];
    modules: Module[];
    createdAt: Date;
    updatedAt: Date;
}
