import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ProjectsModule],
})
export class SeedModule {}
