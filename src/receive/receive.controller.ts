import { Body, Controller, Post, Get, UseGuards, Query, HttpStatus, Param, Patch, Delete } from '@nestjs/common';
import { ReceiveService } from './receive.service';
import { CreateReceiveDto } from './dto/create-receive.dto';
import { ResponseReceiveDto } from './dto/response-receive.dto';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiQuery,
    ApiBody,
    ApiTags,
    ApiParam
} from '@nestjs/swagger';
import { UpdateReceiveDto } from './dto/update-receive.dto';

@ApiTags('receive')
@Controller('receive')
export class ReceiveController {
    constructor(private readonly receiveService: ReceiveService) { }

    @Get()
    @UseGuards(AuthTokenGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Listar recebimentos',
        description: 'Retorna uma lista paginada de todos os recebimentos do usuário'
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Número da página',
        example: 1,
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Quantidade de itens por página',
        example: 10,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Lista de recebimentos retornada com sucesso',
        type: [ResponseReceiveDto],
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Usuário não autorizado',
    })
    async findAll(@Query() paginationDto: PaginationDto, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
        const recebimentos = await this.receiveService.findAll(tokenPayload, paginationDto);
        return recebimentos;
    }

    @Post()
    @UseGuards(AuthTokenGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Criar novo recebimento',
        description: 'Registra um novo recebimento no sistema'
    })
    @ApiBody({
        type: CreateReceiveDto,
        description: 'Dados do recebimento a ser criado',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Recebimento criado com sucesso',
        type: ResponseReceiveDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Dados inválidos fornecidos',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Usuário não autorizado',
    })
    async create(@Body() createReceiveDto: CreateReceiveDto, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
        const recebimento = await this.receiveService.createReceive(createReceiveDto, tokenPayload);
        return recebimento;
    }

    @Get(':id')
    @UseGuards(AuthTokenGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Buscar recebimento por ID',
        description: 'Retorna um recebimento específico pelo seu ID'
    })
    @ApiParam({
        name: 'id',
        description: 'ID do recebimento',
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Recebimento encontrado com sucesso',
        type: ResponseReceiveDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Recebimento não encontrado',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Usuário não autorizado',
    })
    async findOne(@Param('id') id: number, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
        return this.receiveService.findOne(id, tokenPayload);
    }

    @Patch(':id')
    @UseGuards(AuthTokenGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Atualizar recebimento',
        description: 'Atualiza um recebimento existente no sistema. Todos os campos são opcionais.'
    })
    @ApiParam({
        name: 'id',
        description: 'ID do recebimento a ser atualizado',
        example: 1,
    })
    @ApiBody({
        type: UpdateReceiveDto,
        description: 'Dados do recebimento a ser atualizado (todos os campos são opcionais)',
        examples: {
            example1: {
                summary: 'Atualizar apenas descrição',
                value: {
                    description: 'Nova descrição do recebimento'
                }
            },
            example2: {
                summary: 'Atualizar valor e categoria',
                value: {
                    amount: 200.00,
                    category: 'Salário'
                }
            },
            example3: {
                summary: 'Atualizar múltiplos campos',
                value: {
                    amount: 300.00,
                    category: 'Freelance',
                    description: 'Pagamento por projeto concluído',
                    createdAt: '2024-01-20'
                }
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Recebimento atualizado com sucesso',
        type: ResponseReceiveDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Recebimento não encontrado',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Usuário não tem permissão para atualizar este recebimento',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Dados inválidos fornecidos',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Usuário não autorizado',
    })
    async update(@Param('id') id: number, @Body() updateReceiveDto: UpdateReceiveDto, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
        const recebimento = await this.receiveService.updateReceive(id, updateReceiveDto, tokenPayload);
        return recebimento;
    }


    @Delete(':id')
    @UseGuards(AuthTokenGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Deletar recebimento',
        description: 'Deleta um recebimento existente no sistema'
    })
    @ApiParam({
        name: 'id',
        description: 'ID do recebimento a ser deletado',
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Recebimento deletado com sucesso',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Recebimento não encontrado',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Usuário não tem permissão para deletar este recebimento',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Usuário não autorizado',
    })
    async delete(@Param('id') id: number, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
        await this.receiveService.deleteReceive(id, tokenPayload);
        return { message: 'Recebimento deletado com sucesso' };
    }
}