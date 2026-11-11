import { Stack } from "expo-router";

// Lista është ekrani bazë i këtij tab-i. Kur hapet një lidhje direkt te /shto
// ose /artikull/1, lista vendoset poshtë saj, që butoni "prapa" të kthejë te lista.
export const unstable_settings = { anchor: "recetat" };

// Tab-i "Recetat" ka Stack-un e vet: lista, detajet dhe ekrani "Recetë e re".
export default function RecetatLayout() {
  return (
    <Stack screenOptions={{ headerShadowVisible: false }}>
      {/* headerLargeTitle: titulli i madh i iOS-it, që zvogëlohet kur lëviz lista. */}
      <Stack.Screen name="recetat" options={{ title: "Recetat", headerLargeTitle: true }} />
      <Stack.Screen name="artikull/[id]" options={{ title: "Detajet" }} />
      {/* presentation: "modal" e hap ekranin nga poshtë, mbi listën dhe mbi tab-et. */}
      <Stack.Screen name="shto" options={{ title: "Recetë e re", presentation: "modal" }} />
    </Stack>
  );
}
