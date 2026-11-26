# Cilësimet e FrigoChef

Cilësimet hapen nga Llogaria për vizitorët dhe për përdoruesit e kyçur. Një prekje te Prapa kthen te Llogaria. Prekja tjetër çon te lista e Recetave. Kjo funksionon edhe kur Llogaria është hapur nga Frigoriferi.

## Si funksionojnë preferencat

- `PreferencatProvider` lexon një objekt të vogël nga AsyncStorage me çelësin `frigochef.preferences.v1`. Ai përmban vetëm gjuhën dhe pamjen. Në nisje, aplikacioni pret restaurimin para ekranit të parë. Splash-i i sistemit mund të shfaqet gjatë kësaj kohe. [Provider-i](../projekti-im/src/gjendja/preferencat.tsx#L41) · [Root layout](../projekti-im/src/app/_layout.tsx#L16)
- Pa zgjedhje të ruajtur, përdoret gjuha e parë e mbështetur nga lista e pajisjes, me shqipen si rezervë. Kur përdoruesi prek English ose Shqip, `ndrysho` përditëson gjendjen dhe vendos shkrimin në radhë. Edhe zgjedhja e gjuhës që është aktive bëhet preferencë e shprehur. Gabimi i ruajtjes shfaqet te Cilësimet dhe prekja tjetër provon përsëri. [Leximi dhe radha e shkrimit](../projekti-im/src/data/preferencat.ts#L7) · [Ndryshimi](../projekti-im/src/gjendja/preferencat.tsx#L79)
- `perkthyesi(gjuha)` kthen funksionin `t`. Çelësat e tij përcaktohen nga fjalori shqip. Fjalori anglisht kontrollohet nga TypeScript. `i18n-js` trajton numrin njëjës/shumës, vlerat dinamike dhe shqipen rezervë. Formularët ruajnë çelësin e gabimit që mesazhi të mund të vizatohet në gjuhën aktive. [Përkthyesi](../projekti-im/src/i18n/perkthimi.ts#L5) · [Validimi i llogarisë](../projekti-im/src/data/llogaria.ts#L27)
- `temaEfektive` kthen light ose dark. Në modalitetin Sistemi ndiqet `useColorScheme`. Në pajisje, `Appearance.setColorScheme` zbaton zgjedhjen edhe te kontrollet native. Zgjedhja Sistemi e liron këtë mbishkrim me `auto`. Paleta, tema e navigimit dhe StatusBar lexojnë rezultatin e njëjtë. Në web përditësohen edhe gjuha dhe color-scheme e dokumentit. [Rezolucioni](../projekti-im/src/data/preferencat.ts#L11) · [Paleta](../projekti-im/src/tema/tema.ts#L64) · [Navigimi](../projekti-im/src/tema/navigimi.ts#L8)
- Te Cilësimet, Reanimated interpolon sfondin, mbushjen, kufijtë, ngjyrën e etiketës dhe dukshmërinë e shenjës së zgjedhjes për 220 ms. Reduce Motion e çon kohëzgjatjen në zero, edhe kur cilësimi ndryshon gjatë përdorimit. Header-at, ikonat native dhe shiritat e sistemit e marrin temën menjëherë. [Lëvizja](../projekti-im/src/app/%28recetat%29/cilesimet.tsx#L12) · [Kontrolli i zgjedhjes](../projekti-im/src/app/%28recetat%29/cilesimet.tsx#L48)

## Përmbajtja e recetave

Teksti i ruajtur nga autori shfaqet në gjuhën burimore. Chip-i “eggs” ka të njëjtin identitet si “vezë”. Krahasimi i emrave të katalogut bëhet lokalisht, ndërsa lista e përbërësve dhe hapat shfaqin tekstin origjinal. Për përmbajtje shumëgjuhëshe në të ardhmen, ruaj gjuhën burimore dhe përkthime të veçanta të miratuara nga autori, të lidhura me ID-në e recetës dhe gjuhën. Në mungesë përkthimi, shfaq origjinalin. [Katalogu](../projekti-im/src/data/perberesit.ts) · [Përputhja](../projekti-im/src/data/perputhja.ts)

## Verifikimi në Expo Go

Përdor të njëjtin rrjet me kompjuterin dhe Expo Go për SDK 58. Skano QR me kamerën në iPhone ose nga Expo Go në Android. Provo në secilën platformë që ke në dispozicion.

1. Në një instalim pa preferenca, provo gjuhën e mbështetur të pajisjes dhe një listë gjuhësh pa shqip ose anglisht. Kontrollo zgjedhjen fillestare. Shmang pastrimin e të dhënave të një instalimi me sesion që dëshiron ta ruash.
2. Si vizitor, zgjidh “vezë” te Frigoriferi. Hap Llogaria → Cilësimet. Zgjidh English dhe kontrollo titullin, të dy tab-et dhe gjendjen e radiobutonave. Prapa duhet të hapë Account dhe pastaj Recipes. Kthehu te Fridge, verifiko “eggs” të zgjedhur dhe hap rezultatet. Kontrollo etiketat anglisht përreth përmbajtjes origjinale.
3. Zgjidh Dark me pajisjen në light dhe Light me pajisjen në dark. Kontrollo formularin e hyrjes, fushat, kartelat, header-at, tab-et dhe kontrastin e orës e baterisë. Zgjidh System dhe ndërro pamjen e pajisjes sa aplikacioni është i hapur, pastaj gjatë kalimit në sfond.
4. Zgjidh English dhe Dark. Mbylle plotësisht Expo Go dhe rihape projektin. Ekrani i parë i aplikacionit duhet të ketë gjuhën dhe temën e ruajtur. Përsërite pas daljes nga llogaria.
5. Aktivizo Reduce Motion në iOS ose Remove animations në Android. Ndrysho pamjen disa herë. Me VoiceOver ose TalkBack, kontrollo emrin dhe gjendjen e çdo zgjedhjeje. Provo tekst më të madh dhe ekran të ngushtë.
6. Hyr me një llogari prove. Përsërit hyrjen në Cilësimet dhe kthimin. Kontrollo regjistrimin, gabimin e fjalëkalimit, daljen, shtimin e një recete prove dhe detajet e saj. Për fshirjen, përdor vetëm një recetë prove të krijuar nga ti. Mos ndrysho recetat ekzistuese për të testuar gjuhën.

## Testet automatike

Brenda `projekti-im`, ekzekuto:

```sh
npx expo lint
npx tsc --noEmit
node --test tests/auth.test.cjs tests/settings.test.cjs
npx expo-doctor
```

Në një klon të ri Expo gjeneron tipat e rrugëve kur niset Metro. Testet e shfletuesit përdorin Chrome, një server Expo të izoluar dhe përgjigje sintetike për Auth/recetat. Komandat e nisjes janë te [testi i navigimit](AUTHENTICATION.md#account-navigation-review). Ato verifikojnë edhe zgjedhjen e gjuhës, temën, ruajtjen pas rifreskimit, Reduce Motion dhe përputhjen e përbërësve në anglisht. Pamja dhe reagimi haptik në telefon kërkojnë verifikimin në pajisje më sipër.
