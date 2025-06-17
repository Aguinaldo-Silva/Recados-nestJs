import { IPessoa } from "./IPessoas.interface";

export interface IRecado {
    id: number;
    texto: string;
    de: IPessoa;
    para: IPessoa;
}