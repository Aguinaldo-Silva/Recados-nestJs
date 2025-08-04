import { ApiProperty } from '@nestjs/swagger';

export class ResponsePessoaDto {
    @ApiProperty({
        description: 'ID único da pessoa',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'Nome da pessoa',
        example: 'João Silva',
    })
    nome: string;

    @ApiProperty({
        description: 'Email da pessoa',
        example: 'joao@email.com',
    })
    email: string;

    @ApiProperty({
        description: 'Data de criação',
        example: '2024-01-15T10:30:00.000Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Data de atualização',
        example: '2024-01-15T10:30:00.000Z',
    })
    updatedAt: Date;
} 