import { ApiProperty } from "@nestjs/swagger";

export class ResponseReceiveDto {
    @ApiProperty({
        description: 'ID do recebimento',
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
        example: '2021-01-01',
    })
    createdAt: string;

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
}
