# Si punojmë në FrigoChef

Ky udhëzues është për @Arianitxhafa, por rrjedha vlen për të dy: çdo detyrë ka issue, degë dhe PR. Alberti (@41berti) i rishikon dhe i bashkon PR-të.

```text
issue → degë nga main → commit-e → push → PR te main → rishikim → squash merge
```

## 1. Merr detyrën

Detyrat e tua i sheh te Issues në GitHub ose me:

```bash
gh issue list --assignee @me
```

Lexoje të gjithë issue-n, sidomos "Çka NUK duhet prekur" dhe "Gati kur…".

- Nëse shkruan "Varet nga #N", prit derisa ajo issue të mbyllet.
- Nëse diçka s'është e qartë, pyet në komentet e issue-s para se të nisësh.

## 2. Krijo degën

Emri i degës është te issue-ja dhe ka formën `java<N>/pershkrim-i-shkurter`.

```bash
git switch main
git pull
git switch -c java5/supabase-setup
```

Nisu gjithmonë nga `main` i përditësuar. Çdo issue e ka degën e vet.

Nëse `package.json` ndryshoi pas `git pull`, ekzekuto `npm install` brenda `projekti-im/`.

## 3. Bëj commit dhe push

Prek vetëm fajllat që lidhen me issue-n. Para commit-it kontrollo kodin dhe shih çka po shton:

```bash
cd projekti-im
npx tsc --noEmit
cd ..
git status
```

Pastaj:

```bash
git add <fajllat>
git commit -m "Shto ekranin e kamerës"
git push -u origin java5/supabase-setup
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
- Alberti caktohet automatikisht si rishikues.

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
git pull --prune
git branch -D java5/supabase-setup
```

`-D` me të madhe duhet sepse squash merge krijon një commit të ri te `main`, dhe Git-i nuk e sheh degën si të bashkuar. Përdore vetëm pasi ta shohësh PR-në **Merged**.

## Çka nuk bën kurrë

- Push direkt te `main`.
- Force-push.
- Ndryshime pa lidhje me detyrën.
- Commit të `.env` apo të çelësave sekretë.
- Merge të PR-së sate.
