# Progres · FrigoChef · Java 5

## Çka punon
- **M0, `AGENTS.md`:** seksioni "Projekti" te `projekti-im/AGENTS.md` tregon çka është FrigoChef, për kë është, problemin nga bisedat dhe ekranet kryesore. ([PR #10](https://github.com/41berti/FrigoChef/pull/10))
- **M1, lista nga Supabase:** Ballina liston recetat nga tabela `recetat`. ([PR #10](https://github.com/41berti/FrigoChef/pull/10))
- **M2, shtimi nga telefoni:** forma poshtë Ballinës shton një recetë. Ajo ruhet në Supabase dhe mbetet pas rihapjes së aplikacionit. ([PR #12](https://github.com/41berti/FrigoChef/pull/12))

M1 dhe M2 i testoi Alberti në telefon, në iPhone 14 Pro. Arianiti e testoi M1 në telefonin e vet, në Expo Go: Ballina liston të njëjtat receta si te Alberti ([#9](https://github.com/41berti/FrigoChef/issues/9)).

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

---

# Progres · FrigoChef · Java 6

## Çka punon
- **Tema dhe tab-et:** ngjyrat, shkronjat dhe hapësirat vijnë nga `projekti-im/src/tema/tema.ts`, në light dhe dark mode. Navigimi ka dy tab-e, "Frigoriferi" dhe "Recetat". ([#16](https://github.com/41berti/FrigoChef/issues/16), [PR #19](https://github.com/41berti/FrigoChef/pull/19))
- **Të dhëna reale:** tabela `recetat` ka përbërësit dhe hapat. Detajet lexojnë nga Supabase, dhe forma e shtimit ka fushat e përbërësve dhe të hapave. ([#17](https://github.com/41berti/FrigoChef/issues/17), [PR #25](https://github.com/41berti/FrigoChef/pull/25))
- **M3, rrjedha kryesore me të dhëna reale:** te Ballina "Çka ke në frigorifer?" zgjidhen përbërësit me prekje, lista i rendit recetat nga Supabase sipas përputhjes, dhe detajet tregojnë çka ke dhe çka mungon. ([#18](https://github.com/41berti/FrigoChef/issues/18))

PR #19 dhe PR #25 i testoi Alberti në iPhone, në Expo Go. Testi i M3 në telefon shënohet te PR-ja e issue-s #18.

## Çka bëri agjenti
- **ESLint dhe tema:** e konfiguroi ESLint-in me `npx expo lint` dhe e shkroi temën dhe komponentët e përbashkët (`Teksti`, `Butoni`, `Fusha`, `Chip`, `KartelaRecete`).
- **Tab-et:** `NativeTabs` nga `expo-router/native-tabs`, me nga një `Stack` për secilin tab.
- **SQL-ja:** e ruajti `03-perberesit-hapat.sql` te `projekti-im/supabase/` dhe e ekzekutoi në Supabase, pasi Alberti e aprovoi.
- **Ekranet:** Ballina me chip-a, lista me përputhje dhe detajet me hapa me numra.
- **Përputhja:** `projekti-im/src/data/perputhja.ts` i ndan përbërësit në "ke" dhe "mungon" dhe i rendit recetat.
- **Dridhjet:** `expo-haptics` te prekja e chip-it dhe te ruajtja e recetës.

## Çka bëmë ne
- **Vendimi për navigimin:** dy tab-e, "Frigoriferi" për rrjedhën e skicave dhe "Recetat" për të gjitha recetat dhe shtimin.
- **Vendimi për të dhënat:** të dhëna reale në Supabase në vend të të dhënave lokale, me kolonat `perberesit`, `hapat` dhe `foto_url`.
- **Vendimet për RLS:** shtimi lejohet vetëm me 1–20 përbërës dhe më së shumti 30 hapa. SQL-në e aprovoi Alberti para ekzekutimit.
- **Vendimet për ekranet:** "+ tjetër" shton një përbërës vetëm në zgjedhje, pa e ruajtur në databazë. Pa zgjedhje, detajet i tregojnë përbërësit pa shenja.
- **Përditësimi i Expo-s:** Alberti e përditësoi Expo-n në 58.0.24.
- **Testi në telefon:** Alberti i provoi PR #19 dhe PR #25 në iPhone, në Expo Go.
- **Rishikimi dhe merge-i:** PR-të #19 dhe #25 i bashkoi Alberti me squash merge.

## Hapi tjetër
- **Fshirja e recetave:** [#26](https://github.com/41berti/FrigoChef/issues/26).
- **Logoja dhe cilësimet:** [#20](https://github.com/41berti/FrigoChef/issues/20) dhe [#21](https://github.com/41berti/FrigoChef/issues/21).
- **Login-i:** [#22](https://github.com/41berti/FrigoChef/issues/22), pasi të shihet nëse e mbulojnë ligjëratat.

## Kufizimet e njohura
- **Zgjedhja nuk ruhet:** përbërësit e zgjedhur humbin kur aplikacioni mbyllet plotësisht.
- **Chip-at janë listë fikse:** përbërësit te Ballina janë te `projekti-im/src/data/perberesit.ts`. Përbërësit e tjerë të recetave, si ullinjtë dhe vaji i ullirit, zgjidhen vetëm me "+ tjetër".
- **Recetat pa përbërës:** recetat e shtuara para Javës 6 kanë lista bosh, prandaj nuk dalin te lista me përputhje.
- **Pa foto:** `foto_url` është bosh, dhe në vend të fotos del një ikonë.
- **Shtimi pa login:** kushdo që ka çelësin publik mund të shtojë receta, brenda kufijve të RLS-së.

## Tabela `recetat`
| Kolona | Çka ruan |
|---|---|
| `id` | Çelësi i rreshtit, si tekst. Recetat bazë kanë "1"–"8", ndërsa të rejat marrin një UUID nga Supabase. |
| `titulli` | Titullin e recetës. |
| `koha_minuta` | Kohën e gatimit në minuta, si numër të plotë. |
| `perberesit` | Listën e përbërësve (`text[]`), me shkronja të vogla. Përputhja me zgjedhjen bëhet mbi këtë kolonë. |
| `hapat` | Listën e hapave (`text[]`), me radhë. Mund të jetë bosh. |
| `foto_url` | Adresën e fotos. Ende nuk përdoret, prandaj është bosh. |
| `krijuar_me` | Kohën kur u shtua rreshti. E vendos Supabase, dhe lista rendit sipas saj. |
