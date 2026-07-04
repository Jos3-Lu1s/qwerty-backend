import { Status, Priority } from 'src/interfaces';
import { Project } from '../../projects/entities/project.entity';
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
  ManyToOne,
  ManyToMany,
  JoinTable,
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

  @ManyToMany(() => Tag, (tag) => tag.tasks, { cascade: true })
  @JoinTable({ name: 'task_tags' })
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
