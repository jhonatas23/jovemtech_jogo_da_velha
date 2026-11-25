-- Aula 4: DDL / ALTER TABLE.
-- O atributo motivo existe no diagrama conceitual de Consulta.
-- Adiciona a coluna opcional sem apagar os registros atuais.

ALTER TABLE public.consulta
ADD COLUMN IF NOT EXISTS motivo VARCHAR(255);

-- Conferencia da coluna acrescentada:
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'consulta'
  AND column_name = 'motivo';
