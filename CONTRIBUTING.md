# Si punojmë në FrigoChef

Alberti (@41berti) është pronari dhe zhvilluesi i vetëm i FrigoChef. Alberti dhe ChatGPT përcaktojnë kërkesat. Codex implementon, teston, dokumenton dhe përgatit PR-në. Vetëm Alberti e rishikon dhe e bashkon PR-në me squash merge.

`EKIPI.md`, `PROGRES.md` dhe dokumentet e tjera të kursit ruhen si arkiv. Për punën e re ndiq rrjedhën më poshtë.

```text
issue → degë nga main → commit-e → push → PR te main me "Closes #N"
      → rishikim dhe squash merge nga Alberti → fshirje e degës
```

## 1. Merr detyrën

Gjej issue-n ekzistuese në GitHub ose ekzekuto komandën më poshtë. Lexo udhërrëfyesin para se të planifikosh një veçori. [Udhërrëfyesi i produktit](docs/ROADMAP.md)

```bash
gh issue list --state open
```

Lexoje të gjithë issue-n, sidomos "Çka NUK duhet prekur" dhe "Gati kur…".

- Nëse shkruan "Varet nga #N", prit derisa ajo issue të mbyllet.
- Nëse diçka s'është e qartë, pyet në komentet e issue-s para se të nisësh.

## 2. Krijo degën

Përdor një emër përshkrues me numrin e issue-s, për shembull `docs/29-product-roadmap`. Krijo degën nga `origin/main` pas fetch-it.

```bash
git fetch origin
git switch -c docs/29-product-roadmap origin/main
```

Nisu gjithmonë nga `main` i përditësuar. Çdo issue e ka degën e vet.

Kur ndryshojnë varësitë, ekzekuto `npm ci` brenda `projekti-im/`.

## 3. Bëj commit dhe push

Prek vetëm fajllat që lidhen me issue-n. Para commit-it kontrollo kodin dhe shih çka po shton:

```bash
cd projekti-im
npx expo lint
npx tsc --noEmit
cd ..
git status
```

Pastaj:

```bash
git add <fajllat>
git commit -m "Dokumento udhërrëfyesin e FrigoChef"
git push -u origin docs/29-product-roadmap
```

- `-u` duhet vetëm herën e parë. Më pas mjafton `git push`.
- Mesazhet e commit-eve shkruhen shqip: "Shto…", "Rregullo…", "Plotëso…".

## 4. Hap PR-në te `main`

Pas push-it, GitHub e shfaq butonin **Compare & pull request**. Ose nga terminali:

```bash
gh pr create --base main
```

- Baza e PR-së duhet të jetë `main`.
- Plotëso shabllonin. Te "Issue" shkruaj `Closes #N`, me numrin e issue-s, që ajo të mbyllet vetë pas merge-it.
- Alberti është rishikuesi i vetëm. Për PR-në shëno çfarë u verifikua dhe jep komandat lokale të rishikimit. [Udhëzuesi i rishikimit](docs/AI-REVIEW.md)

## 5. Përgjigju komenteve

Mos hap PR të re. Bëj commit-e të reja në të njëjtën degë:

```bash
git add <fajllat>
git commit -m "Rregullo mesazhin e gabimit"
git push
```

- PR-ja përditësohet vetë.
- Çdo push i ri e heq aprovimin e mëparshëm, prandaj Alberti e rishikon prapë.
- Përgjigju te çdo koment. Të gjitha komentet duhet të zgjidhen para merge-it.

Nëse GitHub tregon konflikt me `main`, bashkoje `main`-in në degën tënde:

```bash
git fetch origin
git merge origin/main
```

Zgjidhi konfliktet, bëj `git add <fajllat>` dhe `git commit`, pastaj `git push`. Mos përdor rebase apo force-push.

## 6. Pastro degën pas merge-it

Kur PR-ja të jetë **Merged**, dega në GitHub fshihet automatikisht. Fshije edhe lokalisht:

```bash
git switch main
git pull --ff-only --prune
git branch -D docs/29-product-roadmap
```

`-D` me të madhe duhet sepse squash merge krijon një commit të ri te `main`, dhe Git-i nuk e sheh degën si të bashkuar. Përdore vetëm pasi ta shohësh PR-në **Merged**.

## Çka nuk bën kurrë

- Push direkt te `main`.
- Force-push.
- Ndryshime pa lidhje me detyrën.
- Commit të `.env` apo të çelësave sekretë.
- Merge të PR-së sate.
