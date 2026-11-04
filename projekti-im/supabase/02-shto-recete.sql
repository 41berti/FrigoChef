alter table recetat alter column id set default gen_random_uuid()::text;

alter table recetat add column krijuar_me timestamptz not null default now();

grant insert on table recetat to anon;

create policy "shtim publik" on recetat for insert to anon with check (char_length(titulli) between 1 and 100 and koha_minuta between 1 and 600);
