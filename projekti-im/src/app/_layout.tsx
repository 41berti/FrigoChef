import { Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useTemaENavigimit } from "@/tema/navigimi";

export default function RootLayout() {
  const tema = useTemaENavigimit();

  return (
    // ThemeProvider ua jep ngjyrat tona header-ave dhe sfondit të çdo ekrani.
    <ThemeProvider value={tema}>
      <Stack screenOptions={{ headerShadowVisible: false }}>
        {/* Titulli në krye të ekranit (përndryshe shfaqet "index") */}
        <Stack.Screen name="index" options={{ title: "Ballina" }} />
        <Stack.Screen name="artikull/[id]" options={{ title: "Detajet" }} />
        {/* presentation: "modal" e hap ekranin nga poshtë, mbi listën. */}
        <Stack.Screen name="shto" options={{ title: "Recetë e re", presentation: "modal" }} />
      </Stack>
      {/* Ikonat e orës dhe baterisë bëhen të bardha në dark mode. */}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
