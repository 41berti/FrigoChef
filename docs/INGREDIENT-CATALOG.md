# Ingredient catalog and visual fridge

## Catalog contract

The [catalog JSON](../projekti-im/src/data/katalogu-perberesve.json) is FrigoChef's shareable, framework-independent manifest. The top-level `schemaVersion` identifies the format. Each record contains:

| Field | Meaning |
| --- | --- |
| `id` | Stable, language-independent lowercase identifier with hyphens, such as `bell-pepper`. Keep released IDs when editing labels, moving categories or replacing illustrations. |
| `category` | One of eight stable grouping keys. The UI translates category names in the two interface dictionaries. |
| `names.sq`, `names.en` | Display labels in Albanian and English. The UI uses the active application language. |
| `aliases.sq`, `aliases.en` | Explicit spelling variants, synonyms and previous labels. Keep aliases unambiguous across the entire catalog. |
| `emoji`, `illustration` | A system glyph fallback and, when present, a key for the bundled illustration. These are presentation metadata. |

## IDs, search and legacy recipes

`gjejPerberesin()` resolves a full ID, name or alias. It folds case, accents, whitespace, underscores and hyphens. For example, `speca të ëmbël`, `bell peppers` and `bell_pepper` all resolve to `bell-pepper`. The fridge search accepts partial words across both languages and can be scoped to a category. It uses a separate function so partial search results never make an exact recipe match. [Catalog resolver](../projekti-im/src/data/perberesit.ts)

The fridge stores selected IDs in shared React context. Manual entry resolves known variants to catalog IDs and keeps unknown entries as their original trimmed labels with separate `custom:` keys. A manual label can be reselected or removed for the current session. Supabase's existing ingredient arrays still contain the recipe author's strings. The match engine creates a set of selected IDs, looks up each recipe ingredient and returns the original strings for rendering. Raw and cooked rice, onion and spring onion, and generic cooking oil and olive oil have distinct IDs. [Selection context](../projekti-im/src/gjendja/zgjedhja.tsx) · [Recipe matching](../projekti-im/src/data/perputhja.ts)

## Future model handoff

Copy the JSON to the research environment and record its Git revision with the experiment. Match model labels to the exact IDs or use the same normalization and alias lookup if the dataset uses names. Keep unmatched labels unresolved and let the user review ambiguous suggestions. For instance, `pepper` can refer to more than one food, while `bell_pepper` resolves to one ID. Quantity, freshness and allergens require separate evidence. The manifest and resolver use local data and carry no user identity, credential, model dependency or network call.

When extending the catalog, reuse the ID for the same ingredient. Add a distinct ID for a distinct food. Keep the existing aliases for older Supabase rows. Run the catalog tests to check normalized alias collisions across both languages.

## Visuals and motion

NeatEat's grouped ingredient thumbnails and short labels informed the visual browsing pattern. FrigoChef uses its own green palette, existing UI tokens, newly generated food illustrations and the platform's emoji fallback. [NeatEat reference](https://www.neateat.app/) · [Bundled illustrations](../projekti-im/assets/ingredients)

The 16 PNGs were sliced and downscaled to 144 × 144 pixels from an original transparent atlas made with the built-in ImageGen tool. Ingredient artwork is decorative and paired with a localized label. Card color and checkmark transitions run for 140 ms. The count animates when it changes, and the shared motion preference skips these effects with Reduce Motion enabled. Haptics accompany explicit selection changes. [Ingredient card](../projekti-im/src/components/KartelaPerberesi.tsx) · [Motion preference](../projekti-im/src/veglat/useLevizjeReduktuar.ts)

<details>
<summary>Illustration prompt</summary>

Use case: illustration-story. Create one project-ready ingredient sprite atlas for FrigoChef, an independent green cooking app. Use a perfectly even 4-column by 4-row grid on a square true transparent canvas. Each subject occupies the central 60% of its cell; leave wide transparent gutters so it can be sliced into equal squares. Row 1: raw chicken drumstick without blood, two brown eggs, red tomato with a tiny leaf, yellow lemon with half slice. Row 2: ribbed brown rice grains in a small cream bowl, one garlic bulb with cloves, clear olive oil bottle with an olive, sliced button mushrooms. Row 3: white feta cheese cubes, one carrot with short greens, a long dark-green cucumber with slices, a yellow bell pepper. Row 4: red apple, mature zucchini with a couple of slices, dried bow-tie pasta, a small bunch of green basil leaves. Precisely one centered group per cell with no duplication, overlap, missing cells, words, numerals, frames, tile backgrounds, labels, shadows outside the cell, watermarks or brands. Warm original editorial food illustrations, lightly textured gouache, softly shaded simple shapes, vivid natural food colors, realistic enough to recognize at 40px. The object silhouettes need to read on light and dark app tiles. No background gradients, photographic scenery or UI.

</details>

## Verification on a device

1. Start Expo from `projekti-im/`. As a guest, check the fridge at default and enlarged font sizes. Scroll the category row and try adding and removing multiple tiles. The recipe button should be disabled with an empty selection.
2. In Shqip, search for `bell pepper`. In English, search for `speca te embel`. Both should find the same tile with the active language's label. Test the clear button and a query with no results.
3. Add `Tahini` manually with the on-screen button or the keyboard. Re-add `tahini` and confirm the selection count stays the same. Remove it from the selection strip, then reselect it in the manual section.
4. Choose an ingredient from a known recipe, for example `vezë` / `eggs`. Open matches, inspect the ingredients and steps, and go Back. The selection persists across navigation. Switch languages in Settings and confirm that the selected label changes while the recipe text stays in its original language.
5. Repeat while signed in. Check System, Light and Dark, then enable Reduce Motion and confirm immediate state feedback. With VoiceOver or TalkBack, verify checkbox state, the remove action, the selected count and focus order. Try haptics on hardware.

Run the Node suite from `projekti-im/`. Browser tests exercise the app and navigation with synthetic Auth and recipe responses. Use the isolated test setup in the authentication guide. [Browser test setup](AUTHENTICATION.md#account-navigation-review)

```sh
npx expo lint
npx tsc --noEmit
node --test tests/auth.test.cjs tests/settings.test.cjs tests/ingredient-catalog.test.cjs
```
