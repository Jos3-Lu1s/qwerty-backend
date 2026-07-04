import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProjectsModule } from '../projects/projects.module';
import { TasksModule } from '../tasks/tasks.module';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';
import { Tag } from '../tags/entities/tag.entity';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    ProjectsModule,
    TasksModule,
    AuthModule,
    TypeOrmModule.forFeature([User, Task, Tag]),
  ],
})
export class SeedModule {}
