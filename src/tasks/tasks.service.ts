import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './entities/task.entity';
import { ProjectsService } from '../projects/projects.service';
import { User } from '../auth/entities/user.entity';
import { Tag } from '../tags/entities/tag.entity';

@Injectable()
export class TasksService {
  private readonly logger = new Logger('TasksService');

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly projectsService: ProjectsService,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User) {
    const { projectId, tagIds = [], ...taskData } = createTaskDto;
    const project = await this.projectsService.findOne(projectId);
    const tags = tagIds.length > 0 ? await this.tagRepository.findBy({ id: In(tagIds) }) : [];

    try {
      const task = this.taskRepository.create({
        ...taskData,
        project,
        user,
        tags,
      });
      const savedTask = await this.taskRepository.save(task);
      return this.findOne(savedTask.id);
    } catch (error: any) {
      this.handleDbExceptions(error);
    }
  }

  async findAll(filterDto: GetTasksFilterDto) {
    const { limit = 10, offset = 0, projectId } = filterDto;

    const queryOptions: any = {
      take: limit,
      skip: offset,
      relations: {
        project: true,
        user: true,
        tags: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        priority: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        project: {
          id: true,
          name: true,
        },
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
    };

    if (projectId) {
      queryOptions.where = {
        project: { id: projectId },
      };
    }

    return await this.taskRepository.find(queryOptions);
  }

  async findOne(id: string) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: {
        project: true,
        user: true,
        tags: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        priority: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        project: {
          id: true,
          name: true,
        },
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

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(id);
    const { projectId, tagIds, ...toUpdate } = updateTaskDto;

    if (projectId) {
      const project = await this.projectsService.findOne(projectId);
      task.project = project;
    }

    if (tagIds) {
      task.tags = await this.tagRepository.findBy({ id: In(tagIds) });
    }

    try {
      this.taskRepository.merge(task, toUpdate);
      const savedTask = await this.taskRepository.save(task);
      return this.findOne(savedTask.id);
    } catch (error: any) {
      this.handleDbExceptions(error);
    }
  }

  async remove(id: string) {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
    return { deleted: true };
  }

  private handleDbExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(`Database error: ${error.message}`, error.stack);

    throw new InternalServerErrorException(
      'Unexpected server error. Please check logs.',
    );
  }
}
