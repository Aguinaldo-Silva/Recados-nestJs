import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePessoaDto {
    @ApiProperty({
        description: 'Nome da pessoa',
        example: 'João Silva',
        minLength: 3,
        maxLength: 50,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(50)
    nome: string;

    @ApiProperty({
        description: 'Email da pessoa',
        example: 'joao@email.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Senha da pessoa',
        example: 'senha123',
        minLength: 5,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    password: string;

    @ApiPropertyOptional({
        description: 'Data de criação',
        example: '2024-01-15T10:30:00.000Z',
    })
    @IsDate()
    @IsOptional()
    createdAt?: Date;

    @ApiPropertyOptional({
        description: 'Data de atualização',
        example: '2024-01-15T10:30:00.000Z',
    })
    @IsDate()
    @IsOptional()
    updatedAt?: Date;
}
