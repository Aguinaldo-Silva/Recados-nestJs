import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, UploadedFile, UseInterceptors, HttpStatus } from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { ResponsePessoaDto } from './dto/response-pessoa.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { Request } from 'express';
import { REQUEST_TOKEN_PAYLOAD_KEY } from 'src/auth/auth.constants';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs/promises';
import * as path from 'path';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiTags,
  ApiBody,
  ApiConsumes
} from '@nestjs/swagger';

@ApiTags('pessoas')
@Controller('pessoas')
export class PessoasController {
  constructor(private readonly pessoasService: PessoasService) { }

  @Post()
  @ApiOperation({
    summary: 'Criar nova pessoa',
    description: 'Cria uma nova pessoa no sistema'
  })
  @ApiBody({
    type: CreatePessoaDto,
    description: 'Dados da pessoa a ser criada',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Pessoa criada com sucesso',
    type: ResponsePessoaDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos fornecidos',
  })
  create(@Body() createPessoaDto: CreatePessoaDto) {
    return this.pessoasService.create(createPessoaDto);
  }

  @Get()
  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Listar todas as pessoas',
    description: 'Retorna uma lista paginada de todas as pessoas do sistema'
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
    description: 'Lista de pessoas retornada com sucesso',
    type: [ResponsePessoaDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autorizado',
  })
  findAll(@Query() paginationDto: PaginationDto, @Req() request: Request) {
    console.log(request[REQUEST_TOKEN_PAYLOAD_KEY].sub);
    return this.pessoasService.findAll(paginationDto);
  }

  @Get(':id')
  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Buscar pessoa por ID',
    description: 'Retorna uma pessoa específica pelo seu ID'
  })
  @ApiParam({
    name: 'id',
    description: 'ID da pessoa',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pessoa encontrada com sucesso',
    type: ResponsePessoaDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pessoa não encontrada',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autorizado',
  })
  findOne(@Param('id') id: string) {
    return this.pessoasService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Atualizar pessoa',
    description: 'Atualiza uma pessoa existente pelo ID'
  })
  @ApiParam({
    name: 'id',
    description: 'ID da pessoa a ser atualizada',
    example: 1,
  })
  @ApiBody({
    type: UpdatePessoaDto,
    description: 'Dados da pessoa a ser atualizada',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pessoa atualizada com sucesso',
    type: ResponsePessoaDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pessoa não encontrada',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autorizado',
  })
  update(
    @Param('id') id: string,
    @Body() updatePessoaDto: UpdatePessoaDto,
    @TokenPayloadParam() payload: TokenPayloadDto
  ) {
    return this.pessoasService.update(+id, updatePessoaDto, payload);
  }

  @Delete(':id')
  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Deletar pessoa',
    description: 'Remove uma pessoa do sistema pelo ID'
  })
  @ApiParam({
    name: 'id',
    description: 'ID da pessoa a ser deletada',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pessoa deletada com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pessoa não encontrada',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autorizado',
  })
  remove(
    @Param('id') id: string,
    @TokenPayloadParam() payload: TokenPayloadDto
  ) {
    return this.pessoasService.remove(+id, payload);
  }

  @Post('upload-image')
  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload de imagem',
    description: 'Faz upload de uma imagem para o perfil do usuário'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo de imagem',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Imagem enviada com sucesso',
    schema: {
      type: 'object',
      properties: {
        fileName: {
          type: 'string',
          example: 'user123.jpg',
        },
        originalName: {
          type: 'string',
          example: 'profile.jpg',
        },
        mimetype: {
          type: 'string',
          example: 'image/jpeg',
        },
        size: {
          type: 'number',
          example: 1024,
        },
        path: {
          type: 'string',
          example: '/path/to/image',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autorizado',
  })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    const fileExtension = path.extname(file.originalname)
      .toLowerCase()
      .substring(1);

    const fileName = `${tokenPayload.sub}.${fileExtension}`;
    const fileFullPath = path.resolve(process.cwd(), 'images', fileName);

    await fs.writeFile(fileFullPath, file.buffer);

    return {
      fileName: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      buffer: {},
      size: file.size,
      path: file.path,
    };
  }
}
