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
  ) { }

  private async resolvePublicacionesComentarios(pubs: Publicacion[]): Promise<any[]> {
    const userIds = new Set<number>();
    const parsedPubs = pubs.map(pub => {
      let comentarios = [];
      if (pub.comentariosRaw) {
        try {
          comentarios = JSON.parse(pub.comentariosRaw);
          if (!Array.isArray(comentarios)) comentarios = [];
        } catch (e) {
          comentarios = [];
        }
      }
      comentarios.forEach((c: any) => {
        if (c.autorId) userIds.add(c.autorId);
      });
      // Convert entity to plain object to allow adding resolved fields safely
      const plainPub = Object.assign({}, pub);
      return { ...plainPub, comentarios };
    });

    if (userIds.size === 0) {
      return parsedPubs.map(pub => {
        const { comentariosRaw, ...rest } = pub;
        return {
          ...rest,
          comentarios: []
        };
      });
    }

    const users = await this.usersService.findAll();
    const userMap = new Map<number, any>();
    users.forEach(u => userMap.set(u.id, u));

    return parsedPubs.map(pub => {
      const resolvedComentarios = pub.comentarios.map((c: any) => {
        const user = userMap.get(c.autorId);
        let avatarUrl = 'assets/images/Default.png';
        if (user?.avatar) {
          avatarUrl = user.avatar.startsWith('http') ? user.avatar : `http://localhost:3000${user.avatar}`;
        }
        return {
          id: c.id,
          autorId: c.autorId,
          contenido: c.contenido,
          createdAt: c.createdAt,
          nombre: user ? (user.fullName || `${user.firstName} ${user.lastName}`) : 'Usuario',
          avatar: avatarUrl
        };
      });

      const { comentariosRaw, ...rest } = pub;
      return {
        ...rest,
        comentarios: resolvedComentarios
      };
    });
  }

  async create(createPublicacionDto: CreatePublicacionDto): Promise<any> {
    if (!createPublicacionDto.autorId) {
      throw new ConflictException('Se requiere un ID de autor para crear la publicación');
    }

    // Validar que el autor existe
    await this.usersService.findOne(createPublicacionDto.autorId);

    const publicacion = this.publicacionesRepository.create(createPublicacionDto);
    const savedPublicacion = await this.publicacionesRepository.save(publicacion);

    const result = Array.isArray(savedPublicacion) ? savedPublicacion[0] : savedPublicacion;
    const dbPub = await this.publicacionesRepository.findOne({
      where: { id: result.id },
      relations: ['autor']
    });

    const resolved = await this.resolvePublicacionesComentarios([dbPub]);
    return resolved[0];
  }

  async findAll(): Promise<any[]> {
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
    return await this.resolvePublicacionesComentarios(pubs);
  }

  async findByAutor(autorId: number): Promise<any[]> {
    console.log(`Backend: Buscando publicaciones para el autor ${autorId}...`);
    const pubs = await this.publicacionesRepository.createQueryBuilder('publicacion')
      .leftJoinAndSelect('publicacion.autor', 'autor')
      .where('publicacion.autorId = :autorId', { autorId })
      .andWhere('publicacion.isActive = :isActive', { isActive: true })
      .orderBy('publicacion.createdAt', 'DESC')
      .getMany();
    return await this.resolvePublicacionesComentarios(pubs);
  }

  async findByVeterinaria(veterinariaId: number): Promise<any[]> {
    console.log(`Backend: Buscando publicaciones de la veterinaria ${veterinariaId}...`);
    const pubs = await this.publicacionesRepository.createQueryBuilder('publicacion')
      .leftJoinAndSelect('publicacion.autor', 'autor')
      .innerJoin('perfiles_veterinarios', 'pv', 'pv."usuarioId" = autor.id')
      .innerJoin('veterinarias', 'v', 'v.id = pv."veterinariaPrincipalId"')
      .where('v.id = :veterinariaId', { veterinariaId })
      .andWhere('publicacion.isActive = :isActive', { isActive: true })
      .orderBy('publicacion.createdAt', 'DESC')
      .getMany();
    return await this.resolvePublicacionesComentarios(pubs);
  }

  async findOne(id: number): Promise<any> {
    const publicacion = await this.publicacionesRepository.findOne({
      where: { id, isActive: true },
      relations: ['autor']
    });

    if (!publicacion) {
      throw new NotFoundException(`Publicación con ID ${id} no encontrada`);
    }

    const resolved = await this.resolvePublicacionesComentarios([publicacion]);
    return resolved[0];
  }

  async update(id: number, updatePublicacionDto: UpdatePublicacionDto): Promise<any> {
    await this.findOne(id);
    await this.publicacionesRepository.update(id, updatePublicacionDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.publicacionesRepository.update(id, { isActive: false });
  }

  async reportar(id: number, userId: number): Promise<any> {
    const dbPub = await this.publicacionesRepository.findOne({ where: { id, isActive: true } });
    if (!dbPub) {
      throw new NotFoundException(`Publicación con ID ${id} no encontrada`);
    }
    if (!dbPub.reportadoresIds) {
      dbPub.reportadoresIds = [];
    }
    if (!dbPub.reportadoresIds.includes(userId)) {
      dbPub.reportadoresIds.push(userId);
      await this.publicacionesRepository.save(dbPub);
    }
    return this.findOne(id);
  }

  async findReportadasByVeterinaria(veterinariaId: number): Promise<any[]> {
    console.log(`Backend: Buscando publicaciones reportadas de la veterinaria ${veterinariaId}...`);
    const pubs = await this.publicacionesRepository.createQueryBuilder('publicacion')
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
      .getMany();

    const filtered = pubs.filter(p => p.reportadoresIds && p.reportadoresIds.length > 0);
    return await this.resolvePublicacionesComentarios(filtered);
  }

  async toggleLike(id: number, userId: number): Promise<any> {
    const publicacion = await this.publicacionesRepository.findOne({ where: { id, isActive: true } });
    if (!publicacion) {
      throw new NotFoundException(`Publicación con ID ${id} no encontrada`);
    }
    if (!publicacion.likesUserIds) {
      publicacion.likesUserIds = [];
    }

    const index = publicacion.likesUserIds.indexOf(userId);
    if (index > -1) {
      // Remover like (Dislike)
      publicacion.likesUserIds.splice(index, 1);
    } else {
      // Agregar like
      publicacion.likesUserIds.push(userId);
    }

    await this.publicacionesRepository.save(publicacion);

    return {
      likesCount: publicacion.likesUserIds.length,
      likedByUser: !(index > -1),
      likesUserIds: publicacion.likesUserIds
    };
  }

  async agregarComentario(id: number, userId: number, contenido: string): Promise<any> {
    const user = await this.usersService.findOne(userId);
    const dbPub = await this.publicacionesRepository.findOne({ where: { id, isActive: true } });
    if (!dbPub) {
      throw new NotFoundException(`Publicación con ID ${id} no encontrada`);
    }
    let comentarios = [];

    if (dbPub.comentariosRaw) {
      try {
        comentarios = JSON.parse(dbPub.comentariosRaw);
        if (!Array.isArray(comentarios)) {
          comentarios = [];
        }
      } catch (e) {
        comentarios = [];
      }
    }

    const nuevoComentarioDb = {
      id: Date.now(),
      autorId: userId,
      contenido: contenido,
      createdAt: new Date().toISOString()
    };

    comentarios.push(nuevoComentarioDb);

    const comentariosLimpios = comentarios.map((c: any) => ({
      id: c.id,
      autorId: c.autorId || c.usuarioId || userId,
      contenido: c.contenido,
      createdAt: c.createdAt || c.fecha || new Date().toISOString()
    }));

    dbPub.comentariosRaw = JSON.stringify(comentariosLimpios);

    await this.publicacionesRepository.save(dbPub);

    let avatarUrl = 'assets/images/Default.png';
    if (user.avatar) {
      avatarUrl = user.avatar.startsWith('http') ? user.avatar : `http://localhost:3000${user.avatar}`;
    }

    return {
      ...nuevoComentarioDb,
      nombre: user.fullName || `${user.firstName} ${user.lastName}`,
      avatar: avatarUrl
    };
  }
}
