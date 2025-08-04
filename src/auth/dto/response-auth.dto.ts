import { ApiProperty } from '@nestjs/swagger';

export class ResponseAuthDto {
    @ApiProperty({
        description: 'Token de acesso JWT',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    accessToken: string;

    @ApiProperty({
        description: 'Token de refresh JWT',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    refreshToken: string;

    @ApiProperty({
        description: 'Informações do usuário',
        example: {
            id: 1,
            nome: 'João Silva',
            email: 'joao@email.com',
        },
    })
    user: {
        id: number;
        nome: string;
        email: string;
    };
}
