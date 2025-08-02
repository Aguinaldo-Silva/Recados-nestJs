import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Receive {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'varchar', length: 100 })
  description: string;

  @Column({ type: 'int' })
  pessoaId: number;
}