import { usePreferencat } from "@/gjendja/preferencat";
import { Stack } from "expo-router";

import ButoniLlogaria from "@/components/ButoniLlogaria";

// Lista është ekrani bazë i këtij tab-i. Kur hapet një lidhje direkt te /shto
// ose /artikull/1, lista vendoset poshtë saj, që butoni "prapa" të kthejë te lista.
export const unstable_settings = { anchor: "recetat" };

// Tab-i "Recetat" ka Stack-un e vet: lista, detajet dhe ekrani "Recetë e re".
export default function RecetatLayout() {
  const { t } = usePreferencat();
  return (
    <Stack screenOptions={{ headerShadowVisible: false }}>
      {/* headerLargeTitle: titulli i madh i iOS-it, që zvogëlohet kur lëviz lista. */}
      <Stack.Screen
        name="recetat"
        options={{
          title: t("nav.recipes"),
          headerLargeTitle: true,
          headerRight: () => <ButoniLlogaria />,
        }}
      />
      <Stack.Screen name="artikull/[id]" options={{ title: t("nav.details") }} />
      {/* presentation: "modal" e hap ekranin nga poshtë, mbi listën dhe mbi tab-et. */}
      <Stack.Screen name="shto" options={{ title: t("nav.new"), presentation: "modal" }} />
      <Stack.Screen name="cilesimet" options={{ title: t("settings.title") }} />
      <Stack.Screen name="llogaria" options={{ title: t("nav.account") }} />
      <Stack.Screen name="kycu" options={{ title: t("nav.login") }} />
      <Stack.Screen name="regjistrohu" options={{ title: t("nav.register") }} />
    </Stack>
  );
}
