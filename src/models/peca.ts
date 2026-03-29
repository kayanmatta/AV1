import { TipoPeca } from "../enums/tipoPeca";
import { StatusPeca } from "../enums/statusPeca";

export class Peca{
    private nome: string;
    private tipo: TipoPeca;
    private fornecedor: string;
    private status: StatusPeca;

    constructor(
        nome: string,
        tipo: TipoPeca,
        fornecedor: string,
        status: StatusPeca
    ){
        this.nome = nome;
        this.tipo = tipo;
        this.fornecedor = fornecedor;
        this.status = status;
    }

    atualizarStatus(novoStatus: StatusPeca): void{
        this.status = novoStatus;
        console.log("Status da peça " + this.nome + " atualizado para: " + novoStatus);
    }
    
    mostrarDetalhes(): void{
        console.log("Nome: " + this.nome);
        console.log("Tipo: " + this.tipo);
        console.log("Fornecedor: " + this.fornecedor);
        console.log("Status: " + this.status);
        console.log("---");
    }
    
    salvar(): void{
        console.log("Peça salva!");
    }
    
    carregar(nome: string): Peca | null{
        return null;
    }
}