import { StatusEtapa } from "../enums/statusEtapa";

export class Etapa{
    private nome: string;
    private prazo: string;
    private status: StatusEtapa;
    funcionarios: Array<any>;
    ordem: number;

    constructor(
        nome: string,
        prazo: string,
        status: StatusEtapa,
        ordem: number = 0
    ){
        this.nome = nome;
        this.prazo = prazo;
        this.status = status;
        this.funcionarios = [];
        this.ordem = ordem;
    }

    getNome(): string { return this.nome; }
    getStatus(): StatusEtapa { return this.status; }
    getOrdem(): number { return this.ordem; }
    
    iniciar(etapaAnterior: Etapa | null): void {
        if (etapaAnterior && etapaAnterior.getStatus() !== StatusEtapa.CONCLUIDA) {
            console.log("Não é possível iniciar. A etapa anterior '" + etapaAnterior.getNome() + "' ainda não foi concluída.");
            return;
        }
        
        if (this.status === StatusEtapa.PENDENTE) {
            this.status = StatusEtapa.ANDAMENTO;
            console.log("Etapa " + this.nome + " iniciada!");
        } else {
            console.log("Não é possível iniciar. Status atual: " + this.status);
        }
    }
    
    finalizar(): void{
        if (this.status === StatusEtapa.ANDAMENTO) {
            this.status = StatusEtapa.CONCLUIDA;
            console.log("Etapa " + this.nome + " concluída!");
        } else {
            console.log("Não é possível finalizar. Status atual: " + this.status);
        }
    }
    
    associarFuncionario(funcionario:any):void{
        this.funcionarios.push(funcionario);
        console.log("Funcionário associado à etapa " + this.nome);
    }
    
    listarFuncionarios(): void{
        console.log("Funcionários na etapa " + this.nome + ":");
        for (let i = 0; i < this.funcionarios.length; i++) {
            console.log("- " + this.funcionarios[i].nome);
        }
    }
    
    mostrarDetalhes(): void{
        console.log("Nome: " + this.nome);
        console.log("Prazo: " + this.prazo);
        console.log("Status: " + this.status);
        console.log("Ordem: " + this.ordem);
        console.log("Funcionários: " + this.funcionarios.length);
        console.log("---");
    }
}