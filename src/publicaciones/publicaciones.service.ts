import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publicacion } from './entities/publicacion.entity';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectRepository(Publicacion)
    private readonly publicacionesRepository: Repository<Publicacion>,
    private readonly usersService: UsersService,
  ) {}

  async create(createPublicacionDto: CreatePublicacionDto): Promise<Publicacion> {
    if (!createPublicacionDto.autorId) {
      throw new ConflictException('Se requiere un ID de autor para crear la publicación');
    }
    
    // Validar que el autor existe
    await this.usersService.findOne(createPublicacionDto.autorId);

    const publicacion = this.publicacionesRepository.create(createPublicacionDto);
    const savedPublicacion = await this.publicacionesRepository.save(publicacion);
    
    // Retornar la publicación sin relaciones para evitar errores de dependencia circular
    const result = Array.isArray(savedPublicacion) ? savedPublicacion[0] : savedPublicacion;
    return this.publicacionesRepository.findOne({
      where: { id: result.id },
      select: ['id', 'descripcion', 'imagen', 'autorId', 'isActive', 'createdAt', 'updatedAt']
    });
  }

  async findAll(): Promise<Publicacion[]> {
    console.log('Backend: Buscando todas las publicaciones activas...');
    
    // Log para depuración: contar inactivas
    const inactiveCount = await this.publicacionesRepository.count({ where: { isActive: false } });
    if (inactiveCount > 0) {
      console.log(`Backend: Hay ${inactiveCount} publicaciones inactivas que no se mostrarán.`);
    }

    const pubs = await this.publicacionesRepository.createQueryBuilder('publicacion')
      .leftJoinAndSelect('publicacion.autor', 'autor')
      .where('publicacion.isActive = :isActive', { isActive: true })
      .orderBy('publicacion.createdAt', 'DESC')
      .getMany();
    
    console.log(`Backend: Se encontraron ${pubs.length} publicaciones activas en total.`);
    return pubs;
  }

  async findByAutor(autorId: number): Promise<Publicacion[]> {
    console.log(`Backend: Buscando publicaciones para el autor ${autorId}...`);
    return this.publicacionesRepository.createQueryBuilder('publicacion')
      .leftJoinAndSelect('publicacion.autor', 'autor')
      .where('publicacion.autorId = :autorId', { autorId })
      .andWhere('publicacion.isActive = :isActive', { isActive: true })
      .orderBy('publicacion.createdAt', 'DESC')
      .getMany();
  }

  async findByVeterinaria(veterinariaId: number): Promise<Publicacion[]> {
    console.log(`Backend: Buscando publicaciones de la veterinaria ${veterinariaId}...`);
    return this.publicacionesRepository.createQueryBuilder('publicacion')
      .leftJoinAndSelect('publicacion.autor', 'autor')
      .innerJoin('perfiles_veterinarios', 'pv', 'pv."usuarioId" = autor.id')
      .innerJoin('veterinarias', 'v', 'v.id = pv."veterinariaPrincipalId"')
      .where('v.id = :veterinariaId', { veterinariaId })
      .andWhere('publicacion.isActive = :isActive', { isActive: true })
      .orderBy('publicacion.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: number): Promise<Publicacion> {
    const publicacion = await this.publicacionesRepository.findOne({ 
      where: { id, isActive: true }
    });
    
    if (!publicacion) {
      throw new NotFoundException(`Publicación con ID ${id} no encontrada`);
    }
    
    return publicacion;
  }

  async update(id: number, updatePublicacionDto: UpdatePublicacionDto): Promise<Publicacion> {
    const publicacion = await this.findOne(id);
    
    await this.publicacionesRepository.update(id, updatePublicacionDto);
    
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const publicacion = await this.findOne(id);
    
    await this.publicacionesRepository.update(id, { isActive: false });
  }

  async reportar(id: number, userId: number): Promise<Publicacion> {
    const publicacion = await this.findOne(id);
    if (!publicacion.reportadoresIds) {
      publicacion.reportadoresIds = [];
    }
    if (!publicacion.reportadoresIds.includes(userId)) {
      publicacion.reportadoresIds.push(userId);
      await this.publicacionesRepository.save(publicacion);
    }
    return publicacion;
  }

  async findReportadasByVeterinaria(veterinariaId: number): Promise<Publicacion[]> {
    console.log(`Backend: Buscando publicaciones reportadas de la veterinaria ${veterinariaId}...`);
    return this.publicacionesRepository.createQueryBuilder('publicacion')
      .leftJoinAndSelect('publicacion.autor', 'autor')
      // Join for Direct Veterinarian
      .leftJoin('perfiles_veterinarios', 'pv_direct', 'pv_direct."usuarioId" = autor.id')
      // Join for Direct Admin
      .leftJoin('veterinarias', 'v_direct', 'v_direct."adminId" = autor.id')
      // Join for Creator (either Veterinarian or Admin who created the author)
      .leftJoin('users', 'creator', 'creator.id = autor.createdById')
      // Join for Creator who is a Veterinarian
      .leftJoin('perfiles_veterinarios', 'pv_creator', 'pv_creator."usuarioId" = creator.id')
      // Join for Creator who is an Admin
      .leftJoin('veterinarias', 'v_creator', 'v_creator."adminId" = creator.id')
      .where('publicacion.isActive = :isActive', { isActive: true })
      .andWhere(
        `(` +
        `pv_direct."veterinariaPrincipalId" = :veterinariaId OR ` +
        `v_direct.id = :veterinariaId OR ` +
        `pv_creator."veterinariaPrincipalId" = :veterinariaId OR ` +
        `v_creator.id = :veterinariaId` +
        `)`, 
        { veterinariaId }
      )
      .orderBy('publicacion.createdAt', 'DESC')
      .getMany()
      .then(pubs => pubs.filter(p => p.reportadoresIds && p.reportadoresIds.length > 0));
  }
}

