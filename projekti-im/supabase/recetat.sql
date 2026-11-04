create table recetat (
  id text primary key,
  titulli text not null,
  koha_minuta int not null
);

insert into recetat (id, titulli, koha_minuta) values
  ('1', 'Omëletë me perime', 15),
  ('2', 'Fërgesë me speca dhe gjizë', 30),
  ('3', 'Tavë kosi me pulë', 60),
  ('4', 'Sallatë me djathë', 10),
  ('5', 'Oriz i skuqur me perime dhe vezë', 20);

alter table recetat enable row level security;

grant select on table recetat to anon;

create policy "lexim publik" on recetat
  for select to anon using (true);
