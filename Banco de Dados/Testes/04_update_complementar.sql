-- Exemplo complementar de DML: UPDATE.
-- Altera somente a observacao da consulta de ID 1.

UPDATE public.consulta
SET observacoes = 'Atualizacao demonstrativa via comando UPDATE em 24/11/2026'
WHERE id_consulta = 1
RETURNING id_consulta, status, observacoes, valor;
