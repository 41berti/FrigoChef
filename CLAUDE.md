# CLAUDE.md · FrigoChef

Këto rregulla vlejnë për zhvillimin e FrigoChef.

## Projekti

- Aplikacioni: Expo Router + TypeScript (Expo SDK 58) në `projekti-im/`. Para se të prekësh kodin, lexo `projekti-im/AGENTS.md`.
- Komandat `npx` dhe `npm` ekzekutohen brenda `projekti-im/`.
- Në rrënjë janë fajllat e vlerësuar: `EKIPI.md`, `BISEDAT.md`, `HARTA.md`, `PITCH.md` dhe `docs/skica/`.
- Alberti (@41berti) është pronari i vetëm. Alberti dhe ChatGPT përcaktojnë kërkesat, arkitekturën dhe kriteret e pranimit. Codex implementon, teston, dokumenton dhe përgatit PR-në. Vetëm Alberti aprovon dhe bën squash merge.
- Udhëzuesi hap pas hapi është te `CONTRIBUTING.md`. Rishikimi me AI është te `docs/AI-REVIEW.md`.

## Arkitektura

- `main` është e vetmja degë e përhershme. Është e mbrojtur.
- Për çdo issue krijohet një degë e përkohshme nga `main`, sipas issue-s. Korrigjimet gjatë rishikimit bëhen në degën dhe PR-në ekzistuese.
- Askush nuk ka degë të përhershme.

## Rrjedha

```text
issue → degë nga main → commit-e → push → PR te main me "Closes #N"
      → rishikimi i Albertit → squash merge nga Alberti → dega fshihet automatikisht
```

Edhe Alberti punon me degë dhe PR, dhe i bashkon vetë pa aprovim. Këtë e bën Alberti, jo Claude.

## Rregullat

- Mos bëj kurrë push direkt te `main`, force-push, rishkrim të historisë apo merge të PR-ve.
- Puno vetëm në degën e issue-s dhe vetëm me fajllat që lidhen me të. Nëse për punën s'ka issue, pyet.
- Mos instalo paketa dhe mos ndrysho `package.json` pa e lejuar issue-ja.
- Shpjego vendimet me shembuj nga kodi dhe shëno çka është testuar. Ruaj dokumentet historike të kursit.

## Siguria

- `.env` nuk bëhet kurrë commit.
- Çelësi `service_role` nuk vendoset kurrë në kod.

## Dorëzimi dhe testimi lokal

- Lexo degën aktuale dhe gjendjen e Git-it. Jep komandat për terminalin e Albertit me dosjen e saktë, fetch, switch, pull --ff-only, instalimin kur ndryshojnë varësitë dhe nisjen e Expo. Ruaj ndryshimet lokale.
- Për çdo detyrë jep një listë testesh për pajisjen dhe shpjego si kalohet te main pas merge-it. Raporti përfshin shkakun, rrjedhën, funksionet me fajlla e rreshta, vendimet, sigurinë, rastet kufitare, rezultatet e testeve dhe statusin e PR-së.
- Codex inspekton skemën, policy-t, varësitë dhe rrezikun për të dhënat, versionon SQL-në, e zbaton përmes mjeteve të autorizuara dhe verifikon e dokumenton rezultatin. Kërko aprovim për veprime shkatërruese, të pakthyeshme ose me rrezik të lartë në prodhim.
