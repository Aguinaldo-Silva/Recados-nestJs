import { Pessoa } from "src/pessoas/entities/pessoa.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Recado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  texto: string;

  //Muitos recados podem ser enviado por uma unica pessoa
  @ManyToOne(() => Pessoa)
  //nome da coluna que vai ser criada na tabela recado que armazena o id da pessoa que enviou o recado
  @JoinColumn({ name: 'de' })
  de: Pessoa;

  //Muitos recados podem ser enviado para uma unica pessoa
  @ManyToOne(() => Pessoa)
  //nome da coluna que vai ser criada na tabela recado que armazena o id da pessoa que recebeu o recado
  @JoinColumn({ name: 'para' })
  para: Pessoa;

  @Column({ type: 'boolean', default: false })
  lido: boolean;

  @Column({ type: 'date' })
  data: Date;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
