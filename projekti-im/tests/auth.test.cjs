const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

// Compile the actual TypeScript and inject only the external services. No network,
// credentials, email delivery or database mutation is involved in this suite.
function load(file, imports = {}) {
  const filename = path.join(__dirname, "..", file);
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
  });
  const module = { exports: {} };
  vm.runInThisContext(`(function(require,module,exports){${outputText}\n})`, {
    filename,
  })(
    (name) => {
      if (!(name in imports)) throw new Error(`Unexpected import: ${name}`);
      return imports[name];
    },
    module,
    module.exports,
  );
  return module.exports;
}

function memoryStore() {
  const values = new Map();
  return {
    values,
    async getItem(key) {
      return values.get(key) ?? null;
    },
    async setItem(key, value) {
      values.set(key, value);
    },
    async removeItem(key) {
      values.delete(key);
    },
  };
}

const { krijoRuajtjenMePjese } = load("src/data/ruajtjaMePjese.ts");

test("large Unicode sessions survive a fresh storage adapter and logout removes them", async () => {
  const disk = memoryStore();
  const session = JSON.stringify({
    access_token: "a".repeat(3000),
    user: { name: "🥗ë".repeat(1200) },
  });
  await krijoRuajtjenMePjese(disk).setItem("session", session);
  for (const value of disk.values.values()) assert.ok(Buffer.byteLength(value, "utf8") < 2048);
  const restarted = krijoRuajtjenMePjese(disk);
  assert.equal(await restarted.getItem("session"), session);
  await restarted.removeItem("session");
  assert.equal(await restarted.getItem("session"), null);
  assert.equal(disk.values.size, 0);
});

test("a failed refresh write preserves the previous complete session", async () => {
  const disk = memoryStore();
  const storage = krijoRuajtjenMePjese(disk);
  await storage.setItem("session", "old session");
  const setItem = disk.setItem;
  let writes = 0;
  disk.setItem = async (...args) => {
    if (++writes === 2) throw new Error("keychain full");
    await setItem(...args);
  };
  await assert.rejects(storage.setItem("session", "new session".repeat(300)), /keychain full/);
  assert.equal(await storage.getItem("session"), "old session");
  assert.equal(disk.values.size, 2);
});

test("replacement removes old token chunks and incomplete/corrupt data is reported", async () => {
  const disk = memoryStore();
  const storage = krijoRuajtjenMePjese(disk);
  await storage.setItem("session", "old".repeat(3000));
  await storage.setItem("session", "new");
  assert.equal(disk.values.size, 2);
  const chunkKey = [...disk.values.keys()].find((key) => key !== "session");
  disk.values.delete(chunkKey);
  await assert.rejects(storage.getItem("session"), /paplotë/);
  disk.values.set("session", "{}");
  await assert.rejects(storage.getItem("session"), /lexohet/);
});

test("registration validation and login keep passwords intact", async () => {
  const calls = [];
  const auth = {
    async signInWithPassword(value) {
      calls.push(value);
      return { error: null };
    },
    async signUp(value) {
      calls.push(value);
      return { data: { session: null }, error: null };
    },
    async signOut(value) {
      calls.push(value);
      return { error: null };
    },
  };
  const api = load("src/data/llogaria.ts", {
    "@/data/supabase": { supabase: { auth } },
  });
  assert.ok(api.validoLlogarine("bad", "abcdefgh", true, "abcdefgh"));
  assert.ok(api.validoLlogarine("a@b.com", "short", true, "short"));
  assert.ok(api.validoLlogarine("a@b.com", "abcdefgh", true, "different"));
  assert.equal(api.validoLlogarine("a@b.com", "old", false), null);
  await api.kycu(" a@b.com ", " password with spaces ");
  assert.deepEqual(calls[0], {
    email: "a@b.com",
    password: " password with spaces ",
  });
  assert.deepEqual(await api.regjistrohu("a@b.com", "abcdefgh"), {
    duhetKonfirmim: true,
  });
  auth.signUp = async () => ({ data: { session: { user: {} } }, error: null });
  assert.deepEqual(await api.regjistrohu("a@b.com", "abcdefgh"), {
    duhetKonfirmim: false,
  });
  await api.dilNgaLlogaria();
  assert.deepEqual(calls.at(-1), { scope: "local" });
  const failure = {
    code: "invalid_credentials",
    message: "private server detail",
  };
  auth.signInWithPassword = async () => ({ error: failure });
  await assert.rejects(api.kycu("a@b.com", "bad"), (error) => error === failure);
  assert.ok(!api.mesazhiIGabimit(failure).includes("private server"));
  assert.match(api.mesazhiIGabimit({ code: "email_not_confirmed" }), /Konfirmo/);
});

test("recipe mutations deny guests, bind the verified owner and filter deletion", async () => {
  let user = null;
  let insert;
  const filters = [];
  let touched = 0;
  const query = {
    delete() {
      return this;
    },
    eq(...value) {
      filters.push(value);
      return this;
    },
    select() {
      return { data: [{ id: "new" }], error: null };
    },
    insert(value) {
      insert = value;
      return { error: null };
    },
  };
  const supabase = {
    auth: {
      async getUser() {
        return { data: { user }, error: null };
      },
    },
    from() {
      touched++;
      return query;
    },
  };
  const api = load("src/data/recetat.ts", { "@/data/supabase": { supabase } });
  assert.ok((await api.shtoReceten({})).error);
  assert.ok((await api.fshiReceten("new")).error);
  assert.equal(touched, 0);
  user = { id: "owner-a" };
  await api.shtoReceten({
    titulli: "Test",
    koha_minuta: 5,
    perberesit: ["vezë"],
    hapat: [],
    pronari_id: "owner-b",
    id: "1",
  });
  assert.equal(insert.pronari_id, "owner-a");
  assert.equal(insert.id, undefined);
  assert.ok((await api.fshiReceten("1")).error);
  await api.fshiReceten("new");
  assert.deepEqual(filters, [
    ["id", "new"],
    ["pronari_id", "owner-a"],
  ]);
  assert.equal(api.mundTeFshihet({ id: "new", pronari_id: "owner-b" }, user.id), false);
  assert.equal(api.mundTeFshihet({ id: "new", pronari_id: null }, user.id), false);
  assert.equal(api.mundTeFshihet({ id: "new" }, user.id), false);
  assert.equal(api.mundTeFshihet({ id: "new", pronari_id: user.id }), false);
  assert.equal(api.mundTeFshihet({ id: "1", pronari_id: user.id }, user.id), false);
  assert.equal(api.mundTeFshihet({ id: "new", pronari_id: user.id }, user.id), true);
});

test("existing refrigerator matching and legacy recipes remain supported", () => {
  const api = load("src/data/perputhja.ts");
  const recipes = [
    { id: "legacy", perberesit: [], koha_minuta: 1 },
    { id: "complete", perberesit: ["Vezë"], koha_minuta: 10 },
    { id: "partial", perberesit: ["vezë", "djathë"], koha_minuta: 5 },
  ];
  assert.deepEqual(
    api.gjejPerputhjet(recipes, ["vezë"]).map((x) => x.receta.id),
    ["complete", "partial"],
  );
});

test("the installed Supabase SDK persists login, restores it in a new client, and clears logout", async (t) => {
  const { createClient } = require("@supabase/supabase-js");
  const disk = memoryStore();
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
  const jwt = `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ exp: Math.floor(Date.now() / 1000) + 3600, sub: "owner-a" })}.test-signature`;
  const user = {
    id: "owner-a",
    email: "test@example.invalid",
    aud: "authenticated",
    role: "authenticated",
  };
  let logouts = 0;
  const mockFetch = async (url) => {
    if (String(url).includes("/logout")) {
      logouts++;
      return new Response(null, { status: 204 });
    }
    assert.ok(String(url).includes("/token?grant_type=password"));
    return new Response(
      JSON.stringify({
        access_token: jwt,
        refresh_token: "test-refresh",
        token_type: "bearer",
        expires_in: 3600,
        user,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  };
  const makeClient = () =>
    createClient("https://test.example.invalid", "test-public-key", {
      auth: {
        storage: krijoRuajtjenMePjese(disk),
        persistSession: true,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: { fetch: mockFetch },
    });
  const first = makeClient();
  t.after(() => first.auth.stopAutoRefresh());
  const result = await first.auth.signInWithPassword({
    email: user.email,
    password: "test-only-password",
  });
  assert.equal(result.error, null);
  assert.ok(disk.values.size > 0);
  const restarted = makeClient();
  t.after(() => restarted.auth.stopAutoRefresh());
  assert.equal((await restarted.auth.getSession()).data.session.user.email, user.email);
  assert.equal((await restarted.auth.signOut({ scope: "local" })).error, null);
  assert.equal(logouts, 1);
  assert.equal((await restarted.auth.getSession()).data.session, null);
  assert.equal(disk.values.size, 0);
});

test("auth provider ignores stale bootstrap results and cleans up auth/AppState listeners", async () => {
  const states = [];
  let effect;
  let listener;
  let finishBootstrap;
  let unsubscribed = 0;
  let removed = 0;
  let refreshStarts = 0;
  let refreshStops = 0;
  const react = {
    createContext: () => ({ Provider: "provider" }),
    useContext: () => null,
    useState(value) {
      const index = states.push(value) - 1;
      return [
        value,
        (next) => {
          states[index] = typeof next === "function" ? next(states[index]) : next;
        },
      ];
    },
    useEffect(callback) {
      effect = callback;
    },
  };
  const api = load("src/gjendja/autentikimi.tsx", {
    react,
    "react/jsx-runtime": { jsx: () => null },
    "react-native": {
      Platform: { OS: "ios" },
      AppState: {
        currentState: "active",
        addEventListener: () => ({
          remove() {
            removed++;
          },
        }),
      },
    },
    "@/data/llogaria": { mesazhiIGabimit: () => "error" },
    "@/data/supabase": {
      supabase: {
        auth: {
          onAuthStateChange(callback) {
            listener = callback;
            return {
              data: {
                subscription: {
                  unsubscribe() {
                    unsubscribed++;
                  },
                },
              },
            };
          },
          getSession() {
            return new Promise((resolve) => {
              finishBootstrap = resolve;
            });
          },
          async startAutoRefresh() {
            refreshStarts++;
          },
          async stopAutoRefresh() {
            refreshStops++;
          },
        },
      },
    },
  });
  api.AutentikimiProvider({ children: null });
  const cleanup = effect();
  const fresh = { user: { id: "fresh" } };
  listener("SIGNED_IN", fresh);
  finishBootstrap({
    data: { session: { user: { id: "stale" } } },
    error: null,
  });
  await Promise.resolve();
  assert.equal(states[0], fresh);
  assert.equal(states[1], false);
  assert.equal(refreshStarts, 1);
  cleanup();
  assert.equal(unsubscribed, 1);
  assert.equal(removed, 1);
  assert.equal(refreshStops, 1);
  listener("SIGNED_OUT", null);
  assert.equal(states[0], fresh);
});
