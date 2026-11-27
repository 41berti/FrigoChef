const assert = require("node:assert/strict");
const { existsSync } = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");

const load = require("./load.cjs");
const catalog = load("src/data/pajisjet.ts");
const preferences = load("src/data/preferencat.ts");
const key = "frigochef.equipment.v1";

function restore(storage) {
  return load("src/data/kuzhina.ts", {
    "@react-native-async-storage/async-storage": storage,
    "@/data/pajisjet": catalog,
    "@/data/preferencat": preferences,
  });
}

test("the 12 appliances have unique stable IDs, both labels and an illustration", () => {
  const ids = catalog.kataloguIPajisjeve.map((item) => item.id);
  assert.deepEqual(ids, [
    "oven", "stovetop", "air-fryer", "microwave", "blender", "toaster",
    "grill", "slow-cooker", "pressure-cooker", "rice-cooker", "electric-kettle", "food-processor",
  ]);
  for (const item of catalog.kataloguIPajisjeve) {
    assert.match(item.id, /^[a-z]+(?:-[a-z]+)*$/);
    assert.ok(item.names.sq && item.names.en);
    assert.ok(Array.isArray(item.aliases.sq) && Array.isArray(item.aliases.en));
    assert.ok(existsSync(path.join(__dirname, "../assets/equipment", item.visual + ".png")));
  }
  assert.deepEqual(
    catalog.normalizoPajisjet(["pressure-cooker", { id: "grill" }, "oven", "oven", "Furrë", "__proto__"]),
    ["oven", "pressure-cooker"],
  );
});

test("never configured, explicitly empty and invalid storage stay distinct", () => {
  const kitchen = restore({});
  assert.equal(kitchen.lexoKonfigurimin(null), null);
  assert.deepEqual(kitchen.lexoKonfigurimin("[]"), []);
  for (const value of ["null", "invalid JSON", "{}", '["future-device"]']) {
    assert.equal(kitchen.lexoKonfigurimin(value), null);
  }
  assert.deepEqual(kitchen.lexoKonfigurimin('["toaster", "unknown", 12, "oven", "toaster"]'), ["oven", "toaster"]);
});

test("save, restart and clear preserve language and theme in their own record", async () => {
  const disk = new Map([["frigochef.preferences.v1", '{"gjuha":"sq","pamja":"dark"}']]);
  const storage = {
    async getItem(name) { return disk.get(name) ?? null; },
    async setItem(name, value) { disk.set(name, value); },
  };
  const kitchen = restore(storage);
  assert.equal(await kitchen.merrPajisjet(), null);
  await kitchen.ruajPajisjet(["grill", "oven"]);
  assert.deepEqual(await restore(storage).merrPajisjet(), ["oven", "grill"]);
  await kitchen.ruajPajisjet(["stovetop"]);
  assert.equal(disk.get(key), '["stovetop"]');
  await kitchen.ruajPajisjet([]);
  assert.deepEqual(await restore(storage).merrPajisjet(), []);
  assert.equal(disk.get("frigochef.preferences.v1"), '{"gjuha":"sq","pamja":"dark"}');
});

test("failed writes keep the last durable selection and the queue recovers", async () => {
  let disk = '["oven"]';
  let shouldFail = true;
  const storage = {
    async getItem() { return disk; },
    async setItem(_, value) {
      if (shouldFail) throw new Error("disk unavailable");
      disk = value;
    },
  };
  const kitchen = restore(storage);
  await assert.rejects(kitchen.ruajPajisjet([]), /disk unavailable/);
  assert.deepEqual(await kitchen.merrPajisjet(), ["oven"]);
  shouldFail = false;
  const first = kitchen.ruajPajisjet(["toaster"]);
  const last = kitchen.ruajPajisjet(["blender"]);
  assert.deepEqual(await kitchen.merrPajisjet(), ["blender"]);
  await Promise.all([first, last]);
});

test("storage read errors remain distinguishable from an unconfigured kitchen", async () => {
  const kitchen = restore({ async getItem() { throw new Error("read failed"); } });
  await assert.rejects(kitchen.merrPajisjet(), /read failed/);
});
