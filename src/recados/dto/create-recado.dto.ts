import { IsString, IsNotEmpty, IsOptional, MaxLength, MinLength, IsDate, IsPositive } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRecadoDto {
  @ApiProperty({
    description: 'Texto do recado',
    example: 'Olá! Como você está?',
    minLength: 5,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  @IsOptional()
  readonly texto: string;

  @ApiPropertyOptional({
    description: 'Data de criação do recado',
    example: '2024-01-15T10:30:00.000Z',
  })
  @IsDate()
  @IsOptional()
  readonly createdAt: Date;

  @ApiPropertyOptional({
    description: 'Data de atualização do recado',
    example: '2024-01-15T10:30:00.000Z',
  })
  @IsDate()
  @IsOptional()
  readonly updatedAt: Date;

  @ApiProperty({
    description: 'ID da pessoa que receberá o recado',
    example: 1,
    minimum: 1,
  })
  @IsPositive()
  @IsNotEmpty()
  readonly paraId: number;
}
