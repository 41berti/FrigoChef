# FrigoChef — Product Development & UI/UX Master Roadmap

## 1. Product vision

FrigoChef is an intelligent cooking companion that helps users decide what to cook using groceries they already own, available kitchen equipment, dietary preferences, nutritional goals, available time, and eventually their budget.

The application must remain useful without requiring extensive onboarding or personal information.

## 2. Design references

Primary UI/UX inspiration: NeatEat.

Secondary functional and interaction inspiration: TapCook.

Use these applications as product research references. Do not directly copy their branding, proprietary assets, or entire interface designs.

Maintain FrigoChef's own green visual identity.

## Phase 1 — Application Foundation

Complete and maintain:

- Account registration and login.
- Persistent authentication.
- Secure logout.
- Account details.
- Password change and forgotten-password recovery.
- Albanian and English localization.
- System, Light and Dark appearance.
- Persistent application preferences.
- Reliable navigation.
- Supabase authentication and database security.

Verify the repository before implementing anything already completed.

## Phase 2 — UI/UX Modernization

Gradually transform FrigoChef from a functional student-project interface into a polished mobile application.

Introduce:

- High-quality food imagery.
- Visual ingredient cards with recognizable illustrations.
- Categorized ingredient selection.
- Ingredient search.
- Clear selected/unselected states.
- Modern recipe cards.
- Recipe filters and search.
- Consistent typography, spacing and rounded components.
- Smooth navigation transitions.
- Button press and selection animations.
- Skeleton loading states.
- Helpful empty and error states.
- Appropriate haptic feedback.
- Accessible touch targets.
- Responsive layouts.
- Reduced-motion support.

Maintain centralized design tokens and reusable components.

All UI components must support both languages and all appearance modes.

Do not introduce animations merely for decoration. Use them to improve feedback, usability and perceived responsiveness.

## Phase 3 — My Kitchen & Smart Inventory

Create an optional My Kitchen section.

Allow users to specify their available cooking appliances:

- Oven.
- Stovetop.
- Air fryer.
- Microwave.
- Blender.
- Toaster.
- Slow cooker.
- Pressure cooker.
- Other common equipment.

Use an intuitive visual selection interface inspired by NeatEat.

AI-generated recipes should consider available appliances when equipment preferences are provided.

Introduce a persistent ingredient inventory organized into categories such as:

- Refrigerator.
- Freezer.
- Pantry.
- Meat and protein.
- Dairy.
- Fruit and vegetables.
- Grains.
- Herbs and spices.

Users must be able to add, remove, search and modify ingredients manually.

Use stable ingredient identifiers rather than translated display labels for matching and database logic.

Optional future extensions include quantities, expiration dates and reminders to use food before it spoils.

## Phase 4 — AI Refrigerator Scanner

Allow the user to:

1. Open the camera or select an existing photograph.
2. Photograph their refrigerator or available groceries.
3. Submit the image for AI analysis.
4. Review detected ingredients.
5. Confirm, remove, correct or add ingredients.
6. Proceed to recipe recommendations.

Design a visually engaging scanning interface with appropriate camera guidance and loading feedback.

When supported reliably, highlight detected items visually on the photograph.

Never present uncertain detections as guaranteed facts.

Do not assume exact ingredient quantities, freshness or expiration dates from a photograph.

Keep manual ingredient selection available as an alternative.

AI requests must be processed securely through the backend, without exposing private API keys in the mobile application.

## Phase 5 — AI Recipe Generation

Generate practical recipes from confirmed ingredients.

Offer recommendation categories such as:

- Quick & Easy.
- Ready in 15–20 Minutes.
- High Protein.
- Balanced Meals.
- Vegetarian.
- Vegan.
- One-Pan Meals.
- Comfort Food.
- Meal Prep.
- More Elaborate Recipes.
- Budget-Friendly Meals.

Treat cooking time, dietary restrictions, nutritional goals and cooking styles as independently configurable preferences.

Each generated recipe should provide:

- Recipe title.
- Description.
- Serving count.
- Estimated preparation time.
- Estimated cooking time.
- Required equipment.
- Ingredients and quantities.
- Ingredients the user already owns.
- Missing ingredients.
- Substitution suggestions.
- Clear numbered cooking instructions.
- Relevant food-safety guidance.
- Optional nutritional estimates.
- Save recipe functionality.

Clearly distinguish AI-generated recipes from existing recipes.

Provide appropriate error handling, request cancellation, loading states and retry behavior.

## Phase 6 — Optional Nutrition Profile

The Nutrition Profile must never be mandatory for registration or normal recipe usage.

Allow interested users to personalize meal recommendations according to:

- Balanced eating.
- Muscle maintenance.
- Muscle building.
- Weight gain.
- Weight loss.
- Dietary preferences.
- Food allergies and intolerances.
- Food dislikes.
- Activity level.
- Optional age, height and weight.
- Other physiological information only when genuinely necessary for nutritional estimates.

Provide explanations for sensitive information requests.

Separate dietary preferences from nutritional goals.

Nutrition recommendations must not rely exclusively on gender.

Users must be able to edit, disable and delete their Nutrition Profile.

Protect personal information with appropriate database ownership and access controls.

Nutritional estimates should use confirmed quantities and reliable food-composition data rather than invented AI-generated figures.

Display estimated nutrition per serving:

- Calories.
- Protein.
- Carbohydrates.
- Fat.
- Fiber.

A meal contributes toward daily nutritional requirements; it does not necessarily fulfill all of them.

Allergy filtering must be treated carefully and must not guarantee that a meal is allergen-free without verification.

Avoid restrictive weight-management recommendations for minors and other users for whom generic targets may be inappropriate.

## Phase 7 — Cookbook & Smart Grocery Lists

### Cookbook

Allow users to:

- Save favorite recipes.
- Create personalized collections.
- Search saved recipes.
- Organize recipes into categories.
- Save AI-generated recipes.

Suggested collections:

- Favorites.
- Quick Dinners.
- High-Protein Meals.
- Budget Meals.
- Meal Prep.

### Smart grocery lists

Generate shopping lists from missing ingredients in selected recipes.

Support:

- Ingredient quantities.
- Category-based grouping.
- Checkboxes for purchased products.
- Combining duplicate ingredients using compatible measurement units.
- Manual item creation and editing.
- Exclusion of groceries already owned.
- Clear distinction between available and missing ingredients.

Do not automatically remove ingredients from inventory unless the user confirms the change or has explicitly enabled that behavior.

## Phase 8 — Weekly Meal Planning

Create a visual calendar-based meal planner.

Allow users to configure:

- Number of people eating.
- Number of servings.
- Cooking days.
- Breakfast, lunch, dinner and snacks.
- Preferred cooking times.
- Household dietary preferences.
- Meal-preparation mode.

Users should be able to:

- Generate a weekly meal plan.
- Add individual meals.
- Replace or remove meals.
- Reuse leftovers.
- Prepare multiple servings.
- Generate a combined grocery list.
- Mark recipes as cooked.

Integrate with the Nutrition Profile and My Kitchen preferences when enabled.

Inspiration: NeatEat's visual weekly calendar and TapCook's individual meal replacement functionality.

## Phase 9 — Budget Intelligence

Introduce grocery budgeting only when reliable price information is available.

Potential features:

- Maximum weekly grocery budget.
- Estimated cost per recipe.
- Estimated cost per serving.
- Budget-friendly meal alternatives.
- Cheapest practical meal plan.
- Estimated savings from groceries already owned.
- Favorite grocery stores.
- Shopping list cost estimation.

Investigate legally accessible and reliable pricing sources for Kosovo and other supported markets.

Never fabricate supermarket prices or describe estimated prices as exact or current.

Allow users to enter their own prices when automated pricing data is unavailable.

## Phase 10 — Onboarding, Tutorials & Final Polish

Once the core AI experience is fully functional, introduce a short and dismissible onboarding tutorial.

After the first successful fridge scan, introduce the optional Nutrition Profile.

Explain how FrigoChef can combine:

- Available ingredients.
- Kitchen equipment.
- Dietary preferences.
- Nutritional goals.
- Cooking time.

Allow users to skip personalization and return to it later from Settings.

Avoid long mandatory questionnaires.

Perform final accessibility, performance, security, usability and cross-platform testing.

## Future Ideas — Backlog Only

Preserve these ideas as separate GitHub issues labeled `ide`:

- Import recipes from TikTok, Instagram, YouTube and supported websites.
- Shared household grocery inventories.
- Shared family meal plans.
- Collaborative grocery lists.
- Barcode scanning.
- Receipt scanning.
- Food expiration reminders.
- Ingredient price comparison.
- Advanced nutritional tracking.

Social media recipe import is an idea only and should not be implemented until explicitly approved.

## Development Rules

Never implement this entire roadmap in one development task.

Each feature must be separately discussed, scoped, implemented, tested and reviewed.

Follow the existing workflow:

Issue → Feature branch → Commits → Push → PR → Albert reviews → Squash merge by Albert → Branch cleanup.

Albert and ChatGPT define product requirements and prepare detailed prompts.

Codex implements the approved features, including frontend, backend, database migrations, animations, testing and documentation.

Albert tests and reviews the implementation and retains exclusive merge authority.

After each implementation, Codex must provide exact local PowerShell or Git Bash testing commands and an educational engineering walkthrough covering execution flow, important functions, architecture, component communication, security, edge cases and tests, with relevant file and line references.

Do not treat this roadmap as permission to implement unapproved features.
## Implementation status

Reviewed on 26 November 2026 against GitHub `main` at `46e9cfa` and the hosted Supabase recipe catalog. **Completed** means the capability is present on `main` or verified in the hosted schema. **Partial** means a phase has shipped pieces and remaining work. **Planned** means the phase's core feature is still ahead.

| Phase | Status | What exists and what remains |
| --- | --- | --- |
| 1. Application Foundation | Partial | **Completed** — email registration and login, session persistence, sign-out, account details, Shqip and English, System/Light/Dark appearance, saved preferences, and the main tab and account navigation. The hosted recipe ownership schema, RLS policies and grants were verified through read-only checks. **Planned** — password change and forgotten-password recovery. Device and live API verification are tracked in the authentication and Settings guides. [Auth issue #22](https://github.com/41berti/FrigoChef/issues/22) · [Settings issue #21](https://github.com/41berti/FrigoChef/issues/21) · [Authentication](AUTHENTICATION.md) · [Settings](SETTINGS.md) |
| 2. UI/UX Modernization | Partial | **Completed** — centralized theme tokens, reusable recipe cards and controls, categorized ingredient chips with selection states, ingredient-based recipe matching, empty/error states, basic responsive widths, accessibility labels and haptic feedback. Settings transitions support Reduce Motion. **Planned** — real food images, illustrated ingredient cards, ingredient and recipe text search, broader recipe filters, and skeleton loading. Further motion and accessibility work needs device validation. [Theme and tabs #16](https://github.com/41berti/FrigoChef/issues/16) · [Home and results #18](https://github.com/41berti/FrigoChef/issues/18) |
| 3. My Kitchen & Smart Inventory | Partial | **Completed** — manual ingredient selection in memory and locale-independent matching for known catalog ingredients. **Planned** — optional equipment preferences, persistent refrigerator/freezer/pantry inventory, inventory search and manual editing, and stable inventory identifiers. [Ingredient catalog](../projekti-im/src/data/perberesit.ts) · [Selection state](../projekti-im/src/gjendja/zgjedhja.tsx) |
| 4. AI Refrigerator Scanner | Planned | Camera or gallery import, secure recognition and an editable review flow. Manual selection is already available. [Fridge scanning #24](https://github.com/41berti/FrigoChef/issues/24) |
| 5. AI Recipe Generation | Planned | The app reads, matches and displays existing Supabase recipes with ingredients and numbered steps. Generating, labeling and saving AI recipes remains planned. [Existing recipe data #17](https://github.com/41berti/FrigoChef/issues/17) · [AI recipes #23](https://github.com/41berti/FrigoChef/issues/23) |
| 6. Optional Nutrition Profile | Planned | Optional, editable nutrition preferences and estimates from reliable data. [Nutrition Profile #31](https://github.com/41berti/FrigoChef/issues/31) |
| 7. Cookbook & Smart Grocery Lists | Planned | Favorites, collections and shopping lists. The current recipe detail shows which ingredients are missing, and signed-in authors can create recipes. [Recipe creation #11](https://github.com/41berti/FrigoChef/issues/11) · [Recipe deletion #26](https://github.com/41berti/FrigoChef/issues/26) |
| 8. Weekly Meal Planning | Planned | Calendar-based household planning, meal replacement, leftovers and combined grocery lists. |
| 9. Budget Intelligence | Planned | Recipe and grocery estimates depend on reliable prices or prices users enter. |
| 10. Onboarding, Tutorials & Final Polish | Planned | Dismissible onboarding depends on the core AI flow. The proposed post-scan nutrition prompt is already tracked with the profile. [Nutrition Profile #31](https://github.com/41berti/FrigoChef/issues/31) |

Read this living roadmap before planning or implementing a FrigoChef feature. After finishing approved work, update the affected phase with the implementation, verification and any remaining work. Keep Albanian and English, all three appearance modes and FrigoChef's visual identity in scope when reviewing changes.

Albert and ChatGPT decide which feature comes next. Codex implements, tests and documents approved work. Albert alone reviews and squash-merges PRs. The roadmap records product direction. Each feature still requires separate approval and scope. When a backlog idea is approved for issue tracking, search GitHub first and use the `ide` label for a new idea issue. [Contribution workflow](../CONTRIBUTING.md)
