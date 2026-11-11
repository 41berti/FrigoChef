## Projekti

FrigoChef i tregon studentit, brenda një minute, çka mund të gatuajë tani me përbërësit që ka në frigorifer. Është për studentin që jeton vetëm dhe gatuan vetë. Në MVP përbërësit zgjidhen me prekje; fotoja me AI vjen më vonë.

Problemi, nga 3 bisedat te `BISEDAT.md`: studenti ka ushqim në frigorifer, por nuk di çka të gatuajë me të, dhe një pjesë e ushqimit i prishet.

### Navigimi

`src/app/_layout.tsx` ka dy tab-e me `NativeTabs` nga `expo-router/native-tabs`. Secili tab është një dosje me `Stack`-un e vet.

- **Tab-i "Frigoriferi"** (`src/app/(frigoriferi)/`), rrjedha kryesore e `HARTA.md`:
  - `index.tsx` · Ballina "Çka ke në frigorifer?": chip-at e përbërësve, numëruesi dhe butoni "Shiko recetat".
  - `lista.tsx` · "Recetat për ty" (`/lista`): recetat nga Supabase, të renditura sipas përputhjes me përbërësit e zgjedhur.
- **Tab-i "Recetat"** (`src/app/(recetat)/`):
  - `recetat.tsx` · të gjitha recetat (`/recetat`).
  - `shto.tsx` · ekrani "Recetë e re" (`/shto`), me `FormaRecete`.
- **Detajet e recetës** (`src/app/(frigoriferi,recetat)/artikull/[id].tsx`): dosja me dy emra e vendos ekranin në të dy tab-et. Tregon përbërësit (ke / mungon) dhe hapat me numra.

### Të dhënat

- **Supabase, tabela `recetat`:** `id`, `titulli`, `koha_minuta`, `perberesit text[]`, `hapat text[]`, `foto_url`, `krijuar_me`. SQL-ja është te `supabase/`. Çdo ndryshim i skemës i tregohet Albertit dhe pret "po".
- **RLS për `anon`:** lexon të gjitha recetat, shton vetëm me 1–20 përbërës dhe më së shumti 30 hapa, dhe fshin vetëm recetat që s'janë bazë ("1"–"8"). Ende s'ka login.
- `src/data/recetat.ts`: `merrRecetat()`, `merrReceten(id)`, `shtoReceten()` dhe `fshiReceten(id)`. Ekranet nuk e thërrasin `supabase` drejt.
- `src/data/perputhja.ts`: i ndan përbërësit në "ke" dhe "mungon" dhe i rendit recetat.
- `src/data/perberesit.ts`: grupet e chip-ave te Ballina.
- `src/gjendja/zgjedhja.tsx`: përbërësit e zgjedhur, në një Context. Ruhen vetëm në memorie.
- `src/data/artikujt.ts`: të dhënat e vjetra lokale. Mbetet në repo, por ekranet nuk e përdorin më.

### Pamja

- `src/tema/tema.ts`: ngjyrat (light dhe dark), shkronjat, hapësirat dhe rrezet, nga skicat te `docs/skica/`. Mos shkruaj ngjyra apo madhësi drejt në ekrane: përdor `useNgjyrat()` dhe komponentin `Teksti`.
- Komponentët e përbashkët janë te `src/components/`: `Teksti`, `Butoni`, `Fusha`, `Chip`, `Etiketa`, `Ikona`, `Kartela`, `KartelaRecete`, `RreshtPerberesi`, `Hapi`, `VendiIFotos`.
- `src/veglat/dridhja.ts`: dridhjet me `expo-haptics`.
- `src/components/DemoGjendja.tsx` është punë e ligjëratës. Mos e fshi dhe mos e ndrysho.

## Expo mobile app

This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
