import { ResultadoTeste } from "../enums/resultadoTeste";
import { TipoTeste } from "../enums/tipoTeste";

export class Teste{
    private tipo: TipoTeste;
    private resultado: ResultadoTeste;

    constructor (
        tipo: TipoTeste,
        resultado: ResultadoTeste
    ){
        this.tipo = tipo;
        this.resultado = resultado;
    }
    executar(): void{
        // Simula execução do teste
        let numero = Math.random();
        if (numero > 0.5) {
            this.resultado = ResultadoTeste.APROVADO;
            console.log("Teste " + this.tipo + " APROVADO!");
        } else {
            this.resultado = ResultadoTeste.REPROVADO;
            console.log("Teste " + this.tipo + " REPROVADO!");
        }
    }
    
    mostrarResultado(): void{
        console.log("Tipo: " + this.tipo);
        console.log("Resultado: " + this.resultado);
        console.log("---");
    }
}































"🐣"