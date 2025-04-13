import { IsString,IsNotEmpty, IsOptional, MaxLength, MinLength, IsDate, IsBoolean, IsPositive } from "class-validator";


export class CreateRecadoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  @IsOptional()
  readonly texto: string;


  @IsDate()
  @IsOptional()
  readonly createdAt: Date;

  @IsDate()
  @IsOptional()
  readonly updatedAt: Date;

  @IsPositive()
  @IsNotEmpty()
  readonly deId: number;

  @IsPositive()
  @IsNotEmpty()
  readonly paraId: number;
}
