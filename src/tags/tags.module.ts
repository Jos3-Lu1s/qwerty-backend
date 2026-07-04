import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { Tag } from './entities/tag.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [TagsController],
  providers: [TagsService],
  imports: [
    TypeOrmModule.forFeature([Tag]),
    AuthModule,
  ],
  exports: [TagsService, TypeOrmModule],
})
export class TagsModule {}
