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
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger('ProjectsService');

  constructor(
    @InjectRepository(Project)
    private readonly ProjectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    try {
      const project = this.ProjectRepository.create(createProjectDto);
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
    });
  }

  async findOne(id: string) {
    const project = await this.ProjectRepository.findOneBy({ id });

    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    return project;
  }

  update(id: string, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
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
