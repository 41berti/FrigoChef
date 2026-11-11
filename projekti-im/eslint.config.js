// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    // DemoGjendja e ndryshon me qëllim një variabël `let`, për të treguar pse duhet useState.
    // Është punë e ligjëratës, prandaj këtu e fikim rregullin në vend që ta ndryshojmë kodin.
    files: ['src/components/DemoGjendja.tsx'],
    rules: {
      'react-hooks/immutability': 'off',
    },
  },
]);
