import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { Pessoa } from './entities/pessoa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'node:crypto';

@Injectable()
export class PessoasService {

  constructor(
    @InjectRepository(Pessoa)
    private pessoaRepository: Repository<Pessoa>,
  ) {}

 async findAll() {
    return await this.pessoaRepository.find({
      order: {
        nome: 'ASC',
      },
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
      const pessoaData = {
        nome: createPessoaDto.nome,
        email: createPessoaDto.email,
        passwordHash: createPessoaDto.password,
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



  async update(id: number, updatePessoaDto: UpdatePessoaDto) {
    const dadosAtualizacao = {
      nome: updatePessoaDto.nome,
      passwordHash: updatePessoaDto.password,
    }

    const pessoa = await this.pessoaRepository.preload({
      id,
      ...dadosAtualizacao,
    });

    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    return this.pessoaRepository.save(pessoa);
    
    
    
  }

  async remove(id: number) {
    const pessoa = await this.pessoaRepository.findOneBy({ id });
    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }
    return this.pessoaRepository.remove(pessoa);
  }
}
