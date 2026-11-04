# Progres · FrigoChef · Java 5

## Çka punon
- **M0, `AGENTS.md`:** seksioni "Projekti" te `projekti-im/AGENTS.md` tregon çka është FrigoChef, për kë është, problemin nga bisedat dhe ekranet kryesore. ([PR #10](https://github.com/41berti/FrigoChef/pull/10))
- **M1, lista nga Supabase:** Ballina liston recetat nga tabela `recetat`. ([PR #10](https://github.com/41berti/FrigoChef/pull/10))
- **M2, shtimi nga telefoni:** forma poshtë Ballinës shton një recetë. Ajo ruhet në Supabase dhe mbetet pas rihapjes së aplikacionit. ([PR #12](https://github.com/41berti/FrigoChef/pull/12))

M1 dhe M2 i testoi Alberti në telefon, në iPhone 14 Pro. Testi i Arianitit në telefonin e vet është ende i hapur ([#9](https://github.com/41berti/FrigoChef/issues/9)).

## Çka bëri agjenti
- **SQL-ja:** i ruajti `recetat.sql` dhe `02-shto-recete.sql` te `projekti-im/supabase/` dhe i ekzekutoi në Supabase.
- **Klienti i Supabase-it:** `projekti-im/src/data/supabase.ts`, me paketën `@supabase/supabase-js`.
- **Forma:** `projekti-im/src/components/FormaRecete.tsx`, me validim dhe gabimet në ekran.
- **Rregullimi responsive:** e zhvendosi formën jashtë listës, poshtë ekranit, sepse në iPhone fushat nuk pranonin shkrim. Tani forma ngrihet mbi tastierë dhe përshtatet me madhësinë e ekranit.

## Çka bëmë ne
- **Projekti Supabase:** e krijuam projektin dhe `projekti-im/.env`, që s'bëhet commit.
- **Vendimet për RLS:** `anon` mund të lexojë dhe të shtojë, por shtimi lejohet vetëm me titull 1–100 shkronja dhe kohë 1–600 minuta.
- **Vendimi për renditjen:** recetat më të reja në krye, pastaj sipas titullit.
- **Testi në telefon:** gjetëm që fushat s'pranonin shkrim në iPhone, dhe e provuam prapë pas rregullimit.
- **Rishikimi dhe merge-i:** PR-të #10 dhe #12 i bashkoi Alberti me squash merge.

## Hapi tjetër
- **M3:** Ballina "Çka ke në frigorifer?" me të dhëna reale.
- **Ekrani i detajeve:** të lexojë nga Supabase.

## Kufizimet e njohura
- **Detajet s'hapin recetat e reja:** ekrani i detajeve lexon `projekti-im/src/data/artikujt.ts`, prandaj receta e re tregon "nuk u gjet".
- **Shtimi pa login:** kushdo që ka çelësin publik mund të shtojë receta, brenda kufijve të RLS-së.

## Tabela `recetat`
| Kolona | Çka ruan |
|---|---|
| `id` | Çelësi i rreshtit, si tekst. Recetat e para kanë "1"–"5", ndërsa të rejat marrin një UUID nga Supabase. |
| `titulli` | Titullin e recetës. |
| `koha_minuta` | Kohën e gatimit në minuta, si numër të plotë. |
| `krijuar_me` | Kohën kur u shtua rreshti. E vendos Supabase, dhe lista rendit sipas saj. |
