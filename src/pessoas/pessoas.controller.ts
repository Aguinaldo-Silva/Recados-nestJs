import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { Request } from 'express';
import { REQUEST_TOKEN_PAYLOAD_KEY } from 'src/auth/auth.constants';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs/promises';
import * as path from 'path';

@Controller('pessoas')
export class PessoasController {
  constructor(private readonly pessoasService: PessoasService) { }

  @Post()
  create(@Body() createPessoaDto: CreatePessoaDto) {
    return this.pessoasService.create(createPessoaDto);
  }

  @UseGuards(AuthTokenGuard)
  @Get()
  findAll(@Query() paginationDto: PaginationDto, @Req() request: Request) {
    console.log(request[REQUEST_TOKEN_PAYLOAD_KEY].sub);
    return this.pessoasService.findAll(paginationDto);
  }

  @UseGuards(AuthTokenGuard)
  @Get(':id')
  findOne(
    @Param('id') id: string
  ) {
    return this.pessoasService.findOne(+id);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePessoaDto: UpdatePessoaDto,
    @TokenPayloadParam() payload: TokenPayloadDto
  ) {
    return this.pessoasService.update(+id, updatePessoaDto, payload);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @TokenPayloadParam() payload: TokenPayloadDto
  ) {
    return this.pessoasService.remove(+id, payload);
  }

  @UseGuards(AuthTokenGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-image')
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
