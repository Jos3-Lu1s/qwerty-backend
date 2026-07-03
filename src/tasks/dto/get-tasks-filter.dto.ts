import { IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '../../common/dtos/pagination.dto';

export class GetTasksFilterDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;
}
