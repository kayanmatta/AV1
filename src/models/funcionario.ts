import { NivelPermissao } from "../enums/nivelPermissao";

export class Funcionario {
    id: string;
    nome: string;
    telefone: string;
    endereco: string;
    usuario: string;
    senha: string;
    nivelPermissao: NivelPermissao;

    constructor(
        id: string,
        nome: string,
        telefone: string,
        endereco: string,
        usuario: string,
        senha: string,
        nivelPermissao: NivelPermissao
    ){
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.usuario = usuario;
        this.senha = senha;
        this.nivelPermissao = nivelPermissao;
    }
    autenticar(usuarioDigitado: string, senhaDigitada:string): boolean{
        return this.usuario === usuarioDigitado && this.senha === senhaDigitada;
    }

    mostrarDetalhes(): void{
        console.log("ID: " + this.id);
        console.log("Nome: " + this.nome);
        console.log("Telefone: " + this.telefone);
        console.log("Endereço: " + this.endereco);
        console.log("Usuário: " + this.usuario);
        console.log("Nível: " + this.nivelPermissao);
        console.log("---");
    }
    salvar(): void{

    }
    carregar(id:string): Funcionario | null{
        return null;
    }

}