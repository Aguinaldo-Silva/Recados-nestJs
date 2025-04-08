import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { Recado } from './entities/recados.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class RecadosService {
 constructor(
  @InjectRepository(Recado)
  private readonly recadoRepository: Repository<Recado>
 ){

 }

  private lastId = 1;

  private recados: Recado[] = [
    {
      id: 1,
      texto: 'Recado 1',
      de: 'João',
      para: 'Maria',
      lido: false,
      data: new Date(),
    },
    {
      id: 2,
      texto: 'Recado 2',
      de: 'ze',
      para: 'Maria',
      lido: false,
      data: new Date(),
    },
  ];

 async findAll(): Promise<Recado[]> {
     const recados = await this.recadoRepository.find();
     return recados;
  }

 async findOne(id: number): Promise<Recado> {
    const recado = await this.recadoRepository.findOne({ where: { id: id } });
    if (!recado) {
      throw new NotFoundException('Recado não encontrado');
    }
    return recado;
  }

  async create(createRecadoDto: CreateRecadoDto) {

    const novoRecado = {
      ...createRecadoDto,
      lido: false,
      data: new Date(),
    }

    const recado = await this.recadoRepository.create(novoRecado);
    return this.recadoRepository.save(recado);
  }

  update(id: string, updateRecadoDto: UpdateRecadoDto) {
    const index = this.recados.findIndex((recado) => recado.id === parseInt(id));
    if (index >= 0) {
      this.recados[index] = {
        ...this.recados[index],
        ...updateRecadoDto,
      };
      return this.recados[index];
    }
    return `esse é o recado não encontrado`;
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

