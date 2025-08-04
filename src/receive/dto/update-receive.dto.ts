import { PartialType } from "@nestjs/mapped-types";
import { CreateReceiveDto } from "./create-receive.dto";
import { IsString, IsOptional, IsNumber, IsDateString } from "class-validator";
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateReceiveDto extends PartialType(CreateReceiveDto) {
    @ApiPropertyOptional({
        description: 'Valor recebido',
        example: 150.50,
    })
    @IsOptional()
    @IsNumber()
    amount?: number;

    @ApiPropertyOptional({
        description: 'Data de recebimento',
        example: '2024-01-15',
    })
    @IsOptional()
    @IsDateString()
    createdAt?: string;

    @ApiPropertyOptional({
        description: 'Categoria do recebimento',
        example: 'Freelance',
    })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiPropertyOptional({
        description: 'Descrição do recebimento',
        example: 'Pagamento por projeto de desenvolvimento',
    })
    @IsOptional()
    @IsString()
    description?: string;
}