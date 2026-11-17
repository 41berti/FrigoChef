# Authentication — Issue #22

Status: implementation for review; SQL **not applied**. Do not merge until Albert
reviews the PR and the pending device/database checks pass. Settings #21
has not been implemented.

## Flow and file responsibilities

1. `projekti-im/src/components/FormaLlogarie.tsx` supplies the Albanian Login and
   Registration forms. They reuse `Fusha`, `Teksti`, `Butoni` and theme tokens,
   validate email/password, prevent duplicate submissions, and show loading/errors.
2. `src/data/llogaria.ts` calls Supabase Auth (`signUp`, `signInWithPassword`,
   `signOut`). Supabase manages the user, password hashing, email confirmation,
   access tokens and refresh tokens. The app never stores a password.
3. Registration with no returned session shows confirmation instructions. The live
   project's public Auth settings were read on 2026-11-17: email sign-in and signup
   are enabled, anonymous Auth users are disabled, and `mailer_autoconfirm=false`.
   Confirm the email in the browser, then return to the app and log in. If Supabase
   later returns a session immediately, the app proceeds without a confirmation
   screen. No Auth settings, email templates or redirect allowlists were changed.
   Verify delivery and the configured confirmation-link landing page manually.
4. `src/data/supabase.ts` enables persistence and token refresh. Native storage in
   `src/data/ruajtjaESesionit.ts` uses the SDK-compatible `expo-secure-store`
   (`~58.0.3`, included in Expo Go). `ruajtjaMePjese.ts` stores small encrypted
   chunks and swaps a manifest after a complete write, to accommodate iOS's small
   value limits. Failed writes retain the old session. Session tokens are secrets;
   they are never logged or placed in URLs. The web fallback uses origin-scoped
   localStorage and safely avoids browser globals during static rendering.
5. `src/gjendja/autentikimi.tsx` is the single auth provider. It restores the
   session, subscribes to auth events, and exposes `useAutentikimi()` to screens.
   Bootstrap cannot overwrite a newer auth event. Auth callbacks only update
   state; they do not await other Auth calls. Native AppState starts/stops refresh;
   all listeners are removed on cleanup. Supabase handles web visibility itself.
6. `src/app/_layout.tsx` waits for restoration before mounting navigation. A failed
   restore shows an error and retry. The existing two native bottom tabs remain.
   Both headers open Llogaria in the Recipes stack, which also owns Kyçu and Regjistrohu.
   The account page shows email and logout, or login/registration for guests.
   Logout uses `scope: local`: this device signs out; other devices remain signed in.
7. `src/app/(recetat)/shto.tsx` rejects guest deep links. The login return target is
   limited to `shto`, rather than accepting arbitrary redirects. Public browsing
   and refrigerator matching remain available without a session.
8. `src/data/recetat.ts` verifies the current user with Auth before mutations,
   explicitly binds new recipes to that user, and filters deletes by recipe and
   owner. The detail screen shows delete only to the owner of a non-base recipe.
   These client checks improve the interface; database RLS is the security boundary.

## Pending ownership migration

Review the complete SQL in
[`20261117171520_recipe_ownership_auth.sql`](../projekti-im/supabase/migrations/20261117171520_recipe_ownership_auth.sql).

Live inspection found 14 recipes, all eight base recipes, RLS enabled, no owner
column, and three policies limited to `anon`: public SELECT, bounded INSERT and
DELETE of non-base recipes. Broad grants also included TRUNCATE, which bypasses RLS.
At the initial schema review the security advisor returned no lints; that does not make these write policies safe.

The proposed transaction:

- Adds nullable `pronari_id` referencing `auth.users`, then sets `auth.uid()` as the
  default for **future** inserts. It never backfills or assigns legacy ownership.
- Preserves recipes when their owner is deleted (`ON DELETE SET NULL`). Base and
  other unowned recipes remain public and cannot be changed by client users.
- Removes both anonymous write policies and broad grants. Guests receive SELECT;
  authenticated users receive SELECT, INSERT and DELETE. UPDATE, TRUNCATE,
  REFERENCES and TRIGGER remain unavailable to both client roles.
- Allows SELECT for both guests and authenticated users. Every existing recipe is
  public; this issue does not introduce private recipes or expose account emails.
- Requires INSERT ownership to equal the JWT's `auth.uid()`, rejects reserved base
  IDs, and retains the existing title/time/ingredient/step validation limits.
- Allows DELETE only when the caller owns the row and its ID is not 1–8. A forged
  owner is rejected in the database. Recipe editing is outside this issue and is
  denied for everyone using a client role.

**Until applied:** existing anonymous clients still have the old unsafe write
policies; signing in cannot read recipes under the current anon-only SELECT policy,
and authenticated creation cannot work without the owner column/new policies. Guest
browsing works before migration because the read query tolerates the absent owner
column. There is no anonymous write fallback in the new code. Recipe ownership and role enforcement still require database verification.

The SQL is based on the inspected live schema, not a fresh-database bootstrap. Prior
SQL files are historical setup scripts, not an existing Supabase migration chain.
In a database task, Codex reviews the current schema, dependencies and risk, applies
**only this migration** through authorized tools, and verifies the results. High-risk
production or destructive operations require explicit approval. Do not blindly run all historical setup scripts or `db reset`.

## Verification

Commands run from `projekti-im/`:

- `npx expo lint`: passed.
- `npx tsc --noEmit`: passed.
- `node --test tests/auth.test.cjs`: eight tests passed. This includes actual
  installed Supabase SDK login, restoration in a new client, and logout with a
  mocked HTTP server/storage; it is not a live-account or iPhone test.
- `npx @expo/agent-cli@latest export --platform web`: passed, 22 static routes.
- Native iOS and Android JavaScript/Hermes exports: passed. These compilation
  checks do not execute SecureStore on an iPhone or Android device.
- Expo compatibility check: reports pre-existing mismatches: Expo 58.0.24 →
  ~58.0.26, @expo/ui 58.0.28 → ~58.0.29, expo-router 58.0.31 → ~58.0.32,
  expo-web-browser 58.0.8 → ~58.1.0. SecureStore matches SDK 58.
- `npx expo-doctor`: 19/20 passed; the remaining check is those same version
  mismatches. No unrelated upgrades or audit fixes were included.

Browser checks passed for the guest account screen, registration password length
and confirmation validation, login validation, a live invalid-credentials response,
guest Shto/deep-link redirects, recovery to public browsing, all 14 recipe reads,
legacy recipe details without deletion, and refrigerator ingredient matching.
The registration/login forms were inspected at 390×844 in the current dark theme.
A small web-only inset avoids native-tabs' fixed web bar overlapping headers;
native tab placement is unchanged. No successful live signup/login/logout or native
session restoration was claimed from these browser checks.

The tests use no secrets, real emails, new accounts or database writes. Historical
coursework and `DemoGjendja.tsx` remain untouched.

### Device and database checks

Use Expo Go on Albert's iPhone; no iOS runtime was available on this Windows host.

1. Guest: browse both recipe lists and details; select refrigerator ingredients;
   open Llogaria; try Shto and a direct `/shto` link. Both must lead to login.
2. Register with an email you control. Check password validation/mismatch, disabled
   submit/loading, email delivery, duplicate-email behavior and confirmation link.
   An unconfirmed account must not log in; confirmation must allow password login.
3. Verify the profile email, return to adding a recipe after login, and both tabs.
4. Fully close/reopen Expo Go: restore the session without flashing a guest screen.
   Background/foreground it; check token refresh after expiry. Log out and restart:
   the app must remain signed out. Repeat the form flow in light and dark mode,
   with the iPhone keyboard and larger system text.
5. After migration, use two controlled test accounts A and B. A creates a recipe;
   confirm `pronari_id=A`. B must read it but cannot delete it. A can delete it.
   Guests cannot insert, update, delete or truncate. Direct API requests spoofing
   B's owner ID must fail. All client UPDATE requests must fail, including attempts
   to claim an unowned recipe or reassign ownership. Test these through the API,
   not only through hidden buttons. Only delete disposable test recipes.
6. Verify all 14 pre-existing recipes and eight base IDs remain, with null owners;
   guest and signed-in public reads both work. Neither user may delete legacy/base
   recipes. Re-run schema/policy/grant inspection and security advisors.
7. Check airplane-mode failures during login, restore, save and logout; preserve
   drafts and provide a retry. Record actual outcomes before marking the PR ready.

## Account navigation review

Albert verified live registration, login, logout and profile details on his iPhone before the navigation fix. The recording starts in Frigoriferi. The form replaced itself with a signed-in Account while the original Account stayed underneath. Both copies reflected the same session, so the first Back tap still showed the profile.

Account and both forms now belong to the Recipes stack, anchored at its list. The two headers open that same Account. When entering from the other tab, the header clears any previous Recipes detail or form above the list. On successful authentication the focused form dismisses to Account, or replaces itself with the editor for the guest Add flow. Logging out updates the current screen in place.

The browser regression suite drives the app's header Back button and the real router, with synthetic Auth and recipe responses. Its ten cases cover both tabs, a background detail, repeated visits, logout, both registration modes, direct links, Add and cancellation. Check the native iOS Back button and swipe in Expo Go after restarting Metro with the new route tree.

To repeat the browser suite on Windows with Chrome installed, start the isolated server from `projekti-im` in Git Bash:

```bash
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54399 EXPO_PUBLIC_SUPABASE_KEY=test-publishable-key npx expo start --localhost --port 8097
```

In a second Git Bash terminal in the same folder, run:

```bash
driver_dir="$(mktemp -d)"
npm install --prefix "$driver_dir" --no-save --no-audit --no-fund playwright-core@1.65.1
NODE_PATH="$(cygpath -w "$driver_dir/node_modules")" node --test tests/account-navigation.browser.cjs
```

## Follow-up planning only

For #21, after Albert merges #22 and explicitly says to continue: start a new branch
from updated main; add a persisted theme preference (`Sistemi`, `E çelët`,
`E errët`); make `useNgjyrat`, navigation themes, headers, tabs and StatusBar use the
same resolved preference; add a dedicated Cilësimet screen reachable from Llogaria.
Reuse the guest/account states and logout. Choose the minimum compatible preference
storage then, centralize Shqip/English translations throughout the app, and test both language and System/Light/Dark appearance preferences across restart. Future UI work should improve transitions, button feedback, loading, accessibility and responsiveness while keeping interactions simple. No settings code is in #22.

Some contributor docs still reference the historical team and lecture schedule. [Issue #29](https://github.com/41berti/FrigoChef/issues/29) tracks
a separate documentation-only cleanup; preserve historical
submissions and progress reports. Albert is the sole owner/developer and the only
reviewer/merger. This supersedes the old pacing/team instructions.

## Official references

- [Expo SecureStore, SDK 58](https://docs.expo.dev/versions/v58.0.0/sdk/securestore/)
- [Supabase Expo user management](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [Supabase email registration](https://supabase.com/docs/reference/javascript/auth-signup)
- [Supabase row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security)
