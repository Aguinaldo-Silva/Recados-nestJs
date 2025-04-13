import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { Recado } from './entities/recados.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PessoasService } from 'src/pessoas/pessoas.service';
@Injectable()
export class RecadosService {
 constructor(
  @InjectRepository(Recado)
  private readonly recadoRepository: Repository<Recado>,
  private readonly pessoasService: PessoasService
 ){

 }

 async findAll(): Promise<Recado[]> {
     const recados = await this.recadoRepository.find({
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

  async create(createRecadoDto: CreateRecadoDto) {
    const {deId, paraId} = createRecadoDto;

    const de = await this.pessoasService.findOne(deId);
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
        email: recado.de.email,
      },
      para: {
        id: recado.para.id,
        nome: recado.para.nome,
        email: recado.para.email,
      },
    }
  }

  async update(id: number, updateRecadoDto: UpdateRecadoDto) {
    const partialUpdateRecadoDto = {
      lido: updateRecadoDto?.lido,
      texto: updateRecadoDto?.texto,
    }

    const recado = await this.recadoRepository.preload({
      id,
      ...partialUpdateRecadoDto,
    });
    if (!recado) {
      throw new NotFoundException('Recado não encontrado');
    }
    return this.recadoRepository.save(recado);
  }

  async delete(id: number): Promise<number> {
   const recado = await this.recadoRepository.findOneBy({id: id});
   if (!recado) {
    throw new NotFoundException('Recado não encontrado');
   }
   await this.recadoRepository.remove(recado);
   return id;
}

}

