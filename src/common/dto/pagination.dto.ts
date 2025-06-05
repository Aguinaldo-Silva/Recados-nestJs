import { IsInt, IsNumber, IsOptional, IsPositive, Max, Min } from "class-validator";
import { Type } from "class-transformer";

export class PaginationDto {
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  limit: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset: number;
}