import { ApiProperty } from '@nestjs/swagger';

export class ResponseReceiveDto {
    @ApiProperty({
        description: 'ID único do recebimento',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'Valor recebido',
        example: 100,
    })
    amount: number;

    @ApiProperty({
        description: 'Data de recebimento',
        example: '2024-01-15T10:30:00.000Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Categoria do recebimento',
        example: 'Salário',
    })
    category: string;

    @ApiProperty({
        description: 'Descrição do recebimento',
        example: 'Recebimento de salário',
    })
    description: string;

    @ApiProperty({
        description: 'Data de atualização',
        example: '2024-01-15T10:30:00.000Z',
        required: false,
    })
    updatedAt?: Date;

    @ApiProperty({
        description: 'ID do usuário que registrou o recebimento',
        example: 1,
    })
    userId: number;
}
