import * as fs from 'fs';
import { Aeronave } from '../models/aeronave';
import { Funcionario } from '../models/funcionario';

export class Storage {

    salvarAeronave(aeronave: Aeronave): void {
        const nomeArquivo = 'data/aeronave_' + aeronave.codigo + '.json';
        const dados = JSON.stringify(aeronave);
        fs.writeFileSync(nomeArquivo, dados, 'utf-8');
        console.log('Aeronave salva!');
    }

    carregarAeronaves(): Array<Aeronave> {
        const aeronaves: Array<Aeronave> = [];
        
        // Cria pasta se não existir
        if (!fs.existsSync('data/')) {
            fs.mkdirSync('data/');
        }

        const arquivos = fs.readdirSync('data/');
        
        for (let i = 0; i < arquivos.length; i++) {
            const nomeArquivo = arquivos[i];
            
            if (nomeArquivo.startsWith('aeronave_') && nomeArquivo.endsWith('.json')) {
                const conteudo = fs.readFileSync('data/' + nomeArquivo, 'utf-8');
                const aeronave = JSON.parse(conteudo);
                aeronaves.push(aeronave);
            }
        }
        
        return aeronaves;
    }

    salvarFuncionario(funcionario: Funcionario): void {
        const nomeArquivo = 'data/funcionario_' + funcionario.id + '.json';
        const dados = JSON.stringify(funcionario);
        fs.writeFileSync(nomeArquivo, dados, 'utf-8');
        console.log('Funcionário salvo!');
    }

    carregarFuncionarios(): Array<Funcionario> {
        const funcionarios: Array<Funcionario> = [];
        
        if (!fs.existsSync('data/')) {
            fs.mkdirSync('data/');
        }

        const arquivos = fs.readdirSync('data/');
        
        for (let i = 0; i < arquivos.length; i++) {
            const nomeArquivo = arquivos[i];
            
            if (nomeArquivo.startsWith('funcionario_') && nomeArquivo.endsWith('.json')) {
                const conteudo = fs.readFileSync('data/' + nomeArquivo, 'utf-8');
                const funcionario = JSON.parse(conteudo);
                funcionarios.push(funcionario);
            }
        }
        
        return funcionarios;
    }
}
