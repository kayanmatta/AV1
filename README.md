## Passos para rodar o projeto após dar o git clone

```bash
npm install
npm run build
npm start
```

## Funcionalidades

- Cadastro de aeronaves, peças, etapas, funcionários e testes
- Controle de permissões (ADMINISTRADOR, ENGENHEIRO, OPERADOR)
- Validação de ordem lógica das etapas
- Persistência de dados em JSON
- Geração de relatórios

## Primeiro Acesso

1. Execute o sistema: `npm start`
2. Cadastre o primeiro funcionário (Opção 3) - pode ser sem login
3. Faça login (Opção 4)
4. Use o menu para gerenciar aeronaves

## Menu

| Opção | Funcionalidade | Permissão |
|-------|---------------|-----------|
| 1 | Cadastrar Aeronave | ADMIN 
| 2 | Listar Aeronaves | Livre 
| 3 | Cadastrar Funcionario | ADMIN 
| 4 | Login | Livre 
| 5 | Logout | Livre 
| 6 | Adicionar Peça | ENGENHEIRO/ADMIN 
| 7 | Adicionar Etapa | ENGENHEIRO/ADMIN 
| 8 | Atualizar Status de Peça | OPERADOR+ 
| 9 | Iniciar Etapa | OPERADOR+
| 10 | Finalizar Etapa | OPERADOR+ 
| 11 | Associar Funcionario a Etapa | ENGENHEIRO/ADMIN 
| 12 | Listar Funcionarios de Etapa | Logado 
| 13 | Executar Teste | ENGENHEIRO/ADMIN 
| 14 | Gerar Relatorio | ADMIN 
| 15 | Sair | Livre 
