import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
import { User } from '../auth/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';
import { ProjectsService } from '../projects/projects.service';
import { TasksService } from '../tasks/tasks.service';
import { Status, Priority } from '../interfaces';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly projectsService: ProjectsService,
    private readonly tasksService: TasksService,
  ) {}

  async runSeed() {
    await this.deleteTables();
    await this.insertProjects();
    return 'Seed executed successfully';
  }

  private async deleteTables() {
    const taskQueryBuilder = this.taskRepository.createQueryBuilder();
    await taskQueryBuilder.delete().where({}).execute();

    const queryBuilder = this.projectRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();

    const userQueryBuilder = this.userRepository.createQueryBuilder();
    await userQueryBuilder.delete().where({}).execute();
  }

  private async insertProjects() {
    const demoProjects = [
      {
        name: 'Diseño y Construcción de Oficinas Corporativas',
        description: 'Planificación y ejecución de la remodelación de las nuevas oficinas centrales, incluyendo el diseño arquitectónico y la distribución de espacios.',
        image: 'proyecto1.jpg',
        color: '#3b82f6',
        priority: Priority.HIGH,
        tasks: [
          {
            name: 'Elaboración de planos y distribución de planta',
            description: 'Diseño detallado de la distribución de oficinas, salas de juntas y áreas comunes.',
            status: Status.COMPLETED,
            priority: Priority.HIGH,
          },
          {
            name: 'Aprobación de permisos y licencias de obra',
            description: 'Trámite y obtención de los permisos gubernamentales necesarios para iniciar la remodelación.',
            status: Status.IN_PROGRESS,
            priority: Priority.HIGH,
          },
          {
            name: 'Instalación de sistemas eléctricos y climatización',
            description: 'Cableado de red, tomas eléctricas y colocación de los equipos de aire acondicionado según planos.',
            status: Status.PENDING,
            priority: Priority.MEDIUM,
          },
        ],
      },
      {
        name: 'Taller de Innovación y UX Design Sprint',
        description: 'Sesiones de ideación y prototipado rápido para definir la experiencia de usuario del nuevo producto digital.',
        image: 'proyecto2.jpg',
        color: '#ef4444',
        priority: Priority.MEDIUM,
        tasks: [
          {
            name: 'Lluvia de ideas y mapeo de empatía',
            description: 'Definición del perfil del usuario ideal (buyer persona) y sus puntos de dolor mediante notas adhesivas.',
            status: Status.COMPLETED,
            priority: Priority.MEDIUM,
          },
          {
            name: 'Creación del User Journey Map',
            description: 'Dibujar el viaje completo del usuario interactuando con la aplicación para detectar oportunidades.',
            status: Status.IN_PROGRESS,
            priority: Priority.HIGH,
          },
          {
            name: 'Prototipado en baja fidelidad (wireframes)',
            description: 'Diseño preliminar en papel y pizarras del flujo de pantallas principales.',
            status: Status.PENDING,
            priority: Priority.MEDIUM,
          },
        ],
      },
      {
        name: 'Campaña de Lanzamiento del Producto',
        description: 'Planificación y ejecución de la estrategia de marketing y publicidad para el lanzamiento de la nueva versión.',
        image: 'proyecto3.jpg',
        color: '#10b981',
        priority: Priority.LOW,
        tasks: [
          {
            name: 'Definición de objetivos de la campaña',
            description: 'Establecer los KPIs de conversión y alcance de marketing en el tablero de planificación.',
            status: Status.COMPLETED,
            priority: Priority.HIGH,
          },
          {
            name: 'Creación de contenido publicitario',
            description: 'Redacción de copys, diseño de banners y producción de videos promocionales.',
            status: Status.IN_PROGRESS,
            priority: Priority.MEDIUM,
          },
          {
            name: 'Configuración de anuncios pagados',
            description: 'Segmentación de audiencias y lanzamiento de campañas en redes sociales y buscadores.',
            status: Status.PENDING,
            priority: Priority.LOW,
          },
        ],
      },
      {
        name: 'Optimización y Refactorización del Backend',
        description: 'Mejora del rendimiento de los servicios backend mediante la refactorización de consultas y arquitectura de microservicios.',
        image: 'proyecto4.jpg',
        color: '#8b5cf6',
        priority: Priority.MEDIUM,
        tasks: [
          {
            name: 'Análisis y perfilado de consultas SQL',
            description: 'Identificación de consultas lentas en la base de datos y diseño de índices.',
            status: Status.COMPLETED,
            priority: Priority.HIGH,
          },
          {
            name: 'Migración de servicios monolíticos a microservicios',
            description: 'Desacoplar la lógica de autenticación y notificaciones en servicios independientes.',
            status: Status.IN_PROGRESS,
            priority: Priority.HIGH,
          },
          {
            name: 'Implementación de pruebas unitarias y cobertura',
            description: 'Aumentar la cobertura de código al 80% utilizando Jest en los servicios principales.',
            status: Status.PENDING,
            priority: Priority.MEDIUM,
          },
        ],
      },
      {
        name: 'Desarrollo del Core API con NestJS',
        description: 'Construcción de la API robusta y escalable utilizando NestJS, TypeORM y Postgres.',
        image: 'proyecto5.jpg',
        color: '#f59e0b',
        priority: Priority.HIGH,
        tasks: [
          {
            name: 'Diseño del esquema de base de datos con TypeORM',
            description: 'Definición de entidades, relaciones y migraciones iniciales de base de datos.',
            status: Status.COMPLETED,
            priority: Priority.HIGH,
          },
          {
            name: 'Integración del módulo de autenticación JWT',
            description: 'Implementación de registro, login y guardias de seguridad para proteger rutas públicas.',
            status: Status.IN_PROGRESS,
            priority: Priority.HIGH,
          },
          {
            name: 'Documentación interactiva con Swagger',
            description: 'Generar y decorar endpoints para la documentación de API accesible para frontend.',
            status: Status.PENDING,
            priority: Priority.LOW,
          },
        ],
      },
      {
        name: 'Desarrollo del Frontend Web App',
        description: 'Implementación de la interfaz de usuario moderna utilizando React, TypeScript y Tailwind CSS.',
        image: 'proyecto6.jpg',
        color: '#6b7280',
        priority: Priority.LOW,
        tasks: [
          {
            name: 'Maquetación de la interfaz responsive',
            description: 'Construcción de los componentes UI principales siguiendo los mockups de diseño.',
            status: Status.COMPLETED,
            priority: Priority.MEDIUM,
          },
          {
            name: 'Integración de estado global e inicio de sesión',
            description: 'Conectar la app con el backend y almacenar el token de sesión usando Zustand.',
            status: Status.IN_PROGRESS,
            priority: Priority.HIGH,
          },
          {
            name: 'Optimización de carga y Lighthouse',
            description: 'Optimizar el tamaño del bundle, lazy loading de rutas e imágenes para mejorar rendimiento.',
            status: Status.PENDING,
            priority: Priority.MEDIUM,
          },
        ],
      },
    ];

    const adminUser = this.userRepository.create({
      email: 'admin@qwerty.com',
      password: bcrypt.hashSync('admin123', 10),
      fullName: 'Admin User',
      roles: ['admin'],
    });
    await this.userRepository.save(adminUser);

    for (const projectDto of demoProjects) {
      const { tasks, ...projectData } = projectDto;
      const createdProject = await this.projectsService.create(projectData as any, adminUser);
      if (!createdProject) continue;

      for (const task of tasks) {
        await this.tasksService.create({
          ...task,
          projectId: createdProject.id,
        }, adminUser);
      }
    }
  }
}
