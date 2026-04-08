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

    detalhes(): void {
        console.log("=== DETALHES DA AERONAVE ===");
        console.log("Código: " + this.codigo);
        console.log("Modelo: " + this.modelo);
        console.log("Tipo: " + this.tipo);
        console.log("Capacidade: " + this.capacidade + " passageiros");
        console.log("Alcance: " + this.alcance + " km");
        
        console.log("\n--- PEÇAS (" + this.pecas.length + ") ---");
        for (let i = 0; i < this.pecas.length; i++) {
            this.pecas[i].mostrarDetalhes();
        }
        
        console.log("\n--- ETAPAS (" + this.etapas.length + ") ---");
        for (let i = 0; i < this.etapas.length; i++) {
            console.log((i + 1) + ". " + this.etapas[i].getNome() + " [" + this.etapas[i].getStatus() + "]");
        }
        
        console.log("\n--- TESTES (" + this.testes.length + ") ---");
        for (let i = 0; i < this.testes.length; i++) {
            this.testes[i].mostrarResultado();
        }
        
        console.log("=============================");
    }
}