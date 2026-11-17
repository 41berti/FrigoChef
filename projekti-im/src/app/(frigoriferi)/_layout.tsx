import { Stack } from "expo-router";

import ButoniLlogaria from "@/components/ButoniLlogaria";

// Ballina është ekrani bazë i këtij tab-i. Kur hapet një lidhje direkt te /lista
// ose /artikull/1, Ballina vendoset poshtë saj, që butoni "prapa" të kthejë aty.
export const unstable_settings = { anchor: "index" };

// Tab-i "Frigoriferi" ka Stack-un e vet: Ballina, lista me përputhje dhe detajet.
export default function FrigoriferiLayout() {
  return (
    <Stack screenOptions={{ headerShadowVisible: false }}>
      <Stack.Screen
        name="index"
        options={{ title: "FrigoChef", headerRight: () => <ButoniLlogaria /> }}
      />
      {/* headerBackTitle: teksti i butonit "prapa" në iOS, si në skicën 2. */}
      <Stack.Screen
        name="lista"
        options={{
          title: "Recetat për ty",
          headerLargeTitle: true,
          headerBackTitle: "Ballina",
        }}
      />
      {/* Fajlli i detajeve është te dosja (frigoriferi,recetat), pra ekziston në të dy tab-et. */}
      <Stack.Screen name="artikull/[id]" options={{ title: "Detajet" }} />
      <Stack.Screen name="llogaria" options={{ title: "Llogaria" }} />
      <Stack.Screen name="kycu" options={{ title: "Kyçu" }} />
      <Stack.Screen name="regjistrohu" options={{ title: "Regjistrohu" }} />
    </Stack>
  );
}
