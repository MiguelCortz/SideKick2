
CREATE TABLE public.usuario (
  id_numero_telefono VARCHAR(20) PRIMARY KEY,
  campo1 VARCHAR(50),
  campo2 VARCHAR(50),
  campo3 VARCHAR(50),
  campo4 VARCHAR(50),
  campo5 VARCHAR(50),
  campo6 VARCHAR(50),
  campo7 VARCHAR(50),
  campo8 VARCHAR(50),
  campo9 VARCHAR(50),
  campo10 VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.reuniones (
  id_reunion BIGSERIAL PRIMARY KEY,
  usuario_telefono VARCHAR(20) REFERENCES public.usuario(id_numero_telefono) ON DELETE CASCADE,
  medio_difusion VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reuniones_usuario ON public.reuniones(usuario_telefono);
CREATE INDEX idx_reuniones_medio ON public.reuniones(medio_difusion);

ALTER TABLE public.usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reuniones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read usuario" ON public.usuario FOR SELECT USING (true);
CREATE POLICY "Public insert usuario" ON public.usuario FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update usuario" ON public.usuario FOR UPDATE USING (true);

CREATE POLICY "Public read reuniones" ON public.reuniones FOR SELECT USING (true);
CREATE POLICY "Public insert reuniones" ON public.reuniones FOR INSERT WITH CHECK (true);
