import { Role } from '../../roles/entities/role.entity';
export declare class Module {
    id: number;
    name: string;
    description: string;
    roles: Role[];
    createdAt: Date;
    updatedAt: Date;
}
