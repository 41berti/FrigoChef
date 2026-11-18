const { test } = require("node:test");
const assert = require("node:assert/strict");
const load = require("./load.cjs");

const { gjuhaEPajisjes, temaEfektive, lexoPreferencat, krijoRuajtjen } =
  load("src/data/preferencat.ts");
const sq = load("src/i18n/sq.ts");
const en = load("src/i18n/en.ts");
const { perkthyesi } = load("src/i18n/perkthimi.ts", {
  "i18n-js": require("i18n-js"),
  "./sq": sq,
  "./en": en,
});

test("device preference order and Albanian fallback", () => {
  assert.equal(gjuhaEPajisjes(["hu", "en", "sq"]), "en");
  assert.equal(gjuhaEPajisjes(["sq", "en"]), "sq");
  assert.equal(gjuhaEPajisjes([null, "hu"]), "sq");
  assert.equal(gjuhaEPajisjes([]), "sq");
});

test("preferences recover independently from missing, malformed and invalid data", () => {
  for (const raw of [null, "{", "null", "[]", "123", "{}"]) {
    assert.deepEqual(lexoPreferencat(raw), { gjuha: null, pamja: "system" });
  }
  assert.deepEqual(lexoPreferencat('{"gjuha":"en","pamja":"green"}'), {
    gjuha: "en",
    pamja: "system",
  });
  assert.deepEqual(lexoPreferencat('{"gjuha":"fr","pamja":"dark"}'), {
    gjuha: null,
    pamja: "dark",
  });
});

test("system tracks OS while explicit appearance overrides both OS modes", () => {
  for (const os of ["light", "dark"]) {
    assert.equal(temaEfektive("system", os), os);
    for (const mode of ["light", "dark"]) assert.equal(temaEfektive(mode, os), mode);
  }
  assert.equal(temaEfektive("system", null), "light");
});

test("rapid writes stay in order and recover after a rejected write", async () => {
  let stored;
  let attempts = 0;
  const save = krijoRuajtjen(async (v) => {
    const n = ++attempts;
    await new Promise((resolve) => setImmediate(resolve));
    if (n === 2) throw Error("storage unavailable");
    stored = v;
  });
  const first = save({ gjuha: "sq", pamja: "dark" });
  const failed = assert.rejects(save({ gjuha: "en", pamja: "dark" }));
  const last = save({ gjuha: "en", pamja: "light" });
  await Promise.all([first, failed, last]);
  assert.deepEqual(lexoPreferencat(stored), { gjuha: "en", pamja: "light" });
});

test("catalogs cover the same keys and preserve interpolation tokens", () => {
  function compare(a, b) {
    if (typeof a === "string") {
      assert.ok(typeof b === "string" && b.length > 0);
      assert.deepEqual((a.match(/%\{\w+\}/g) ?? []).sort(), (b.match(/%\{\w+\}/g) ?? []).sort());
      return;
    }
    assert.deepEqual(Object.keys(a).sort(), Object.keys(b).sort());
    for (const key of Object.keys(a)) compare(a[key], b[key]);
  }
  compare(sq.default, en.default);
});

test("real translator handles plural counts, arbitrary recipe titles and session feedback", () => {
  const t = perkthyesi("en");
  for (const n of [0, 1, 2]) {
    assert.equal(
      t("fridge.selected", { count: n }),
      n + (n === 1 ? " ingredient selected" : " ingredients selected"),
    );
  }
  assert.equal(
    t("detail.warning", { name: "Speca & vezë" }),
    "“Speca & vezë” will be permanently deleted.",
  );
  assert.equal(t("pantry.vezë"), "eggs");
  assert.match(perkthyesi("sq")("auth.unconfirmed"), /Konfirmo/);
  assert.match(t("auth.unconfirmed"), /Confirm your email/);
});
