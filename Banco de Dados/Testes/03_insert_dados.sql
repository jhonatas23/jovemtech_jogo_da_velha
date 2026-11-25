-- Dados ficticios de demonstracao para o Sistema de Agendamento de Clinica.
-- Execute depois de 01_criacao_tabelas.sql e 02_alter_table_motivo.sql.
-- ON CONFLICT DO NOTHING evita duplicar registros existentes.

BEGIN;

INSERT INTO public.clinica
(id_clinica, cnpj, razao_social, nome_fantasia, cnes, telefone, email, endereco)
VALUES
(1, '00000000000100', 'Clinica Exemplo LTDA', 'Clinica Centro', '0000001', '(79) 3000-0001', 'contato1@exemplo.invalid', 'Rua de Exemplo, 100'),
(2, '00000000000200', 'Clinica Modelo LTDA', 'Clinica Norte', '0000002', '(79) 3000-0002', 'contato2@exemplo.invalid', 'Av. Modelo, 200')
ON CONFLICT DO NOTHING;

INSERT INTO public.paciente
(id_paciente, cpf, nome, dt_nascimento, telefone, email, endereco, sexo)
VALUES
(1, '00000000001', 'Paciente Demonstracao 01', '1995-04-12', '(79) 90000-0001', 'paciente01@exemplo.invalid', 'Endereco ficticio 01', 'Nao informado'),
(2, '00000000002', 'Paciente Demonstracao 02', '1988-09-23', '(79) 90000-0002', 'paciente02@exemplo.invalid', 'Endereco ficticio 02', 'Nao informado'),
(3, '00000000003', 'Paciente Demonstracao 03', '2001-01-30', '(79) 90000-0003', 'paciente03@exemplo.invalid', 'Endereco ficticio 03', 'Nao informado')
ON CONFLICT DO NOTHING;

INSERT INTO public.medico
(id_medico, cpf, crm, nome, telefone, email, dt_nascimento)
VALUES
(1, '11111111111', 'CRM-SE-0001', 'Medico Demonstracao 01', '(79) 98800-0001', 'medico01@exemplo.invalid', '1980-02-15'),
(2, '22222222222', 'CRM-SE-0002', 'Medico Demonstracao 02', '(79) 98800-0002', 'medico02@exemplo.invalid', '1975-07-08'),
(3, '33333333333', 'CRM-SE-0003', 'Medico Demonstracao 03', '(79) 98800-0003', 'medico03@exemplo.invalid', '1987-11-19')
ON CONFLICT DO NOTHING;

INSERT INTO public.especialidade (id_especialidade, nome, descricao)
VALUES
(1, 'Cardiologia', 'Especialidade de demonstracao'),
(2, 'Dermatologia', 'Especialidade de demonstracao'),
(3, 'Pediatria', 'Especialidade de demonstracao'),
(4, 'Clinica Geral', 'Especialidade de demonstracao')
ON CONFLICT DO NOTHING;

INSERT INTO public.medico_especialidade (id_medico, id_especialidade)
VALUES (1,1), (1,4), (2,2), (3,3)
ON CONFLICT DO NOTHING;

INSERT INTO public.consulta
(id_consulta, id_clinica, id_paciente, id_medico, data_consulta, hora_consulta, status, observacoes, valor)
VALUES
(1,1,1,1,'2026-12-01','09:00:00','agendada','Atualizacao demonstrativa via comando UPDATE em 24/11/2026',250.00),
(2,1,2,2,'2026-12-01','10:00:00','confirmada','Consulta ficticia para demonstracao',220.00),
(3,2,3,3,'2026-12-02','14:30:00','agendada','Consulta ficticia para demonstracao',200.00)
ON CONFLICT DO NOTHING;

INSERT INTO public.contrato
(id_contrato, id_medico, id_clinica, numero_contrato, data_inicio, data_fim, valor, tipo_contrato, status, observacoes)
VALUES
(1,1,1,'CONT-DEMO-001','2026-01-01',NULL,8000.00,'Mensal','ativo','Registro ficticio para demonstracao'),
(2,2,1,'CONT-DEMO-002','2026-02-01',NULL,7500.00,'Mensal','ativo','Registro ficticio para demonstracao'),
(3,3,2,'CONT-DEMO-003','2026-03-01',NULL,7000.00,'Mensal','ativo','Registro ficticio para demonstracao')
ON CONFLICT DO NOTHING;

SELECT setval(pg_get_serial_sequence('public.clinica', 'id_clinica'), COALESCE((SELECT MAX(id_clinica) FROM public.clinica), 1));
SELECT setval(pg_get_serial_sequence('public.paciente', 'id_paciente'), COALESCE((SELECT MAX(id_paciente) FROM public.paciente), 1));
SELECT setval(pg_get_serial_sequence('public.medico', 'id_medico'), COALESCE((SELECT MAX(id_medico) FROM public.medico), 1));
SELECT setval(pg_get_serial_sequence('public.especialidade', 'id_especialidade'), COALESCE((SELECT MAX(id_especialidade) FROM public.especialidade), 1));
SELECT setval(pg_get_serial_sequence('public.consulta', 'id_consulta'), COALESCE((SELECT MAX(id_consulta) FROM public.consulta), 1));
SELECT setval(pg_get_serial_sequence('public.contrato', 'id_contrato'), COALESCE((SELECT MAX(id_contrato) FROM public.contrato), 1));

COMMIT;

SELECT 'clinica' AS tabela, COUNT(*) AS registros FROM public.clinica
UNION ALL SELECT 'paciente', COUNT(*) FROM public.paciente
UNION ALL SELECT 'medico', COUNT(*) FROM public.medico
UNION ALL SELECT 'especialidade', COUNT(*) FROM public.especialidade
UNION ALL SELECT 'medico_especialidade', COUNT(*) FROM public.medico_especialidade
UNION ALL SELECT 'consulta', COUNT(*) FROM public.consulta
UNION ALL SELECT 'contrato', COUNT(*) FROM public.contrato
ORDER BY tabela;
