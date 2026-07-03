import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './entities/task.entity';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger('TasksService');

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly projectsService: ProjectsService,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const { projectId, ...taskData } = createTaskDto;
    const project = await this.projectsService.findOne(projectId);

    try {
      const task = this.taskRepository.create({
        ...taskData,
        project,
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
      relations: { project: true },
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
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(id);
    const { projectId, ...toUpdate } = updateTaskDto;

    if (projectId) {
      const project = await this.projectsService.findOne(projectId);
      task.project = project;
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
