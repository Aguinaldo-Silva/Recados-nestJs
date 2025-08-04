import { ApiProperty } from '@nestjs/swagger';

export class ResponseRecadoDto {
    @ApiProperty({
        description: 'ID único do recado',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'Texto do recado',
        example: 'Olá! Como você está?',
    })
    texto: string;

    @ApiProperty({
        description: 'Indica se o recado foi lido',
        example: false,
    })
    lido: boolean;

    @ApiProperty({
        description: 'Data do recado',
        example: '2024-01-15T10:30:00.000Z',
    })
    data: Date;

    @ApiProperty({
        description: 'Data de criação',
        example: '2024-01-15T10:30:00.000Z',
        required: false,
    })
    createdAt?: Date;

    @ApiProperty({
        description: 'Data de atualização',
        example: '2024-01-15T10:30:00.000Z',
        required: false,
    })
    updatedAt?: Date;

    @ApiProperty({
        description: 'Informações do remetente',
        example: {
            id: 1,
            nome: 'João Silva',
        },
    })
    de: {
        id: number;
        nome: string;
    };

    @ApiProperty({
        description: 'Informações do destinatário',
        example: {
            id: 2,
            nome: 'Maria Santos',
        },
    })
    para: {
        id: number;
        nome: string;
    };
}