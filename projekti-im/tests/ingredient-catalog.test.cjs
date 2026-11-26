const assert = require("node:assert/strict");
const { existsSync } = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");

const load = require("./load.cjs");
const manifest = require("../src/data/katalogu-perberesve.json");
const catalog = load("src/data/perberesit.ts", {
  "./katalogu-perberesve.json": manifest,
});
const matching = load("src/data/perputhja.ts", { "@/data/perberesit": catalog });

test("catalog IDs, aliases and bundled illustrations are unambiguous", () => {
  assert.equal(manifest.schemaVersion, 1);
  const aliases = new Map();
  const ids = new Set();
  const categories = new Set();
  for (const p of manifest.ingredients) {
    assert.match(p.id, /^[a-z]+(?:-[a-z]+)*$/);
    assert.ok(!ids.has(p.id), "duplicate ID: " + p.id);
    ids.add(p.id);
    categories.add(p.category);
    assert.ok(p.emoji);
    for (const label of [p.id, p.names.sq, p.names.en, ...p.aliases.sq, ...p.aliases.en]) {
      const key = catalog.normalizoEmrin(label);
      assert.ok(key);
      assert.equal(aliases.get(key) ?? p.id, p.id, "alias collision: " + label);
      aliases.set(key, p.id);
      assert.equal(catalog.gjejPerberesin(label)?.id, p.id);
    }
    if (p.illustration) {
      const image = path.join(__dirname, "../assets/ingredients", p.illustration + ".png");
      assert.ok(existsSync(image), "missing illustration: " + p.illustration);
    }
  }
  assert.deepEqual([...categories].sort(), [...catalog.kategoriteEPerberesve].sort());
});

test("search uses words, accents, aliases and either language while respecting categories", () => {
  const ids = (query, category) => catalog.kerkoPerberesit(query, category).map((p) => p.id);
  assert.deepEqual(ids("  HUDHER  "), ["garlic"]);
  assert.deepEqual(ids("bell_pepp"), ["bell-pepper"]);
  assert.deepEqual(ids("e\u0308mbël spec"), ["bell-pepper"]);
  assert.deepEqual(ids("courge", "vegetables"), ["zucchini"]);
  assert.deepEqual(ids("courge", "fruit"), []);
  assert.equal(ids("  ").length, manifest.ingredients.length);
  assert.equal(catalog.gjejPerberesin("bell pepp"), undefined);
  assert.equal(catalog.gjejPerberesin("pepper"), undefined);
});

test("old recipe terms map to IDs without rewriting ingredient text", () => {
  const legacy = [
    ["vezë", "eggs", "egg"], ["djathë i bardhë", "white cheese", "white-cheese"],
    ["domate", "tomatoes", "tomato"], ["speca", "peppers", "bell-pepper"],
    ["qepë", "onions", "onion"], ["qumësht", "milk", "milk"], ["kos", "yogurt", "yogurt"],
    ["gjizë", "curd cheese", "curd-cheese"], ["mish pule", "chicken", "chicken"],
    ["oriz", "rice", "rice"], ["miell", "flour", "flour"], ["gjalpë", "butter", "butter"],
    ["karotë", "carrots", "carrot"], ["kastravec", "cucumber", "cucumber"],
    ["hudhër", "garlic", "garlic"], ["kungull i njomë", "zucchini", "zucchini"],
    ["bizele", "peas", "pea"], ["limon", "lemon", "lemon"],
  ];
  for (const [sq, en, id] of legacy) {
    assert.equal(catalog.celesiIPerberesit(sq), id);
    assert.equal(catalog.celesiIPerberesit(en), id);
  }
  assert.deepEqual(matching.ndajPerberesit(
    [" Vezë ", "ORiZ I MBETUR", "Tahini", "qepë e njomë", "vaj ulliri"],
    ["egg", "rice", "custom:tahini", "onion", "cooking-oil"],
  ), {
    ke: [" Vezë ", "Tahini"],
    mungojne: ["ORiZ I MBETUR", "qepë e njomë", "vaj ulliri"],
  });
  assert.equal(catalog.celesiIPerberesit("  Tahini "), "custom:tahini");
  assert.equal(catalog.celesiIPerberesit("__proto__"), "custom:proto");
});
