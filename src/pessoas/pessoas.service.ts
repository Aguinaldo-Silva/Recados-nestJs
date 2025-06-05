import { ConflictException, ForbiddenException, Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { Pessoa } from './entities/pessoa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'node:crypto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable()
export class PessoasService {

  constructor(
    @InjectRepository(Pessoa)
    private pessoaRepository: Repository<Pessoa>,
    private hashingService: HashingService,
  ) {}

 async findAll(@Query() paginationDto?: PaginationDto) {
    const {limit = 10, offset = 0} = paginationDto || {};
    return await this.pessoaRepository.find({
      order: {
        nome: 'ASC',
      },
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: number) {
    const pessoa = await this.pessoaRepository.findOneBy({ id });

    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    return pessoa;
  }

  async create(createPessoaDto: CreatePessoaDto) {
    try {

      const passwordHash = await this.hashingService.hash(createPessoaDto.password);

      const pessoaData = {
        nome: createPessoaDto.nome,
        email: createPessoaDto.email,
        passwordHash: passwordHash,
     }

     const pessoa = this.pessoaRepository.create(pessoaData);
     await this.pessoaRepository.save(pessoa);

     return pessoa;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email já cadastrado');
      }
      throw error;
    }
  }



  async update(id: number, updatePessoaDto: UpdatePessoaDto, tokenPayload: TokenPayloadDto) {
    const dadosAtualizacao = {
      nome: updatePessoaDto.nome
    }

    if (updatePessoaDto.password) {
      const passwordHash = await this.hashingService.hash(updatePessoaDto.password);

      dadosAtualizacao["passwordHash"] = passwordHash;
    }

    const pessoa = await this.pessoaRepository.preload({
      id,
      ...dadosAtualizacao,
    });

    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    if (pessoa.id !== tokenPayload.sub) {
      throw new ForbiddenException('Você não pode atualizar esta pessoa');
    }

    return this.pessoaRepository.save(pessoa);
    
    
    
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const pessoa = await this.pessoaRepository.findOneBy({ id });
    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    if (pessoa.id !== tokenPayload.sub) {
      throw new ForbiddenException('Você não pode deletar esta pessoa');
    }

    return this.pessoaRepository.remove(pessoa);
  }
}
