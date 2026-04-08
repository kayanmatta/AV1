import { Funcionario } from "../models/funcionario";
import { NivelPermissao } from "../enums/nivelPermissao";

export class Autenticacao {
    private funcionariosCadastrados: Array<Funcionario>;
    private usuarioLogado: Funcionario | null;

    constructor() {
        this.funcionariosCadastrados = [];
        this.usuarioLogado = null;
    }

    cadastrarFuncionario(funcionario: Funcionario): void {
        this.funcionariosCadastrados.push(funcionario);
        console.log("Funcionário " + funcionario.nome + " cadastrado!");
    }

    login(usuario: string, senha: string): boolean {
        for (let i = 0; i < this.funcionariosCadastrados.length; i++) {
            let func = this.funcionariosCadastrados[i];
            if (func.autenticar(usuario, senha)) {
                this.usuarioLogado = func;
                console.log("Login OK! Bem-vindo: " + func.nome);
                return true;
            }
        }
        console.log("Usuário ou senha errados.");
        return false;
    }

    logout(): void {
        if (this.usuarioLogado) {
            console.log("Usuário " + this.usuarioLogado.nome + " deslogado.");
            this.usuarioLogado = null;
        } else {
            console.log("Sem usuário logado.");
        }
    }

    verificarPermissao(nivelNecessario: NivelPermissao): boolean {
        if (!this.usuarioLogado) {
            return false;
        }
        
        if (this.usuarioLogado.nivelPermissao === NivelPermissao.ADMINISTRADOR) {
            return true;
        }
        
        return this.usuarioLogado.nivelPermissao === nivelNecessario;
    }

    getUsuarioLogado(): Funcionario | null {
        return this.usuarioLogado;
    }

    temFuncionariosCadastrados(): boolean {
        return this.funcionariosCadastrados.length > 0;
    }

    listarFuncionarios(): void {
        console.log("\n=== FUNCIONÁRIOS ===");
        for (let i = 0; i < this.funcionariosCadastrados.length; i++) {
            this.funcionariosCadastrados[i].mostrarDetalhes();
        }
        console.log("================\n");
    }
}
