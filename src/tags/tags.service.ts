import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    try {
      const tag = this.tagRepository.create(createTagDto);
      return await this.tagRepository.save(tag);
    } catch (error: any) {
      this.handleDbExceptions(error);
    }
  }

  async findAll() {
    return await this.tagRepository.find();
  }

  async findOne(id: string) {
    const tag = await this.tagRepository.findOne({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }

    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const tag = await this.findOne(id);
    try {
      this.tagRepository.merge(tag, updateTagDto);
      return await this.tagRepository.save(tag);
    } catch (error: any) {
      this.handleDbExceptions(error);
    }
  }

  async remove(id: string) {
    const tag = await this.findOne(id);
    await this.tagRepository.remove(tag);
    return { deleted: true };
  }

  private handleDbExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
