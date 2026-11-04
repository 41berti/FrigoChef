# CLAUDE.md · FrigoChef

Këto rregulla vlejnë për çdo sesion të Claude Code-it në këtë repo, te Alberti dhe te Arianiti.

## Projekti

- Aplikacioni: Expo Router + TypeScript (Expo SDK 58) në `projekti-im/`. Para se të prekësh kodin, lexo `projekti-im/AGENTS.md`.
- Komandat `npx` dhe `npm` ekzekutohen brenda `projekti-im/`.
- Në rrënjë janë fajllat e vlerësuar: `EKIPI.md`, `BISEDAT.md`, `HARTA.md`, `PITCH.md` dhe `docs/skica/`.
- Ekipi: @41berti (pronari, i vetmi që aprovon dhe bën merge) dhe @Arianitxhafa (collaborator).
- Udhëzuesi hap pas hapi është te `CONTRIBUTING.md`. Rishikimi me AI është te `docs/AI-REVIEW.md`.

## Arkitektura

- `main` është e vetmja degë e përhershme. Ndjek ligjëratat dhe detyrat e profesorit dhe është e mbrojtur.
- Për çdo issue krijohet një degë e përkohshme nga `main`, me emrin `java<N>/<pershkrim-i-shkurter>`, p.sh. `java5/supabase-setup`.
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
- Shpjegoje kodin shkurt në shqip, sepse çdo javë kemi check-off ku e shpjegojmë punën me fjalët tona.

## Siguria

- `.env` nuk bëhet kurrë commit.
- Çelësi `service_role` nuk vendoset kurrë në kod.

## Procedura javore

Kur Alberti ngjit detyrën e javës:

a) Lexo detyrën dhe ndaje në issue të vogla, të qarta, me shabllonin `.github/ISSUE_TEMPLATE/detyre.md`.

b) Krijo milestone "Java N", me afatin e detyrës.

c) Ndaji detyrat në mënyrë të barabartë mes @41berti dhe @Arianitxhafa, dhe shëno varësitë ("Varet nga #N").

d) Shto labels `java-N` dhe `feature`, `dokumentim` ose `kerkim` sipas rastit. Krijoje `java-N` nëse mungon.

e) Para se t'i krijosh, trego listën (titulli · assignee · dega · varësitë) dhe prit "po".

f) Mos shpik të dhëna, biseda apo rezultate që duhet t'i mbledhim ne.
