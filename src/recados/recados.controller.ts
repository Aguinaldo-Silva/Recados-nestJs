import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, HttpStatus } from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { ResponseRecadoDto } from './dto/response-recado.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { SetRoutePolicy } from 'src/auth/decorators/set-route-policy.decorator';
import { RoutePolicies } from 'src/auth/enums/route-policies.enum';
import { RoutePolicyGuard } from 'src/auth/guards/route-policy.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiTags,
  ApiBody
} from '@nestjs/swagger';

@ApiTags('recados')
@Controller('recados')
@UseGuards(RoutePolicyGuard)
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) { }

  @Get()
  @SetRoutePolicy(RoutePolicies.findAllRecados)
  @ApiOperation({
    summary: 'Listar todos os recados',
    description: 'Retorna uma lista paginada de todos os recados do sistema'
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
    description: 'Lista de recados retornada com sucesso',
    type: [ResponseRecadoDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autorizado',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    const recados = await this.recadosService.findAll(paginationDto);
    return recados;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar recado por ID',
    description: 'Retorna um recado específico pelo seu ID'
  })
  @ApiParam({
    name: 'id',
    description: 'ID do recado',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Recado encontrado com sucesso',
    type: ResponseRecadoDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Recado não encontrado',
  })
  findOne(@Param('id') id: number) {
    return this.recadosService.findOne(id);
  }

  @Post()
  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Criar novo recado',
    description: 'Cria um novo recado no sistema'
  })
  @ApiBody({
    type: CreateRecadoDto,
    description: 'Dados do recado a ser criado',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Recado criado com sucesso',
    type: ResponseRecadoDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos fornecidos',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autenticação inválido',
  })
  create(@Body() createRecadoDto: CreateRecadoDto, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.recadosService.create(createRecadoDto, tokenPayload);
  }

  @Put(':id')
  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Atualizar recado',
    description: 'Atualiza um recado existente pelo ID'
  })
  @ApiParam({
    name: 'id',
    description: 'ID do recado a ser atualizado',
    example: 1,
  })
  @ApiBody({
    type: UpdateRecadoDto,
    description: 'Dados do recado a ser atualizado',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Recado atualizado com sucesso',
    type: ResponseRecadoDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Recado não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autenticação inválido',
  })
  update(@Param('id') id: number, @Body() updateRecadoDto: UpdateRecadoDto, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.recadosService.update(id, updateRecadoDto, tokenPayload);
  }

  @Delete(':id')
  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Deletar recado',
    description: 'Remove um recado do sistema pelo ID'
  })
  @ApiParam({
    name: 'id',
    description: 'ID do recado a ser deletado',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Recado deletado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Recado não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autenticação inválido',
  })
  delete(@Param('id') id: number, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.recadosService.delete(id, tokenPayload);
  }
}
