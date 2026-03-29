import { TipoAeronave } from "../enums/tipoAeronave";

export class Aeronave {
    codigo: string;
    modelo: string;
    tipo: TipoAeronave;
    capacidade: number;
    alcance: number;
    pecas: Array<any>;
    etapas: Array<any>;
    testes: Array<any>;

    constructor(
        codigo: string,
        modelo: string,
        tipo: TipoAeronave,
        capacidade: number,
        alcance: number
        
    ){
        this.etapas = [];
        this.testes = [];
        this.pecas = [];
        this.codigo = codigo;
        this.modelo = modelo;
        this.tipo = tipo;
        this.capacidade = capacidade;
        this.alcance = alcance;
    }
    // Método pra mostrar os dados
    detalhes(): void{
        console.log("=== DETALHES DA AERONAVE ===");
        console.log("Código: " + this.codigo);
        console.log("Modelo: " + this.modelo);
        console.log("Tipo: " + this.tipo);
        console.log("Capacidade: " + this.capacidade + " passageiros");
        console.log("Alcance: " + this.alcance + " km");
        console.log("Peças: " + this.pecas.length);
        console.log("Etapas: " + this.etapas.length);
        console.log("Testes: " + this.testes.length);
        console.log("=============================");
    }

    salvar(): void{

    }

    carregar(codigo: string): Aeronave | null {
        return null;

    }
}