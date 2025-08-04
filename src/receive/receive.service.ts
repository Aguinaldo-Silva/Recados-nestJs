import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
import { UpdateReceiveDto } from './dto/update-receive.dto';

@Injectable()
export class ReceiveService {
    constructor(
        @InjectRepository(Receive)
        private readonly receiveRepository: Repository<Receive>,
        private readonly pessoasService: PessoasService
    ) { }

    async findAll(tokenPayload: TokenPayloadDto, paginationDto?: PaginationDto): Promise<ResponseReceiveDto[]> {

        const { limit = 10, page = 0 } = paginationDto || {};

        const pessoa = await this.pessoasService.findOne(tokenPayload.sub);
        const recebimentos = await this.receiveRepository.find({
            where: { pessoaId: pessoa.id },
            take: limit,
            skip: page,
            order: {
                createdAt: 'DESC',
            },
        });

        return recebimentos.map(recebimento => ({
            id: recebimento.id,
            amount: recebimento.amount,
            createdAt: recebimento.createdAt,
            category: recebimento.category,
            description: recebimento.description,
            updatedAt: recebimento.updatedAt,
            userId: recebimento.pessoaId,
        }));
    }

    async findOne(id: number, tokenPayload: TokenPayloadDto): Promise<ResponseReceiveDto> {
        const pessoa = await this.pessoasService.findOne(tokenPayload.sub);

        const receive = await this.receiveRepository.findOne({ where: { id: id, pessoaId: pessoa.id } });
        if (!receive) {
            throw new NotFoundException('Recebimento não encontrado');
        }

        return {
            id: receive.id,
            amount: receive.amount,
            createdAt: receive.createdAt,
            category: receive.category,
            description: receive.description,
            updatedAt: receive.updatedAt,
            userId: receive.pessoaId,
        };
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

    async updateReceive(id: number, updateReceiveDto: UpdateReceiveDto, tokenPayload: TokenPayloadDto): Promise<Receive> {
        const receive = await this.receiveRepository.findOne({ where: { id: id } });
        if (!receive) {
            throw new NotFoundException('Recebimento não encontrado');
        }

        if (receive.pessoaId !== tokenPayload.sub) {
            throw new ForbiddenException('Você não pode atualizar este recebimento');
        }

        receive.description = updateReceiveDto.description || receive.description;
        receive.amount = updateReceiveDto.amount || receive.amount;
        receive.category = updateReceiveDto.category || receive.category;
        receive.updatedAt = new Date();

        return await this.receiveRepository.save(receive);
    }

    async deleteReceive(id: number, tokenPayload: TokenPayloadDto): Promise<void> {
        const pessoa = await this.pessoasService.findOne(tokenPayload.sub);
        const receive = await this.receiveRepository.findOne({ where: { id: id, pessoaId: pessoa.id } });
        if (!receive) {
            throw new NotFoundException('Recebimento não encontrado');
        }

        if (receive.pessoaId !== tokenPayload.sub) {
            throw new ForbiddenException('Você não pode deletar este recebimento');
        }

        await this.receiveRepository.delete(id);
    }
}
