-- Issue #22. REVIEW ONLY: apply only after Albert explicitly approves this SQL.
-- Inspected live on 2026-11-17: 14 recipes; no owner column; three anon policies.
begin;

-- No default in ADD COLUMN: existing rows stay unowned, including base recipes.
alter table public.recetat
  add column pronari_id uuid references auth.users(id) on delete set null;
alter table public.recetat alter column pronari_id set default auth.uid();
create index recetat_pronari_id_idx on public.recetat (pronari_id);

alter table public.recetat enable row level security;
drop policy "shtim publik" on public.recetat;
drop policy "fshirje publike" on public.recetat;
alter policy "lexim publik" on public.recetat to anon, authenticated using (true);

-- Remove broad default grants (including TRUNCATE, which RLS does not protect).
-- Recipe editing is outside this issue: neither client role receives UPDATE.
revoke all on table public.recetat from anon, authenticated;
grant select on table public.recetat to anon, authenticated;
grant insert, delete on table public.recetat to authenticated;

create policy "shtim nga pronari" on public.recetat
  for insert to authenticated
  with check (
    (select auth.uid()) = pronari_id
    and id not in ('1', '2', '3', '4', '5', '6', '7', '8')
    and char_length(titulli) between 1 and 100
    and koha_minuta between 1 and 600
    and cardinality(perberesit) between 1 and 20
    and cardinality(hapat) <= 30
  );

create policy "fshirje nga pronari" on public.recetat
  for delete to authenticated
  using (
    (select auth.uid()) = pronari_id
    and id not in ('1', '2', '3', '4', '5', '6', '7', '8')
  );

commit;
