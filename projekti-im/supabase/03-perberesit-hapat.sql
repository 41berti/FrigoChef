-- 1) Kolonat e reja. Rreshtat ekzistues marrin lista bosh.
alter table recetat
  add column perberesit text[] not null default '{}',
  add column hapat text[] not null default '{}',
  add column foto_url text;

-- 2) Recetat "1"–"5": përbërësit dhe hapat nga src/data/artikujt.ts.
update recetat set
  perberesit = array['vezë', 'qumësht', 'speca', 'domate', 'qepë', 'djathë i bardhë'],
  hapat = array[
    'Rrihni vezët me pak qumësht.',
    'Skuqni lehtë qepën, specat dhe domatet.',
    'Hidhni vezët sipër.',
    'Shtoni djathin e thërrmuar derisa omëleta të piqet.']
where id = '1';

update recetat set
  perberesit = array['speca', 'domate', 'gjizë', 'gjalpë', 'qepë', 'hudhër'],
  hapat = array[
    'Kaurdisni qepën dhe hudhrën në gjalpë.',
    'Shtoni specat dhe domatet e prera.',
    'Lërini të ziejnë 15 minuta.',
    'Pastaj përzieni gjizën derisa salca të trashet.']
where id = '2';

update recetat set
  perberesit = array['mish pule', 'kos', 'vezë', 'gjalpë', 'miell', 'oriz'],
  hapat = array[
    'Skuqni pulën në gjalpë.',
    'Vendoseni në tavë mbi pak oriz.',
    'Rrihni kosin me vezët dhe miellin.',
    'Hidheni sipër.',
    'Piqeni në furrë rreth 40 minuta.']
where id = '3';

update recetat set
  perberesit = array['domate', 'kastravec', 'qepë', 'djathë i bardhë', 'ullinj', 'vaj ulliri'],
  hapat = array[
    'Prisni domatet, kastravecin dhe qepën.',
    'Shtoni ullinjtë dhe djathin e thërrmuar.',
    'Pastaj hidhni kripë dhe vaj ulliri sipër.']
where id = '4';

update recetat set
  perberesit = array['oriz i mbetur', 'vezë', 'karotë', 'bizele', 'qepë e njomë', 'vaj'],
  hapat = array[
    'Skuqni karotën dhe bizelet në vaj.',
    'Shtoni orizin e ftohtë.',
    'Thyeni vezët në mes të tiganit.',
    'Përzieni të gjitha.',
    'Në fund hidhni qepën e njomë.']
where id = '5';

-- 3) Recetat e tjera të artikujt.ts.
insert into recetat (id, titulli, koha_minuta, perberesit, hapat) values
  ('6', 'Supë pule me limon', 35,
   array['mish pule', 'oriz', 'karotë', 'qepë', 'vezë', 'limon'],
   array[
     'Zieni pulën me karotën dhe qepën.',
     'Shtoni orizin.',
     'Pastaj rrihni vezën me lëng limoni.',
     'Përzieni me pak lëng supe.',
     'Hidheni në tenxhere duke e trazuar.']),
  ('7', 'Kungulleshka me salcë kosi', 25,
   array['kungull i njomë', 'vezë', 'miell', 'kos', 'hudhër', 'vaj'],
   array[
     'Prisni kungullin në rrathë.',
     'Kalojeni në miell dhe vezë.',
     'Skuqeni në vaj të nxehtë.',
     'Shërbejeni me kos të përzier me hudhër të grirë.']),
  ('8', 'Pulë me perime në furrë', 45,
   array['mish pule', 'speca', 'karotë', 'qepë', 'hudhër', 'vaj ulliri'],
   array[
     'Prisni pulën dhe perimet në copa.',
     'Përzieni me vaj ulliri, kripë dhe piper.',
     'Shtrojini në tavë.',
     'Piqini në 200°C rreth 40 minuta.']);

-- 4) Policy e shtimit: tani kontrollon edhe përbërësit dhe hapat.
alter policy "shtim publik" on recetat
  with check (
    char_length(titulli) between 1 and 100
    and koha_minuta between 1 and 600
    and cardinality(perberesit) between 1 and 20
    and cardinality(hapat) <= 30
  );
