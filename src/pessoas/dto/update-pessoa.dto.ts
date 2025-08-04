import { PartialType } from '@nestjs/mapped-types';
import { CreatePessoaDto } from './create-pessoa.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePessoaDto extends PartialType(CreatePessoaDto) {
    @ApiPropertyOptional({
        description: 'Nome da pessoa',
        example: 'João Silva',
        minLength: 3,
        maxLength: 50,
    })
    nome?: string;

    @ApiPropertyOptional({
        description: 'Email da pessoa',
        example: 'joao@email.com',
    })
    email?: string;

    @ApiPropertyOptional({
        description: 'Senha da pessoa',
        example: 'senha123',
        minLength: 5,
    })
    password?: string;
}
