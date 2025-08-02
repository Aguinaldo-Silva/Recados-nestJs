import { Body, Controller, Post, Get, UseGuards, Query } from '@nestjs/common';
import { ReceiveService } from './receive.service';
import { CreateReceiveDto } from './dto/create-receive.dto';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('receive')
export class ReceiveController {
    constructor(private readonly receiveService: ReceiveService) { }

    @Get()
    @UseGuards(AuthTokenGuard)
    @ApiBearerAuth()
    async findAll(@Query() paginationDto: PaginationDto, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
        const recebimentos = await this.receiveService.findAll(tokenPayload, paginationDto);
        return recebimentos;
    }

    @Post()
    @UseGuards(AuthTokenGuard)
    @ApiBearerAuth()
    async create(@Body() createReceiveDto: CreateReceiveDto, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
        const recebimento = await this.receiveService.createReceive(createReceiveDto, tokenPayload);
        return recebimento;
    }
}