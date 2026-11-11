-- Lejon fshirjen e recetave të shtuara nga përdoruesit.
-- Recetat bazë "1"–"8" nuk fshihen.
grant delete on table recetat to anon;

create policy "fshirje publike" on recetat
  for delete to anon
  using (id not in ('1', '2', '3', '4', '5', '6', '7', '8'));
