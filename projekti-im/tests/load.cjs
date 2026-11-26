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

module.exports = load;
