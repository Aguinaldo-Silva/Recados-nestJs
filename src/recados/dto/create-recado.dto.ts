import { IsString,IsNotEmpty, IsOptional, MaxLength, MinLength, IsDate } from "class-validator";


export class CreateRecadoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  @IsOptional()
  readonly texto: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  @IsOptional()
  readonly de: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  @IsOptional()
  readonly para: string;

  @IsDate()
  @IsOptional()
  readonly createdAt: Date;

  @IsDate()
  @IsOptional()
  readonly updatedAt: Date;
}
