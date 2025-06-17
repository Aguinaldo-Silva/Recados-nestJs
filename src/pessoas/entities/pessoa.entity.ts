import { IsEmail } from "class-validator";
import { RoutePolicies } from "src/auth/enums/route-policies.enum";
import { IRecado } from "src/common/models/IRecado.interface";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Pessoa {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    nome: string;

    @IsEmail()
    @Column({ unique: true })
    email: string;

    @Column({ length: 100, nullable: false })
    passwordHash: string;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @OneToMany("Recado", "de")
    recadosEnviados: IRecado[];

    @OneToMany("Recado", "para")
    recadosRecebidos: IRecado[];

    @Column({ default: true })
    active: boolean;

    @Column({ type: 'simple-array', default: [] })
    routePolicies: RoutePolicies[];
}
