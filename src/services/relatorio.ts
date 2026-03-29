import { Aeronave } from "../models/aeronave";
import * as fs from 'fs';

export class Relatorio {
    private aeronave: Aeronave;
    private cliente: string;
    private dataEntrega: Date;

    constructor(
        aeronave: Aeronave,
        cliente: string,
        dataEntrega: Date
    ) {
        this.aeronave = aeronave;
        this.cliente = cliente;
        this.dataEntrega = dataEntrega;
    }

    gerarRelatorio(): string {
        let relatorio = "=== RELATÓRIO FINAL DE ENTREGA ===\n\n";
        relatorio += "Cliente: " + this.cliente + "\n";
        relatorio += "Data de Entrega: " + this.dataEntrega.toLocaleDateString() + "\n\n";
        relatorio += "--- DADOS DA AERONAVE ---\n";
        relatorio += "Código: " + this.aeronave.codigo + "\n";
        relatorio += "Modelo: " + this.aeronave.modelo + "\n";
        relatorio += "Tipo: " + this.aeronave.tipo + "\n";
        relatorio += "Capacidade: " + this.aeronave.capacidade + " passageiros\n";
        relatorio += "Alcance: " + this.aeronave.alcance + " km\n\n";
        relatorio += "--- PEÇAS UTILIZADAS ---\n";
        relatorio += this.aeronave.pecas.length + " peça(s)\n\n";
        relatorio += "--- ETAPAS REALIZADAS ---\n";
        relatorio += this.aeronave.etapas.length + " etapa(s)\n\n";
        relatorio += "--- TESTES REALIZADOS ---\n";
        relatorio += this.aeronave.testes.length + " teste(s)\n\n";
        relatorio += "================================\n";
        return relatorio;
    }

    salvarEmArquivo(): void {
        const conteudo = this.gerarRelatorio();
        const nomeArquivo = `relatorio_${Date.now()}.txt`;
        fs.writeFileSync(nomeArquivo, conteudo, 'utf-8');
        console.log(`Relatório salvo em: ${nomeArquivo}`);
    }
}
