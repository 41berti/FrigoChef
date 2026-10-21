# FrigoChef 🧊🍳

**Snap a photo of your fridge, get recipes you can cook right now.**

FrigoChef is a mobile app built with **Expo Router** and **TypeScript**. The long-term idea: you take a photo of what's inside your fridge, and the app recommends recipes that use those ingredients.

This repository is being built step by step as part of a university mobile-development course. The current version shows a list of recommended recipes (mock data) and a details screen for each one. The camera and recommendation features are planned for later stages.

---

## ✨ Features

**Done**
- 📋 Recipe list rendered with `FlatList`, using a reusable `Kartela` card component
- 🔗 Tap any recipe to open its details at `/artikull/[id]`
- 🧾 Details screen showing name, cooking time, ingredients and description
- 🛡️ "Not found" screen for invalid ids (e.g. `/artikull/x99`)
- ✅ Fully type-checked with `tsc --noEmit`

**Planned**
- 📸 Take or upload a photo of your fridge
- 🧠 Detect ingredients from the photo
- 🍽️ Recommend recipes based on what you actually have

---

## 🗂️ Project structure

```
src/
├── app/
│   ├── index.tsx            # Recipe list (home screen)
│   └── artikull/
│       └── [id].tsx         # Recipe details (dynamic route)
├── components/
│   ├── Kartela.tsx          # Reusable card: titulli + teksti
│   └── DemoGjendja.tsx      # let vs useState demo
└── data/
    └── artikujt.ts          # Artikull type, mock recipes, gjeArtikullin()
```

> The course is taught in Albanian, so identifiers follow Albanian naming:
> `artikujt` = items, `titulli` = title, `pershkrimi` = description,
> `perberesit` = ingredients, `kohaMinuta` = time in minutes.

---

## 🚀 Getting started

**Requirements:** Node.js (LTS) and the [Expo Go](https://expo.dev/go) app on your phone, or an Android/iOS emulator.

```bash
# 1. Clone the repo
git clone https://github.com/41berti/FrigoChef.git
cd FrigoChef

# 2. Install dependencies
npm install

# 3. Start the dev server
npx expo start
```

Then scan the QR code with Expo Go, or press `a` (Android) / `i` (iOS) to open an emulator.

### Type-check

```bash
npx tsc --noEmit
```

---

## 🧠 Key concepts

| Concept | Why it matters |
|---|---|
| `keyExtractor={(item) => item.id}` | Uses a stable id instead of the array index, so each row keeps its own state when the list changes. |
| Ids as strings | The URL carries the id as text, so recipes are looked up with `a.id === id`, never `Number(id)`. |
| `if (!artikulli)` guard | `gjeArtikullin()` can return `undefined`. Without the guard, TypeScript reports **TS18048** (*possibly 'undefined'*). |
| File-based routing | The file `src/app/artikull/[id].tsx` *is* the route `/artikull/:id`. |

---

## 🛠️ Tech stack

- [Expo](https://expo.dev/) + [Expo Router](https://docs.expo.dev/router/introduction/)
- React Native
- TypeScript

---

## 👤 Author

**Albert Begu** · [@41berti](https://github.com/41berti)

Built as coursework for a mobile application development course.
