# FrigoChef 🧊🍳

**Find recipes you can cook with the ingredients you have.**

FrigoChef is a mobile app built with Expo Router, TypeScript and Supabase. It started as coursework for a mobile application development course and is maintained by Albert Begu. The product roadmap covers fridge scanning, AI recipe generation and longer-term plans. [Product roadmap](docs/ROADMAP.md) · [Contribution workflow](CONTRIBUTING.md)

## Current features

- Select ingredients by category and see matching recipes ranked by what you have.
- Browse Supabase recipes and open their ingredients and cooking steps. Signed-in users can add recipes and delete their own.
- Register and sign in with email. The app restores the session and supports signing out on the current device.
- Choose Shqip or English and System, Light or Dark appearance. Preferences are saved on the device.

## Project structure

| Path | Contents |
| --- | --- |
| `projekti-im/src/app/` | Expo Router routes, including the Frigoriferi and Recetat tabs, the account flow and Settings |
| `projekti-im/src/components/` | Shared UI and forms |
| `projekti-im/src/data/` | Supabase client, recipe data access and ingredient matching |
| `projekti-im/supabase/` | Historical schema SQL and versioned recipe ownership SQL |
| `docs/` | Product roadmap, technical guides and historical sketches |

Identifiers follow the project's Albanian naming. `titulli` means title, `perberesit` means ingredients and `hapat` means steps.

## Getting started

Use Node.js and Expo Go for the project's Expo SDK, or an Android/iOS emulator. Clone the repository and install the locked dependencies.

```bash
git clone https://github.com/41berti/FrigoChef.git
cd FrigoChef/projekti-im
npm ci
```

Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_KEY` in `projekti-im/.env` with the target's URL and publishable key. Then start Expo and scan the QR code. [Authentication and hosted schema](docs/AUTHENTICATION.md)

```bash
npx expo start
```

Run checks from `projekti-im/`.

```bash
npx expo lint
npx tsc --noEmit
node --test tests/auth.test.cjs tests/settings.test.cjs
```

## Author

**Albert Begu** · [@41berti](https://github.com/41berti)
