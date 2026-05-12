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
}
