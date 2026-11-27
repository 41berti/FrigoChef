# My Kitchen / Kuzhina ime

Open **Account → Settings → My Kitchen** as a guest or while signed in. Select the equipment available on this device and tap **Save equipment**. The editor shows the saved state after reopening. Tap **Clear all** and confirm to save an explicitly empty list. [Settings entry](../projekti-im/src/app/%28recetat%29/cilesimet.tsx) · [Editor](../projekti-im/src/app/%28recetat%29/kuzhina-ime.tsx)

## Catalog contract

The 12 records in the equipment catalog have four fields.

| Field | Purpose |
| --- | --- |
| `id` | A published, lowercase ASCII identifier such as `pressure-cooker`. Retain it when renaming, translating or changing artwork. |
| `names.sq`, `names.en` | The labels presented in the active interface language. |
| `aliases.sq`, `aliases.en` | Curated terms for future data mapping. For example, `hob` refers to `stovetop`. |
| `visual` | A presentation key that points to the bundled illustration. The stovetop ID is `stovetop` and its visual key is `cooktop`. |

`normalizoPajisjet()` deduplicates IDs, keeps catalog order and drops values outside the catalog. The type `IdPajisjeje` derives from those same records. [Equipment catalog](../projekti-im/src/data/pajisjet.ts)

## Persistence and recovery

The route holds an editable draft. It reads the saved list on mount and commits it only after an explicit Save or confirmed Clear All. Saving a draft with zero items also asks for confirmation whenever it would remove previously saved equipment. While a write is pending, the editor disables repeated changes. On failure, the draft stays available for retry. A failed read displays a retry state.

The adapter uses AsyncStorage and the same ordered-write helper as Settings. The equipment key is `frigochef.equipment.v1`. Language and appearance continue to use their existing record. Already queued writes settle before a read, so reopening the editor during a save gets the settled value. The value is shared by users of the device and contains only catalog IDs. Keep credentials and user identities in their existing security boundaries. [Storage adapter](../projekti-im/src/data/kuzhina.ts)

## Future recommendation contract

`merrPajisjet()` is the read interface for an approved recommendation flow.

| Value | Meaning |
| --- | --- |
| `null` | Equipment is unknown. Make recommendations without an equipment restriction or let the user configure it. |
| `[]` | The user explicitly saved a kitchen with no equipment. |
| `["oven", "stovetop"]` | The user confirmed these equipment IDs as available. |

Unrecognized values are discarded. Malformed or unknown-only data restores as unconfigured, and a storage I/O failure is reported to the caller. Future services should validate against the same list of trusted IDs. Keep available IDs separate from a recipe's declared required IDs. Derive missing equipment by comparing those sets when the user's preference is known. Alternative cooking methods should be explicit recipe data or suggestions the user can verify. Existing Supabase recipes do not declare equipment requirements.

## Illustrations and motion

The layout uses FrigoChef's palette and shared selection card, with NeatEat as a reference for approachable, illustration-led choices. The 12 original PNGs were made with the built-in ImageGen tool and extracted as 144 × 144 transparent sprites. [NeatEat](https://www.neateat.app/) · [Equipment illustrations](../projekti-im/assets/equipment) · [Shared selection card](../projekti-im/src/components/KartelaZgjedhjeje.tsx)

Press feedback and green checkmarks come from the shared card. The count animates when it changes. Reduce Motion makes the card, counter and stack transition immediate. Cards expose their checkbox state, count and save messages use live announcements, and iOS uses the accessibility announcement API. The grid uses fewer columns as text scales up.

<details>
<summary>Illustration prompt</summary>

Use case: illustration-story. Original mobile cooking app appliance sprites in textured gouache with warm, lightly shaded editorial product illustration. Create ONE atlas with four equally sized columns and three equally sized rows on a landscape 4:3 true transparent background. Keep each object centered and inside the central 62% of its cell, including all shadows, with wide clear gutters. Row 1, left to right: freestanding silver oven with one glass oven door and no hob; black flat four-burner stovetop on its own, viewed obliquely; compact muted green basket air fryer with a drawer handle; cream microwave with glass door and buttons. Row 2: countertop jug blender with transparent pitcher on a base; cream two-slot bread toaster with two toast slices; small round green charcoal kettle grill with grate and legs; oval slow cooker with glass lid and one control dial. Row 3: stovetop silver pressure cooker with locking handle, lid and release valve; white rounded rice cooker showing a little white rice with hinged lid raised; electric tea kettle with handle, spout and small base; food processor with wide short transparent bowl, chute and base. Twelve clearly differentiated kitchen appliances, one group per cell, accurate simple silhouettes legible at 48 px. No text, logos, people, frames, checkerboard, decoration, additional appliances or background.

</details>

## Verification

From `projekti-im/`:

```sh
npx expo lint
npx tsc --noEmit
node --test tests/auth.test.cjs tests/settings.test.cjs tests/ingredient-catalog.test.cjs tests/my-kitchen.test.cjs
```

On 27 November 2026, Expo lint, TypeScript, 22 Node tests, 14 Chrome scenarios and the web, iOS and Android exports passed. The Chrome suite used the compiled web export with synthetic Auth and recipe data. Physical-device checks are listed below. [Browser suite and fixture setup](AUTHENTICATION.md#account-navigation-review)

### Physical-device check

1. In Expo Go, open My Kitchen from Account → Settings as a guest, then repeat while signed in.
2. Select and deselect appliances. Check the count, leave without saving, then reopen to check the saved state. Save two appliances, fully close Expo Go and relaunch. Modify them, save again and verify the updated list.
3. Cancel Clear All and confirm the original list remains. Confirm Clear All, reopen the app and verify the explicit empty state. Repeat by deselecting the last saved item and tapping Save equipment.
4. Switch between Shqip and English and try System, Light and Dark. Verify the same equipment stays selected. Try the smallest phone layout and enlarged text.
5. Enable Reduce Motion. With VoiceOver or TalkBack, check labels, checked state, count, save confirmation and the Clear All dialog. Verify haptic feedback on the device, then navigate back through Settings to the Visual Fridge.
