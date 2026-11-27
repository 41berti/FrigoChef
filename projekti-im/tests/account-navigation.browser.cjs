const assert = require("node:assert/strict");
const { test } = require("node:test");
const { chromium } = require("playwright-core");

// Start the isolated Expo server as described in docs/AUTHENTICATION.md.
const origin = "http://localhost:8097";
const api = "http://127.0.0.1:54399";
const user = {
  id: "00000000-0000-4000-8000-000000000042",
  aud: "authenticated",
  role: "authenticated",
  email: "navigation@example.invalid",
  identities: [],
  app_metadata: {},
  user_metadata: {},
};

async function mockSupabase(page) {
  let confirmEmail = true;
  const encode = value => Buffer.from(JSON.stringify(value)).toString("base64url");
  const claims = { sub: user.id, role: user.role, exp: Math.floor(Date.now() / 1000) + 3600 };
  const session = {
    access_token: [encode({ alg: "HS256", typ: "JWT" }), encode(claims), "mock"].join("."),
    refresh_token: "test-refresh",
    token_type: "bearer",
    expires_in: 3600,
    user,
  };
  const recipe = {
    id: "1", titulli: "Test recipe", koha_minuta: 10, perberesit: ["Vezë", "Tahini"], hapat: ["Test step"],
  };
  await page.route("**/*", route => {
    const url = new URL(route.request().url());
    if (url.origin === origin) return route.continue();
    if (url.origin !== api) return route.abort();
    switch (url.pathname) {
      case "/auth/v1/signup": return route.fulfill({ json: confirmEmail ? user : session });
      case "/auth/v1/token": return route.fulfill({ json: session });
      case "/auth/v1/logout": return route.fulfill({ json: {} });
      case "/auth/v1/user": return route.fulfill({ json: user });
      case "/rest/v1/recetat":
        return route.fulfill({ json: url.searchParams.has("id") ? recipe : [recipe] });
      default: throw new Error("Unexpected test endpoint " + url.pathname);
    }
  });
  return { allowImmediateSignup() { confirmEmail = false; } };
}

test("one header Back from Account reaches Recipes", async t => {
  const browser = await chromium.launch({ channel: "chrome" });
  t.after(() => browser.close());
  const page = await browser.newPage({ locale: "sq-AL", viewport: { width: 390, height: 850 } });
  const auth = await mockSupabase(page);
  const button = name => page.getByRole("button", { name, exact: true }).filter({ visible: true });
  const press = name => button(name).click();
  const at = path => page.waitForFunction(path => location.pathname === path, path);
  const open = path => page.goto(origin + path, { waitUntil: "domcontentloaded", timeout: 90000 });
  const headerBack = () => page.locator('[aria-label*="back" i]').filter({ visible: true }).first().click();

  async function openAccount() {
    await press("Llogaria");
    await at("/llogaria");
  }
  async function submit(registration = false) {
    await page.getByPlaceholder("emri@shembull.com").fill(user.email);
    for (const input of await page.locator('input[type="password"]:visible').all()) {
      await input.fill("only-a-test-password");
    }
    await press(registration ? "Regjistrohu" : "Kyçu");
  }
  async function profile() {
    await at("/llogaria");
    await button("Dil nga llogaria").waitFor();
  }
  async function recipes() {
    await at("/recetat");
    await button("+ Shto një recetë").waitFor();
  }
  async function backToRecipes() {
    await headerBack();
    await recipes();
  }
  async function logout() {
    await press("Dil nga llogaria");
    await button("Regjistrohu").waitFor();
  }

  await t.test("guest preferences update in place, survive restart and preserve Account back", async () => {
    await open("/");
    await openAccount();
    await press("Cilësimet");
    await at("/cilesimet");
    const radio = name => page.getByRole("radio", { name, exact: true });
    const theme = value => page.waitForFunction(v => document.documentElement.style.colorScheme === v, value);
    await radio("English").click();
    await page.getByRole("heading", { name: "Settings", exact: true }).waitFor();
    await page.emulateMedia({ colorScheme: "light" });
    await radio("Dark").click();
    await theme("dark");
    await headerBack();
    await at("/llogaria");
    await button("Settings").waitFor();
    await headerBack();
    await at("/recetat");
    await button("+ Add a recipe").waitFor();
    await open("/cilesimet");
    await radio("Dark").waitFor();
    assert.equal(await radio("Dark").getAttribute("aria-checked"), "true");
    await theme("dark");
    await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
    await radio("Light").click();
    await theme("light");
    await radio("System").click();
    await theme("dark");
    await page.emulateMedia({ colorScheme: "light" });
    await theme("light");
    await radio("Shqip").click();
    await page.getByRole("heading", { name: "Cilësimet", exact: true }).waitFor();
  });

  await t.test("English fridge selection matches source content and survives a visit to Settings", async () => {
    const english = await browser.newPage({ locale: "en-US", viewport: { width: 320, height: 700 } });
    try {
      await mockSupabase(english);
      await english.goto(origin);
      const eggs = english.getByRole("checkbox", { name: "eggs", exact: true });
      await eggs.click();
      await english.getByText("1 ingredient selected", { exact: true }).waitFor();
      await english.getByRole("button", { name: "Account", exact: true }).click();
      await english.getByRole("button", { name: "Settings", exact: true }).click();
      await english.emulateMedia({ reducedMotion: "reduce" });
      const dark = english.getByRole("radio", { name: "Dark", exact: true });
      await dark.click();
      await english.waitForFunction(() => {
        const box = document.querySelector('[role="radio"][aria-label="Dark"]')?.firstElementChild;
        return box && getComputedStyle(box).transitionDuration === "0s";
      });
      await english.getByRole("tab", { name: "Fridge", exact: true }).click();
      assert.equal(await eggs.getAttribute("aria-checked"), "true");
      await english.waitForFunction(() => {
        const box = document.querySelector('[role="checkbox"][aria-label="eggs"]')?.firstElementChild;
        return box && getComputedStyle(box).transitionDuration.split(", ").every(value => value === "0s")
          && document.documentElement.style.colorScheme === "dark";
      });
      const liveCount = english.locator('[aria-live="polite"]').filter({ hasText: "1 ingredient selected" });
      await liveCount.waitFor();
      await english.getByRole("button", { name: /See recipes/ }).click();
      await english.getByRole("link", { name: /Test recipe/ }).click();
      await english.getByText("Vezë", { exact: true }).waitFor();
      await english.getByText("Test step", { exact: true }).waitFor();
      await english.getByRole("heading", { name: "Ingredients" }).waitFor();
    } finally {
      await english.close();
    }
  });

  await t.test("fridge search, filter, manual entry, removal and custom recipe matching", async () => {
    const fridge = await browser.newPage({ locale: "en-US", viewport: { width: 390, height: 844 } });
    try {
      await mockSupabase(fridge);
      await fridge.goto(origin);
      const search = fridge.getByRole("textbox", { name: "Search ingredients" });
      const findRecipes = fridge.getByRole("button", { name: /See recipes/ });
      const addManually = fridge.getByRole("button", { name: "Add manually" });
      await search.waitFor();
      assert.equal(await findRecipes.isDisabled(), true);
      await search.fill("speca te embel");
      const peppers = fridge.getByRole("checkbox", { name: "peppers", exact: true });
      await peppers.click();
      assert.equal(await peppers.getAttribute("aria-checked"), "true");
      await fridge.getByRole("button", { name: "Remove peppers" }).click();
      assert.equal(await peppers.getAttribute("aria-checked"), "false");
      await fridge.getByRole("button", { name: "Clear ingredient search" }).click();
      const dairy = fridge.getByRole("button", { name: "Dairy & eggs", exact: true });
      await dairy.click();
      assert.equal(await dairy.getAttribute("aria-pressed"), "true");
      assert.equal(await fridge.getByRole("checkbox", { name: "chicken", exact: true }).count(), 0);
      await fridge.getByRole("button", { name: "All", exact: true }).click();
      await search.fill("tahini");
      await fridge.getByText("No ingredients match your search.", { exact: true }).waitFor();
      await addManually.click();
      const input = fridge.getByRole("textbox", { name: "Ingredient name" });
      assert.equal(await input.inputValue(), "tahini");
      await input.fill("Tahini");
      await fridge.getByRole("button", { name: "Add ingredient", exact: true }).click();
      await fridge.getByText("1 ingredient selected", { exact: true }).waitFor();
      const tahini = fridge.getByRole("checkbox", { name: "Tahini", exact: true });
      assert.equal(await tahini.getAttribute("aria-checked"), "true");
      await addManually.click();
      await input.fill("TAHINI");
      await input.press("Enter");
      await fridge.getByText("1 ingredient selected", { exact: true }).waitFor();
      assert.equal(await tahini.count(), 1);
      await findRecipes.click();
      await fridge.getByRole("link", { name: /Test recipe/ }).click();
      await fridge.waitForURL("**/artikull/1");
      await fridge.getByText("Test step", { exact: true }).waitFor();
      await fridge.getByText("Tahini", { exact: true }).filter({ visible: true }).waitFor();
    } finally {
      await fridge.close();
    }
  });

  await t.test("guest kitchen drafts, saving, language, appearance, restart and confirmed clearing", async () => {
    const kitchen = await browser.newPage({ locale: "en-US", viewport: { width: 390, height: 844 } });
    try {
      await mockSupabase(kitchen);
      await kitchen.goto(origin, { waitUntil: "domcontentloaded", timeout: 90000 });
      await kitchen.getByRole("button", { name: "Account", exact: true }).click();
      await kitchen.getByRole("button", { name: "Settings", exact: true }).click();
      await kitchen.getByRole("link", { name: "My Kitchen", exact: true }).click();
      await kitchen.waitForURL("**/kuzhina-ime");
      await kitchen.getByText("Kitchen not set up yet.").waitFor();
      const oven = kitchen.getByRole("checkbox", { name: "Oven", exact: true });
      const toaster = kitchen.getByRole("checkbox", { name: "Toaster", exact: true });
      assert.equal(await kitchen.getByRole("checkbox").count(), 12);
      await oven.click();
      await toaster.click();
      await kitchen.getByText("2 items selected", { exact: true }).waitFor();
      await toaster.click();
      await kitchen.getByText("1 item selected", { exact: true }).waitFor();
      await kitchen.reload({ waitUntil: "domcontentloaded" });
      await kitchen.getByText("Kitchen not set up yet.").waitFor();
      assert.equal(await oven.getAttribute("aria-checked"), "false");
      await oven.click();
      await kitchen.getByRole("button", { name: "Save equipment", exact: true }).click();
      await kitchen.getByText("Kitchen saved.", { exact: true }).waitFor();
      await kitchen.reload({ waitUntil: "domcontentloaded" });
      await kitchen.getByText("Saved on this device.", { exact: true }).waitFor();
      assert.equal(await oven.getAttribute("aria-checked"), "true");

      await kitchen.goto(origin + "/cilesimet", { waitUntil: "domcontentloaded" });
      await kitchen.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
      await kitchen.getByRole("radio", { name: "Dark", exact: true }).click();
      await kitchen.getByRole("radio", { name: "Shqip", exact: true }).click();
      await kitchen.getByRole("link", { name: "Kuzhina ime", exact: true }).click();
      const furra = kitchen.getByRole("checkbox", { name: "Furrë", exact: true });
      await furra.waitFor();
      assert.equal(await furra.getAttribute("aria-checked"), "true");
      await kitchen.waitForFunction(() => {
        const card = document.querySelector('[role="checkbox"][aria-label="Furrë"]')?.firstElementChild;
        return card && getComputedStyle(card).transitionDuration.split(", ").every(value => value === "0s")
          && document.documentElement.style.colorScheme === "dark";
      });

      const clear = kitchen.getByRole("button", { name: "Pastro të gjitha", exact: true });
      kitchen.once("dialog", dialog => dialog.dismiss());
      await clear.click();
      assert.equal(await furra.getAttribute("aria-checked"), "true");
      await furra.click();
      kitchen.once("dialog", dialog => dialog.dismiss());
      await kitchen.getByRole("button", { name: "Ruaj pajisjet", exact: true }).click();
      assert.equal(await kitchen.evaluate(() => localStorage.getItem("frigochef.equipment.v1")), '["oven"]');
      kitchen.once("dialog", dialog => dialog.accept());
      await clear.click();
      await kitchen.getByText("Kuzhina u ruajt.", { exact: true }).waitFor();
      await kitchen.reload({ waitUntil: "domcontentloaded" });
      await kitchen.getByText("Ruajtur pa pajisje.", { exact: true }).waitFor();
      assert.equal(await furra.getAttribute("aria-checked"), "false");
    } finally {
      await kitchen.close();
    }
  });

  await t.test("login from the refrigerator", async () => {
    await open("/");
    await openAccount();
    await press("Kyçu");
    await submit();
    await profile();
    await backToRecipes();
    await page.getByRole("tab", { name: "Frigoriferi", exact: true }).click();
    await page.getByRole("textbox", { name: "Kërko përbërës" }).fill("eggs");
    await page.getByRole("checkbox", { name: "vezë", exact: true }).click();
    await page.getByRole("button", { name: /Shiko recetat/ }).click();
    await page.getByRole("link", { name: /Test recipe/ }).waitFor();
    await headerBack();
    await at("/");
    await page.getByRole("tab", { name: "Recetat", exact: true }).click();
    await recipes();
    await openAccount();
    await press("Cilësimet");
    await page.getByRole("link", { name: "Kuzhina ime", exact: true }).click();
    await page.getByRole("checkbox", { name: "Furrë", exact: true }).waitFor();
    await headerBack();
    await at("/cilesimet");
    await headerBack();
    await at("/llogaria");
    await backToRecipes();
  });
  await t.test("repeated signed-in visits from Recipes", async () => {
    for (let i = 0; i < 2; i++) {
      await openAccount();
      await profile();
      await backToRecipes();
    }
  });
  await t.test("logout changes Account to its guest view", async () => {
    await openAccount();
    await logout();
    await backToRecipes();
  });
  await t.test("registration with email confirmation then password login", async () => {
    await openAccount();
    await press("Regjistrohu");
    await submit(true);
    await page.getByText("Kontrollo email-in", { exact: true }).waitFor();
    await press("Kyçu");
    await submit();
    await profile();
    await backToRecipes();
  });
  await t.test("registration returning an immediate session", async () => {
    await openAccount();
    await logout();
    auth.allowImmediateSignup();
    await press("Regjistrohu");
    await submit(true);
    await profile();
    await backToRecipes();
  });
  await t.test("entry from the refrigerator with a recipe detail still open", async () => {
    await page.getByRole("link", { name: /Test recipe/ }).click();
    await at("/artikull/1");
    await page.getByText("Frigoriferi", { exact: true }).filter({ visible: true }).click();
    await at("/");
    await openAccount();
    await profile();
    await backToRecipes();
  });
  await t.test("direct Account link with a restored session", async () => {
    await open("/llogaria");
    await profile();
    await backToRecipes();
  });
  await t.test("guest Add resumes at the editor after login", async () => {
    await openAccount();
    await logout();
    await backToRecipes();
    await press("+ Shto një recetë");
    await at("/kycu");
    await submit();
    await at("/shto");
    await press("Anulo");
    await recipes();
  });
  await t.test("direct login without Account in history or an allowed return target", async () => {
    await openAccount();
    await logout();
    await open("/kycu?pas=untrusted");
    await submit();
    await profile();
    await backToRecipes();
  });
  await t.test("guests can cancel a form or go straight to Recipes", async () => {
    await openAccount();
    await logout();
    await press("Kyçu");
    await at("/kycu");
    await headerBack();
    await at("/llogaria");
    await press("Regjistrohu");
    await press("Vazhdo me recetat");
    await recipes();
  });
});
