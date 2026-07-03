import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
import { ProjectsService } from '../projects/projects.service';
import { TasksService } from '../tasks/tasks.service';
import { Status, Priority } from '../interfaces';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly projectsService: ProjectsService,
    private readonly tasksService: TasksService,
  ) {}

  async runSeed() {
    await this.deleteTables();
    await this.insertProjects();
    return 'Seed executed successfully';
  }

  private async deleteTables() {
    const queryBuilder = this.projectRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertProjects() {
    const demoProjects = [
      {
        name: 'Plataforma E-commerce',
        description: 'Desarrollo de una tienda en línea con pagos integrados y panel de administración.',
        image: 'proyecto1.jpg',
        color: '#3b82f6',
        priority: 3, // High
      },
      {
        name: 'App de Delivery',
        description: 'Aplicación móvil para la gestión de pedidos y repartidores en tiempo real.',
        image: 'proyecto2.jpg',
        color: '#ef4444',
        priority: 2, // Medium
      },
      {
        name: 'Dashboard Analytics',
        description: 'Sistema de visualización de datos complejos mediante gráficos interactivos.',
        image: 'proyecto3.jpg',
        color: '#10b981',
        priority: 1, // Low
      },
      {
        name: 'Red Social Corporativa',
        description: 'Herramienta interna para la comunicación y colaboración entre empleados.',
        image: 'proyecto4.jpg',
        color: '#8b5cf6',
        priority: 2,
      },
      {
        name: 'Gestor de Tareas',
        description: 'Plataforma minimalista para la organización de proyectos y flujo de trabajo.',
        image: 'proyecto5.jpg',
        color: '#f59e0b',
        priority: 3,
      },
      {
        name: 'Portal de Soporte',
        description: 'Centro de ayuda con sistema de tickets y base de conocimientos.',
        image: 'proyecto6.jpg',
        color: '#6b7280',
        priority: 1,
      },
    ];

    const projectsPromises = demoProjects.map((projectDto) => {
      return this.projectsService.create(projectDto as any);
    });

    const createdProjects = await Promise.all(projectsPromises);

    for (const project of createdProjects) {
      if (!project) continue;

      await this.tasksService.create({
        name: `Planificación de requerimientos - ${project.name}`,
        description: `Reunión de alineación y definición del alcance para ${project.name}.`,
        status: Status.COMPLETED,
        priority: Priority.HIGH,
        projectId: project.id,
      });

      await this.tasksService.create({
        name: `Diseño de arquitectura y base de datos - ${project.name}`,
        description: `Creación del modelo entidad-relación y definición de la estructura del sistema.`,
        status: Status.IN_PROGRESS,
        priority: Priority.MEDIUM,
        projectId: project.id,
      });

      await this.tasksService.create({
        name: `Desarrollo de funcionalidades principales - ${project.name}`,
        description: `Implementación de la primera fase de desarrollo de ${project.name}.`,
        status: Status.PENDING,
        priority: Priority.LOW,
        projectId: project.id,
      });
    }
  }
}
