import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'text',
    unique: true,
  })
  email!: string;

  @Column({
    type: 'text',
    select: false,
  })
  password!: string;

  @Column({
    type: 'text',
  })
  fullName!: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive!: boolean;

  @Column({
    type: 'text',
    array: true,
    default: ['user'],
  })
  roles!: string[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Project, (project) => project.user)
  projects!: Project[];

  @OneToMany(() => Task, (task) => task.user)
  tasks!: Task[];

  @BeforeInsert()
  @BeforeUpdate()
  checkFields() {
    this.email = this.email.trim().toLowerCase();
    this.fullName = this.fullName.trim();
  }
}
