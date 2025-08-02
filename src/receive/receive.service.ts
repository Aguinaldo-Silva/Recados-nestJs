import { Injectable } from '@nestjs/common';
import { Receive } from './entities/receive.entity';
import { Repository } from 'typeorm';
import { CreateReceiveDto } from './dto/create-receive.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PessoasService } from 'src/pessoas/pessoas.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ResponseReceiveDto } from './dto/response-receive.dto';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ReceiveService {
    constructor(
        @InjectRepository(Receive)
        private readonly receiveRepository: Repository<Receive>,
        private readonly pessoasService: PessoasService
    ) { }

    async findAll(tokenPayload: TokenPayloadDto, paginationDto?: PaginationDto): Promise<ResponseReceiveDto[]> {

        const { limit = 10, offset = 0 } = paginationDto || {};

        const pessoa = await this.pessoasService.findOne(tokenPayload.sub);
        const recebimentos = await this.receiveRepository.find({
            where: { pessoaId: pessoa.id },
            take: limit,
            skip: offset,
            order: {
                createdAt: 'DESC',
            },
        });

        return recebimentos.map(recebimento => ({
            id: recebimento.id,
            amount: recebimento.amount,
            createdAt: new Date(recebimento.createdAt).toISOString(),
            category: recebimento.category,
            description: recebimento.description,
        }));
    }

    async createReceive(createReceiveDto: CreateReceiveDto, tokenPayload: TokenPayloadDto): Promise<Receive> {
        const { amount, createdAt, category, description } = createReceiveDto;


        await this.pessoasService.findOne(tokenPayload.sub);

        const novoReceive = this.receiveRepository.create({
            amount,
            createdAt: new Date(createdAt),
            category,
            description,
            pessoaId: tokenPayload.sub,
        });

        return await this.receiveRepository.save(novoReceive);
    }
}