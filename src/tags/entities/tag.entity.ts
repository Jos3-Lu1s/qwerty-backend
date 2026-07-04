import { Project } from '../../projects/entities/project.entity';
import { Task } from '../../tasks/entities/task.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity({ name: 'tags' })
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  color!: string;

  @ManyToMany(() => Project, (project) => project.tags)
  projects?: Project[];

  @ManyToMany(() => Task, (task) => task.tags)
  tasks?: Task[];

  @BeforeInsert()
  @BeforeUpdate()
  checkFields() {
    this.name = this.name.trim();
    this.color = this.color.trim();
  }
}
