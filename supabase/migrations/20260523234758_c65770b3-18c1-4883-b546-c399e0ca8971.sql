
-- content_pieces: estado real de cada pieza generada
create table public.content_pieces (
  id uuid primary key default gen_random_uuid(),
  semana_id text not null,
  dia text not null,
  canal text not null,
  formato text not null,
  status text not null default 'pending',
  titulo text,
  copy text,
  hashtags text[],
  cta text,
  media_url text,
  voiceover_url text,
  insight_base text,
  scheduled_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.content_pieces enable row level security;

-- Fase sin auth: acceso abierto. Se cerrará cuando agreguemos login.
create policy "open read content_pieces" on public.content_pieces for select using (true);
create policy "open write content_pieces" on public.content_pieces for all using (true) with check (true);

-- founder_notes: notas de voz transcritas (input al memory feed)
create table public.founder_notes (
  id uuid primary key default gen_random_uuid(),
  audio_url text not null,
  transcript text not null,
  duration_ms integer,
  created_at timestamptz not null default now()
);

alter table public.founder_notes enable row level security;
create policy "open read founder_notes" on public.founder_notes for select using (true);
create policy "open write founder_notes" on public.founder_notes for all using (true) with check (true);

-- Trigger updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create trigger content_pieces_touch before update on public.content_pieces
for each row execute function public.touch_updated_at();

-- Storage bucket público para assets generados (imágenes, voiceovers, notas)
insert into storage.buckets (id, name, public) values ('content-assets', 'content-assets', true);

create policy "public read content-assets" on storage.objects for select
  using (bucket_id = 'content-assets');
create policy "open write content-assets" on storage.objects for insert
  with check (bucket_id = 'content-assets');
create policy "open update content-assets" on storage.objects for update
  using (bucket_id = 'content-assets');
