import { IsInt, IsOptional } from 'class-validator';

export class FindAllWalletsDto {
  @IsOptional()
  @IsInt({ each: true })
  projectIds?: number[];
}
