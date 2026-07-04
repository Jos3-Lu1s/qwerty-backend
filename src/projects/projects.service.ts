import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Project } from './entities/project.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { User } from '../auth/entities/user.entity';
import { Tag } from '../tags/entities/tag.entity';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger('ProjectsService');

  constructor(
    @InjectRepository(Project)
    private readonly ProjectRepository: Repository<Project>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(createProjectDto: CreateProjectDto, user: User) {
    const { tagIds = [], ...projectData } = createProjectDto;
    const tags = tagIds.length > 0 ? await this.tagRepository.findBy({ id: In(tagIds) }) : [];
    try {
      const project = this.ProjectRepository.create({
        ...projectData,
        user,
        tags,
      });
      return await this.ProjectRepository.save(project);
    } catch (error: any) {
      this.handleDbExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 5, offset = 0 } = paginationDto;

    return this.ProjectRepository.find({
      take: limit,
      skip: offset,
      relations: {
        tags: true,
        user: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        status: true,
        priority: true,
        isFavorite: true,
        startDate: true,
        endDate: true,
        assignedTime: true,
        isActive: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          fullName: true,
          email: true,
        },
        tags: {
          id: true,
          name: true,
          color: true,
        },
      },
    });
  }

  async findOne(id: string) {
    const project = await this.ProjectRepository.findOne({
      where: { id },
      relations: {
        tags: true,
        user: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        status: true,
        priority: true,
        isFavorite: true,
        startDate: true,
        endDate: true,
        assignedTime: true,
        isActive: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          fullName: true,
          email: true,
        },
        tags: {
          id: true,
          name: true,
          color: true,
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const { tagIds, ...toUpdate } = updateProjectDto;
    const project = await this.findOne(id);

    this.ProjectRepository.merge(project, toUpdate);

    if (tagIds) {
      project.tags = await this.tagRepository.findBy({ id: In(tagIds) });
    }

    try {
      return await this.ProjectRepository.save(project);
    } catch (error: any) {
      this.handleDbExceptions(error);
    }
  }

  async remove(id: string) {
    const project = await this.findOne(id);
    await this.ProjectRepository.remove(project);
    return { deleted: true };
  }

  private handleDbExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(`Error en base de datos: ${error.message}`, error.stack);

    throw new InternalServerErrorException(
      'Error inesperado en el servidor. Revise los logs.',
    );
  }
}
