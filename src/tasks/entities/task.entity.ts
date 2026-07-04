import { Status, Priority } from 'src/interfaces';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status!: Status;

  @Column({
    type: 'enum',
    enum: Priority,
    default: Priority.NONE,
  })
  priority!: Priority;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'RESTRICT' })
  project!: Project;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'RESTRICT', nullable: false })
  user!: User;

  @BeforeInsert()
  @BeforeUpdate()
  checkFields() {
    this.name = this.name.trim();
    if (this.description) {
      this.description = this.description.trim();
    }
  }
}
