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

let storage = new Storage();
let auth = new Autenticacao();

function temPermissao(nivelNecessario: NivelPermissao): boolean {
    let usuarioLogado = auth.getUsuarioLogado();
    if (!usuarioLogado) {
        console.log("Erro: Você precisa estar logado para realizar esta ação!");
        return false;
    }
    
    if (usuarioLogado.nivelPermissao === NivelPermissao.ADMINISTRADOR) {
        return true;
    }
    
    if (usuarioLogado.nivelPermissao !== nivelNecessario) {
        console.log("Erro: Permissão insuficiente! Necessário: " + nivelNecessario);
        return false;
    }
    
    return true;
}

function estaLogado(): boolean {
    if (!auth.getUsuarioLogado()) {
        console.log("Erro: Você precisa estar logado para realizar esta ação!");
        return false;
    }
    return true;
}

let dadosAeronaves = storage.carregarAeronaves();
let aeronaves: Array<Aeronave> = [];

for (let i = 0; i < dadosAeronaves.length; i++) {
    let dado = dadosAeronaves[i];
    let aeronave = new Aeronave(dado.codigo, dado.modelo, dado.tipo, dado.capacidade, dado.alcance);
    
    if (dado.pecas) {
        for (let j = 0; j < dado.pecas.length; j++) {
            let p = dado.pecas[j];
            aeronave.pecas.push(new Peca(p.nome, p.tipo, p.fornecedor, p.status));
        }
    }
    
    if (dado.etapas) {
        for (let j = 0; j < dado.etapas.length; j++) {
            let e = dado.etapas[j];
            let ordem = e.ordem || (j + 1);
            let etapa = new Etapa(e.nome, e.prazo, e.status, ordem);
            if (e.funcionarios) {
                for (let k = 0; k < e.funcionarios.length; k++) {
                    etapa.funcionarios.push(e.funcionarios[k]);
                }
            }
            aeronave.etapas.push(etapa);
        }
    }
    
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

for (let i = 0; i < dadosFuncionarios.length; i++) {
    let dado = dadosFuncionarios[i];
    let funcionario = new Funcionario(dado.id, dado.nome, dado.telefone, dado.endereco, dado.usuario, dado.senha, dado.nivelPermissao);
    funcionarios.push(funcionario);
    auth.cadastrarFuncionario(funcionario);
}

function codigoExiste(codigo: string): boolean {
    for (let i = 0; i < aeronaves.length; i++) {
        if (aeronaves[i].codigo === codigo) {
            return true;
        }
    }
    return false;
}

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
    let usuarioLogado = auth.getUsuarioLogado();
    if (usuarioLogado) {
        console.log("[Logado: " + usuarioLogado.nome + " (" + usuarioLogado.nivelPermissao + ")]\n");
    } else {
        console.log("[Nenhum usuário logado]\n");
    }
    
    console.log("=== MENU PRINCIPAL ===");
    console.log("1. Cadastrar Aeronave");
    console.log("2. Listar Aeronaves");
    console.log("3. Cadastrar Funcionario");
    console.log("4. Login");
    console.log("5. Logout");
    console.log("6. Adicionar Peca a Aeronave");
    console.log("7. Adicionar Etapa a Aeronave");
    console.log("8. Atualizar Status de Peca");
    console.log("9. Iniciar Etapa");
    console.log("10. Finalizar Etapa");
    console.log("11. Associar Funcionario a Etapa");
    console.log("12. Listar Funcionarios de Etapa");
    console.log("13. Executar Teste em Aeronave");
    console.log("14. Gerar Relatorio de Entrega");
    console.log("15. Sair");
    
    let opcao = readline.question("Escolha uma opcao: ");
    
    if (opcao === "1") {
        if (!temPermissao(NivelPermissao.ADMINISTRADOR)) continue;
        
        console.log("\n--- Cadastro de Aeronave ---");
        let codigo = readline.question("Codigo: ");
        
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
        if (auth.temFuncionariosCadastrados() && !temPermissao(NivelPermissao.ADMINISTRADOR)) {
            continue;
        }
        
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
        auth.logout();
        console.log("");
        
    } else if (opcao === "6") {
        if (!temPermissao(NivelPermissao.ENGENHEIRO)) continue;
        
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
        
    } else if (opcao === "7") {
        if (!temPermissao(NivelPermissao.ENGENHEIRO)) continue;
        
        console.log("\n--- Adicionar Etapa a Aeronave ---");
        let codigoAeronave = readline.question("Codigo da aeronave: ");
        let aeronave = buscarAeronave(codigoAeronave);
        
        if (aeronave) {
            let nome = readline.question("Nome da etapa: ");
            let prazoStr = readline.question("Prazo (dd/mm/aaaa): ");
            let ordem = aeronave.etapas.length + 1;
            let etapa = new Etapa(nome, prazoStr, StatusEtapa.PENDENTE, ordem);
            aeronave.etapas.push(etapa);
            storage.salvarAeronave(aeronave);
            
            console.log("Etapa adicionada a aeronave! (Ordem: " + ordem + ")\n");
        } else {
            console.log("Aeronave nao encontrada!\n");
        }
        
    } else if (opcao === "8") {
        if (!temPermissao(NivelPermissao.OPERADOR)) continue;
        
        console.log("\n--- Atualizar Status de Peca ---");
        let codigoAeronave = readline.question("Codigo da aeronave: ");
        let aeronave = buscarAeronave(codigoAeronave);
        
        if (aeronave) {
            if (aeronave.pecas.length === 0) {
                console.log("Esta aeronave nao tem pecas cadastradas!\n");
            } else {
                console.log("Pecas disponiveis:");
                for (let i = 0; i < aeronave.pecas.length; i++) {
                    console.log((i + 1) + ". " + aeronave.pecas[i].getNome() + " [" + aeronave.pecas[i].getStatus() + "]");
                }
                let numPeca = parseInt(readline.question("Numero da peca: ")) - 1;
                
                if (numPeca >= 0 && numPeca < aeronave.pecas.length) {
                    console.log("Novo status: 1-EM_PRODUCAO, 2-EM_TRANSPORTE, 3-PRONTA");
                    let statusNum = readline.question("Status (1, 2 ou 3): ");
                    let novoStatus = StatusPeca.EM_PRODUCAO;
                    if (statusNum === "2") novoStatus = StatusPeca.EM_TRANSPORTE;
                    else if (statusNum === "3") novoStatus = StatusPeca.PRONTA;
                    
                    aeronave.pecas[numPeca].atualizarStatus(novoStatus);
                    storage.salvarAeronave(aeronave);
                } else {
                    console.log("Peca invalida!\n");
                }
            }
        } else {
            console.log("Aeronave nao encontrada!\n");
        }
        
    } else if (opcao === "9") {
        if (!temPermissao(NivelPermissao.OPERADOR)) continue;
        
        console.log("\n--- Iniciar Etapa ---");
        let codigoAeronave = readline.question("Codigo da aeronave: ");
        let aeronave = buscarAeronave(codigoAeronave);
        
        if (aeronave) {
            if (aeronave.etapas.length === 0) {
                console.log("Esta aeronave nao tem etapas cadastradas!\n");
            } else {
                console.log("Etapas disponiveis:");
                for (let i = 0; i < aeronave.etapas.length; i++) {
                    console.log((i + 1) + ". " + aeronave.etapas[i].getNome() + " [" + aeronave.etapas[i].getStatus() + "]");
                }
                let numEtapa = parseInt(readline.question("Numero da etapa: ")) - 1;
                
                if (numEtapa >= 0 && numEtapa < aeronave.etapas.length) {
                    let etapaAnterior = numEtapa > 0 ? aeronave.etapas[numEtapa - 1] : null;
                    aeronave.etapas[numEtapa].iniciar(etapaAnterior);
                    storage.salvarAeronave(aeronave);
                } else {
                    console.log("Etapa invalida!\n");
                }
            }
        } else {
            console.log("Aeronave nao encontrada!\n");
        }
        
    } else if (opcao === "10") {
        if (!temPermissao(NivelPermissao.OPERADOR)) continue;
        
        console.log("\n--- Finalizar Etapa ---");
        let codigoAeronave = readline.question("Codigo da aeronave: ");
        let aeronave = buscarAeronave(codigoAeronave);
        
        if (aeronave) {
            if (aeronave.etapas.length === 0) {
                console.log("Esta aeronave nao tem etapas cadastradas!\n");
            } else {
                console.log("Etapas disponiveis:");
                for (let i = 0; i < aeronave.etapas.length; i++) {
                    console.log((i + 1) + ". " + aeronave.etapas[i].getNome() + " [" + aeronave.etapas[i].getStatus() + "]");
                }
                let numEtapa = parseInt(readline.question("Numero da etapa: ")) - 1;
                
                if (numEtapa >= 0 && numEtapa < aeronave.etapas.length) {
                    aeronave.etapas[numEtapa].finalizar();
                    storage.salvarAeronave(aeronave);
                } else {
                    console.log("Etapa invalida!\n");
                }
            }
        } else {
            console.log("Aeronave nao encontrada!\n");
        }
        
    } else if (opcao === "11") {
        if (!temPermissao(NivelPermissao.ENGENHEIRO)) continue;
        
        console.log("\n--- Associar Funcionario a Etapa ---");
        let codigoAeronave = readline.question("Codigo da aeronave: ");
        let aeronave = buscarAeronave(codigoAeronave);
        
        if (aeronave) {
            if (aeronave.etapas.length === 0) {
                console.log("Esta aeronave nao tem etapas cadastradas!\n");
            } else {
                console.log("Etapas disponiveis:");
                for (let i = 0; i < aeronave.etapas.length; i++) {
                    console.log((i + 1) + ". " + aeronave.etapas[i].getNome());
                }
                let numEtapa = parseInt(readline.question("Numero da etapa: ")) - 1;
                
                if (numEtapa >= 0 && numEtapa < aeronave.etapas.length) {
                    let idFuncionario = readline.question("ID do funcionario: ");
                    let funcionario = null;
                    
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
        
    } else if (opcao === "12") {
        if (!estaLogado()) continue;
        
        console.log("\n--- Listar Funcionarios de Etapa ---");
        let codigoAeronave = readline.question("Codigo da aeronave: ");
        let aeronave = buscarAeronave(codigoAeronave);
        
        if (aeronave) {
            if (aeronave.etapas.length === 0) {
                console.log("Esta aeronave nao tem etapas cadastradas!\n");
            } else {
                console.log("Etapas disponiveis:");
                for (let i = 0; i < aeronave.etapas.length; i++) {
                    console.log((i + 1) + ". " + aeronave.etapas[i].getNome());
                }
                let numEtapa = parseInt(readline.question("Numero da etapa: ")) - 1;
                
                if (numEtapa >= 0 && numEtapa < aeronave.etapas.length) {
                    aeronave.etapas[numEtapa].listarFuncionarios();
                    console.log("");
                } else {
                    console.log("Etapa invalida!\n");
                }
            }
        } else {
            console.log("Aeronave nao encontrada!\n");
        }
        
    } else if (opcao === "13") {
        if (!temPermissao(NivelPermissao.ENGENHEIRO)) continue;
        
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
        
    } else if (opcao === "14") {
        if (!temPermissao(NivelPermissao.ADMINISTRADOR)) continue;
        
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
        
    } else if (opcao === "15") {
        console.log("Saindo...");
        rodando = false;
        
    } else {
        console.log("Opcao invalida!\n");
    }
}

console.log("Adeus!");
