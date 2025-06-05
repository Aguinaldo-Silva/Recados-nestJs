import { Body, ForbiddenException, Injectable, NotFoundException, Query } from '@nestjs/common';
import { Recado } from './entities/recados.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PessoasService } from 'src/pessoas/pessoas.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
@Injectable()
export class RecadosService {
 constructor(
  @InjectRepository(Recado)
  private readonly recadoRepository: Repository<Recado>,
  private readonly pessoasService: PessoasService
 ){

 }

 async findAll(@Query() paginationDto?: PaginationDto) {
     const {limit = 10, offset = 0} = paginationDto || {};
     const recados = await this.recadoRepository.find({
      take: limit,
      skip: offset,
      relations: ['de', 'para'],
      order: {
        createdAt: 'DESC',
      },
      select: {
        de: {
          id: true,
          nome: true,
          email: true,
        },
        para: {
          id: true,
          nome: true,
          email: true,
        },
      },
     });
     return recados;
  }

 async findOne(id: number): Promise<Recado> {
    const recado = await this.recadoRepository.findOne({ 
      where: { id: id },
       relations: ['de', 'para'],
       select: {
        de: {
          id: true,
          nome: true,
          email: true,
        },
        para: {
          id: true,
          nome: true,
          email: true,
        },
      },
      });

    if (!recado) {
      throw new NotFoundException('Recado não encontrado');
    }
    return recado;
  }

  async create(createRecadoDto: CreateRecadoDto, tokenPayload: TokenPayloadDto) {
    const { paraId} = createRecadoDto;

    const de = await this.pessoasService.findOne(tokenPayload.sub);
    const para = await this.pessoasService.findOne(paraId);

    const novoRecado = {
      texto: createRecadoDto.texto,
      de: de,
      para: para,
      lido: false,
      data: new Date(),
    }

    const recado = await this.recadoRepository.create(novoRecado);
    await this.recadoRepository.save(recado);


    return {
      ...recado,
      de: {
        id: recado.de.id,
        nome: recado.de.nome,
      },
      para: {
        id: recado.para.id,
        nome: recado.para.nome,
      },
    }
  }

  async update(id: number, updateRecadoDto: UpdateRecadoDto, tokenPayload: TokenPayloadDto) {
   const recado = await this.findOne(id);

   recado.texto = updateRecadoDto.texto || recado.texto;
   recado.lido = updateRecadoDto.lido || recado.lido;

   if (recado.de.id !== tokenPayload.sub) {
    throw new ForbiddenException('Você não pode atualizar este recado');
   }

   await this.recadoRepository.save(recado);

   return recado;
  }

  async delete(id: number, tokenPayload: TokenPayloadDto) {
   const recado = await this.findOne(id);
  
   if (recado.de.id !== tokenPayload.sub) {
    throw new ForbiddenException('Você não pode deletar este recado');
   }
   return this.recadoRepository.remove(recado);

}

}

