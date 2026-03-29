import * as readline from 'readline-sync';
import { Aeronave } from './models/aeronave';
import { Funcionario } from './models/funcionario';
import { Peca } from './models/peca';
import { Etapa } from './models/etapa';
import { Teste } from './models/teste';
import { TipoAeronave } from './enums/tipoAeronave';
import { TipoPeca } from './enums/tipoPeca';
import { StatusPeca } from './enums/statusPeca';
import { StatusEtapa } from './enums/statusEtapa';
import { NivelPermissao } from './enums/nivelPermissao';
import { TipoTeste } from './enums/tipoTeste';
import { ResultadoTeste } from './enums/resultadoTeste';
import { Storage } from './storage/storage';
import { Autenticacao } from './services/autenticacao';
import { Relatorio } from './services/relatorio';

// Variaveis
let storage = new Storage();
let auth = new Autenticacao();

// Carrega todos os dados salvos no storage
let dadosAeronaves = storage.carregarAeronaves();
let aeronaves: Array<Aeronave> = [];

// Converte dados em objetos Aeronave
for (let i = 0; i < dadosAeronaves.length; i++) {
    let dado = dadosAeronaves[i];
    let aeronave = new Aeronave(dado.codigo, dado.modelo, dado.tipo, dado.capacidade, dado.alcance);
    // Restaura pecas
    if (dado.pecas) {
        for (let j = 0; j < dado.pecas.length; j++) {
            let p = dado.pecas[j];
            aeronave.pecas.push(new Peca(p.nome, p.tipo, p.fornecedor, p.status));
        }
    }
    // Restaura etapas
    if (dado.etapas) {
        for (let j = 0; j < dado.etapas.length; j++) {
            let e = dado.etapas[j];
            let etapa = new Etapa(e.nome, e.prazo, e.status);
            // Restaura funcionarios da etapa
            if (e.funcionarios) {
                for (let k = 0; k < e.funcionarios.length; k++) {
                    etapa.funcionarios.push(e.funcionarios[k]);
                }
            }
            aeronave.etapas.push(etapa);
        }
    }
    // Restaura testes
    if (dado.testes) {
        for (let j = 0; j < dado.testes.length; j++) {
            let t = dado.testes[j];
            aeronave.testes.push(new Teste(t.tipo, t.resultado));
        }
    }
    aeronaves.push(aeronave);
}

let dadosFuncionarios = storage.carregarFuncionarios();
let funcionarios: Array<Funcionario> = [];

// Converte dados em objetos Funcionario
for (let i = 0; i < dadosFuncionarios.length; i++) {
    let dado = dadosFuncionarios[i];
    let funcionario = new Funcionario(dado.id, dado.nome, dado.telefone, dado.endereco, dado.usuario, dado.senha, dado.nivelPermissao);
    funcionarios.push(funcionario);
    auth.cadastrarFuncionario(funcionario);
}

// Funcao para verificar se codigo da aeronave ja existe
function codigoExiste(codigo: string): boolean {
    for (let i = 0; i < aeronaves.length; i++) {
        if (aeronaves[i].codigo === codigo) {
            return true;
        }
    }
    return false;
}

// Funcao para buscar aeronave por codigo
function buscarAeronave(codigo: string): Aeronave | null {
    for (let i = 0; i < aeronaves.length; i++) {
        if (aeronaves[i].codigo === codigo) {
            return aeronaves[i];
        }
    }
    return null;
}

console.log("Bem-vindo ao Aerocode!");
console.log("Sistema de Gestao de Producao de Aeronaves\n");

let rodando = true;

while (rodando) {
    console.log("=== MENU PRINCIPAL ===");
    console.log("1. Cadastrar Aeronave");
    console.log("2. Listar Aeronaves");
    console.log("3. Cadastrar Funcionario");
    console.log("4. Login");
    console.log("5. Adicionar Peca a Aeronave");
    console.log("6. Adicionar Etapa a Aeronave");
    console.log("7. Executar Teste em Aeronave");
    console.log("8. Associar Funcionario a Etapa");
    console.log("9. Gerar Relatorio de Entrega");
    console.log("10. Sair");
    
    let opcao = readline.question("Escolha uma opcao: ");
    
    if (opcao === "1") {
        console.log("\n--- Cadastro de Aeronave ---");
        let codigo = readline.question("Codigo: ");
        
        // Verifica se codigo ja existe
        if (codigoExiste(codigo)) {
            console.log("Erro: Ja existe uma aeronave com esse codigo!\n");
        } else {
            let modelo = readline.question("Modelo: ");
            
            console.log("Tipos: 1-COMERCIAL, 2-MILITAR");
            let tipoNum = readline.question("Tipo (1 ou 2): ");
            let tipo = tipoNum === "2" ? TipoAeronave.MILITAR : TipoAeronave.COMERCIAL;
            
            let capacidade = parseInt(readline.question("Capacidade: "));
            let alcance = parseInt(readline.question("Alcance (km): "));
            
            let aeronave = new Aeronave(codigo, modelo, tipo, capacidade, alcance);
            aeronaves.push(aeronave);
            storage.salvarAeronave(aeronave);
            
            console.log("Aeronave cadastrada com sucesso!\n");
        }
        
    } else if (opcao === "2") {
        console.log("\n--- Lista de Aeronaves ---");
        if (aeronaves.length === 0) {
            console.log("Nenhuma aeronave cadastrada.\n");
        } else {
            for (let i = 0; i < aeronaves.length; i++) {
                aeronaves[i].detalhes();
                console.log("");
            }
        }
        
    } else if (opcao === "3") {
        console.log("\n--- Cadastro de Funcionario ---");
        let id = readline.question("ID: ");
        let nome = readline.question("Nome: ");
        let telefone = readline.question("Telefone: ");
        let endereco = readline.question("Endereco: ");
        let usuario = readline.question("Usuario: ");
        let senha = readline.question("Senha: ");
        
        console.log("Niveis: 1-ADMINISTRADOR, 2-ENGENHEIRO, 3-OPERADOR");
        let nivelNum = readline.question("Nivel (1, 2 ou 3): ");
        let nivel = NivelPermissao.OPERADOR;
        if (nivelNum === "1") nivel = NivelPermissao.ADMINISTRADOR;
        else if (nivelNum === "2") nivel = NivelPermissao.ENGENHEIRO;
        
        let funcionario = new Funcionario(id, nome, telefone, endereco, usuario, senha, nivel);
        auth.cadastrarFuncionario(funcionario);
        storage.salvarFuncionario(funcionario);
        
        console.log("Funcionario cadastrado!\n");
        
    } else if (opcao === "4") {
        console.log("\n--- Login ---");
        let usuario = readline.question("Usuario: ");
        let senha = readline.question("Senha: ");
        
        if (auth.login(usuario, senha)) {
            console.log("Login realizado!\n");
        } else {
            console.log("Falha no login.\n");
        }
        
    } else if (opcao === "5") {
        console.log("\n--- Adicionar Peca a Aeronave ---");
        let codigoAeronave = readline.question("Codigo da aeronave: ");
        let aeronave = buscarAeronave(codigoAeronave);
        
        if (aeronave) {
            let nome = readline.question("Nome da peca: ");
            
            console.log("Tipos: 1-NACIONAL, 2-IMPORTADA");
            let tipoNum = readline.question("Tipo (1 ou 2): ");
            let tipo = tipoNum === "2" ? TipoPeca.IMPORTADA : TipoPeca.NACIONAL;
            
            let fornecedor = readline.question("Fornecedor: ");
            
            console.log("Status: 1-EM_PRODUCAO, 2-EM_TRANSPORTE, 3-PRONTA");
            let statusNum = readline.question("Status (1, 2 ou 3): ");
            let status = StatusPeca.EM_PRODUCAO;
            if (statusNum === "2") status = StatusPeca.EM_TRANSPORTE;
            else if (statusNum === "3") status = StatusPeca.PRONTA;
            
            let peca = new Peca(nome, tipo, fornecedor, status);
            aeronave.pecas.push(peca);
            storage.salvarAeronave(aeronave);
            
            console.log("Peca adicionada a aeronave!\n");
        } else {
            console.log("Aeronave nao encontrada!\n");
        }
        
    } else if (opcao === "6") {
        console.log("\n--- Adicionar Etapa a Aeronave ---");
        let codigoAeronave = readline.question("Codigo da aeronave: ");
        let aeronave = buscarAeronave(codigoAeronave);
        
        if (aeronave) {
            let nome = readline.question("Nome da etapa: ");
            let prazoStr = readline.question("Prazo (dd/mm/aaaa): ");
            let etapa = new Etapa(nome, prazoStr, StatusEtapa.PENDENTE);
            aeronave.etapas.push(etapa);
            storage.salvarAeronave(aeronave);
            
            console.log("Etapa adicionada a aeronave!\n");
        } else {
            console.log("Aeronave nao encontrada!\n");
        }
        
    } else if (opcao === "7") {
        console.log("\n--- Executar Teste em Aeronave ---");
        let codigoAeronave = readline.question("Codigo da aeronave: ");
        let aeronave = buscarAeronave(codigoAeronave);
        
        if (aeronave) {
            console.log("Tipos: 1-ELETRICO, 2-HIDRAULICO, 3-AERODINAMICO");
            let tipoNum = readline.question("Tipo de teste (1, 2 ou 3): ");
            let tipo = TipoTeste.ELETRICO;
            if (tipoNum === "2") tipo = TipoTeste.HIDRAULICO;
            else if (tipoNum === "3") tipo = TipoTeste.AERODINAMICO;
            
            let teste = new Teste(tipo, ResultadoTeste.APROVADO);
            teste.executar();
            aeronave.testes.push(teste);
            storage.salvarAeronave(aeronave);
            
            console.log("Teste registrado!\n");
        } else {
            console.log("Aeronave nao encontrada!\n");
        }
        
    } else if (opcao === "8") {
        console.log("\n--- Associar Funcionario a Etapa ---");
        let codigoAeronave = readline.question("Codigo da aeronave: ");
        let aeronave = buscarAeronave(codigoAeronave);
        
        if (aeronave) {
            if (aeronave.etapas.length === 0) {
                console.log("Esta aeronave nao tem etapas cadastradas!\n");
            } else {
                console.log("Etapas disponiveis:");
                for (let i = 0; i < aeronave.etapas.length; i++) {
                    console.log((i + 1) + ". " + aeronave.etapas[i].nome);
                }
                let numEtapa = parseInt(readline.question("Numero da etapa: ")) - 1;
                
                if (numEtapa >= 0 && numEtapa < aeronave.etapas.length) {
                    let idFuncionario = readline.question("ID do funcionario: ");
                    let funcionario = null;
                    
                    // Busca funcionario
                    for (let i = 0; i < funcionarios.length; i++) {
                        if (funcionarios[i].id === idFuncionario) {
                            funcionario = funcionarios[i];
                            break;
                        }
                    }
                    
                    if (funcionario) {
                        aeronave.etapas[numEtapa].associarFuncionario(funcionario);
                        storage.salvarAeronave(aeronave);
                    } else {
                        console.log("Funcionario nao encontrado!\n");
                    }
                } else {
                    console.log("Etapa invalida!\n");
                }
            }
        } else {
            console.log("Aeronave nao encontrada!\n");
        }
        
    } else if (opcao === "9") {
        console.log("\n--- Gerar Relatorio de Entrega ---");
        let codigoAeronave = readline.question("Codigo da aeronave: ");
        let aeronave = buscarAeronave(codigoAeronave);
        
        if (aeronave) {
            let cliente = readline.question("Nome do cliente: ");
            let dataEntrega = new Date();
            
            let relatorio = new Relatorio(aeronave, cliente, dataEntrega);
            relatorio.salvarEmArquivo();
            
            console.log("Relatorio gerado com sucesso!\n");
        } else {
            console.log("Aeronave nao encontrada!\n");
        }
        
    } else if (opcao === "10") {
        console.log("Saindo...");
        rodando = false;
        
    } else {
        console.log("Opcao invalida!\n");
    }
}

console.log("Adeus!");
