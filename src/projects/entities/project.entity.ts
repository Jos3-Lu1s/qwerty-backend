import { Status, Priority } from 'src/interfaces';
import { Task } from '../../tasks/entities/task.entity';
import { User } from '../../auth/entities/user.entity';
import { Tag } from '../../tags/entities/tag.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

  @Entity()
  export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status!: Status;

  @Column({
    type: 'enum',
    enum: Priority,
    default: Priority.NONE
  })
  priority!: Priority;

  @Column({ default: false })
  isFavorite!: boolean;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  startDate!: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  // Tiempo total asignado/estimado para el proyecto, almacenado en minutos.
  @Column({ type: 'int', default: 0 })
  assignedTime!: number;

  // Tiempo efectivamente utilizado en el proyecto, almacenado en minutos.
  @Column({ type: 'int', default: 0 })
  usedTime!: number;

  // Indica si el proyecto está activo o archivado.
  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  //Imagen de portada
  @Column({ type: 'text', nullable: true })
  image?: string;

  // Si tiene valor (fecha), el registro está marcado como eliminado pero persiste en la DB.
  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Task, (task) => task.project, { cascade: true })
  tasks?: Task[];

  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'RESTRICT', nullable: false })
  user!: User;

  @ManyToMany(() => Tag, (tag) => tag.projects)
  @JoinTable({ name: 'project_tags' })
  tags?: Tag[];

  @BeforeInsert()
  @BeforeUpdate()
  checkFields() {
    this.name = this.name.trim();
    if (this.description) {
      this.description = this.description.trim();
    }
  }
  }
