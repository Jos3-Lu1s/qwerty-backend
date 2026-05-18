import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../../interfaces/status';
import { Priority } from '../../interfaces/priority';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  color!: string;

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

  @Column({ type: 'date' })
  startDate!: Date;

  @Column({ type: 'date' })
  endDate!: Date;

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

  // Si tiene valor (fecha), el registro está marcado como eliminado pero persiste en la DB.
  @DeleteDateColumn()
  deletedAt?: Date;
}
