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
    id: "1", titulli: "Test recipe", koha_minuta: 10, perberesit: ["Vezë"], hapat: ["Test step"],
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
  const page = await browser.newPage({ viewport: { width: 480, height: 850 } });
  const auth = await mockSupabase(page);
  const button = name => page.getByRole("button", { name, exact: true }).filter({ visible: true });
  const press = name => button(name).click();
  const at = path => page.waitForFunction(path => location.pathname === path, path);
  const open = path => page.goto(origin + path);
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

  await t.test("login from the refrigerator", async () => {
    await open("/");
    await openAccount();
    await press("Kyçu");
    await submit();
    await profile();
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
