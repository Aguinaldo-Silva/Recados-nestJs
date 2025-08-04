import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateReceiveDto {


  @ApiProperty({
    description: 'Valor recebido',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Data de recebimento',
    example: '2021-01-01',
  })
  @IsDateString()
  createdAt: string;

  @ApiProperty({
    description: 'Categoria do recebimento',
    example: 'Salário',
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Descrição do recebimento',
    example: 'Recebimento de salário',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}