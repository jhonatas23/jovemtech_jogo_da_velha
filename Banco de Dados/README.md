# Banco de Dados — Sistema de Agendamento de Clínica

Projeto da squad para organizar o agendamento de consultas em clínicas, relacionando pacientes, médicos, especialidades, unidades de atendimento e contratos. A implementação utiliza Supabase com PostgreSQL 17.

## Objetivo e regras de negócio

O sistema registra clínicas, pacientes, médicos, especialidades, consultas e contratos. A regra de agendamento impede que o mesmo médico tenha duas consultas na mesma data e horário, por meio de `UNIQUE (id_medico, data_consulta, hora_consulta)`.

O relacionamento N:N entre médicos e especialidades é resolvido pela tabela intermediária `medico_especialidade`, com duas FKs e chave primária composta. A entidade `contrato` registra os vínculos entre médicos e clínicas ao longo do tempo.

## Diagrama conceitual revisado

O diagrama foi reconstruído para representar o modelo alinhado à implementação final: Paciente, em vez do nome inicial Cliente; Consulta com data e horário separados; Contrato como entidade própria; e o relacionamento N:N entre Médico e Especialidade.

![Diagrama conceitual revisado do sistema de agendamento](Diagrama%20Conceitual/diagrama_conceitual_revisado.svg)

## Estrutura

- **Diagrama Conceitual/** — diagrama conceitual revisado, em SVG.
- **Modelo Lógico/** — modelo relacional final, com tabelas, colunas, PKs e FKs.
- **Modelo Esquema no Supabase/** — esquema consultado no projeto Supabase.
- **Tabelas/** — script `CREATE TABLE` e constraints.
- **Testes/** — scripts `INSERT INTO` e `ALTER TABLE`; também há exemplos complementares de `UPDATE` e `SELECT`.
- **Dados/** — visualizações dos registros fictícios nas sete tabelas.

## Tabelas e registros conferidos

| Tabela | Registros | Função |
|---|---:|---|
| `clinica` | 2 | Unidades de atendimento |
| `paciente` | 3 | Pacientes |
| `medico` | 3 | Médicos |
| `especialidade` | 4 | Especialidades médicas |
| `medico_especialidade` | 4 | Associação N:N entre médicos e especialidades |
| `consulta` | 3 | Agendamentos |
| `contrato` | 3 | Vínculos contratuais entre médicos e clínicas |
| **Total** | **22** | Registros de demonstração |

Todos os dados são fictícios; os e-mails usam o domínio reservado `.invalid`.

## Constraints utilizadas

- `PRIMARY KEY` para identificar cada registro, incluindo chave composta em `medico_especialidade`.
- `FOREIGN KEY` para manter os relacionamentos entre as tabelas.
- `UNIQUE` para CPF, CNPJ, CRM, número de contrato e horário do mesmo médico.
- `NOT NULL` para campos obrigatórios.
- `DEFAULT` para valores iniciais de status.
- `CHECK` para estados permitidos, valores monetários não negativos e período de contrato válido.
- `ON DELETE RESTRICT` para proteger registros referenciados.

## Ordem de execução em um banco vazio

1. `Tabelas/01_criacao_tabelas.sql` — cria as sete tabelas e constraints.
2. `Testes/02_alter_table_motivo.sql` — acrescenta a coluna opcional `motivo VARCHAR(255)` à tabela `consulta`.
3. `Testes/03_insert_dados.sql` — insere os registros fictícios de demonstração.

Os arquivos `04_update_complementar.sql` e `05_consultas_verificacao.sql` são complementares. O banco publicado já possui os 22 registros; não execute o `CREATE TABLE` novamente nele.

## Correspondência entre o modelo conceitual e a implementação

O modelo conceitual revisado utiliza a entidade `Paciente`, correspondente à tabela `paciente`. A data e o horário da consulta são atributos separados (`data_consulta` e `hora_consulta`). O atributo opcional `motivo` é acrescentado à tabela `consulta` pelo script `ALTER TABLE`. A relação N:N entre Médico e Especialidade é implementada por `medico_especialidade`, com duas chaves estrangeiras e chave primária composta. O vínculo entre Clínica e Médico é representado pela entidade `Contrato`, que permite registrar contratos ao longo do tempo.

O modelo conceitual apresenta os conceitos e relacionamentos do domínio; o modelo lógico detalha as tabelas e a implementação relacional.

## Modelo público e exportação do BRModelo

- **BRModelo Web — modelo público da squad:** https://app.brmodeloweb.com/publicview/6b06d4ef1448006b56801a47

O código SQL exportado pelo BRModelo foi usado como referência para a modelagem, mas não é o script de criação executável da entrega. A exportação apresenta problemas como múltiplas declarações de chave primária por tabela, vírgulas finais, tipos `INT` aplicados a atributos textuais, datas e valores, além de não representar separadamente as tabelas `especialidade` e `medico_especialidade`. Por isso, a implementação relacional foi ajustada e normalizada no script `Tabelas/01_criacao_tabelas.sql`, com suas chaves e constraints, e está refletida no Supabase.

## Links

- **Supabase — painel do projeto:** https://supabase.com/dashboard/project/dbdmaapvokjiewsniruq
- **Supabase — URL pública do projeto/API:** https://dbdmaapvokjiewsniruq.supabase.co
- **BRModelo Web — modelo público:** https://app.brmodeloweb.com/publicview/6b06d4ef1448006b56801a47

O painel Supabase exige autenticação e permissão no projeto. O endpoint público não significa que as tabelas estejam abertas para leitura anônima: as tabelas permanecem protegidas por RLS.

## Conteúdo do Módulo 4 aplicado

O projeto reúne os conteúdos das seis aulas: modelagem conceitual e DER; entidades, atributos, relacionamentos e cardinalidade; modelo lógico, normalização, PK e tipos de dados; FKs e integridade referencial; DDL com `CREATE TABLE`, constraints e `ALTER TABLE`; e DML com `INSERT`, `SELECT`, filtros e `UPDATE`.
