import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* Titulli në krye të ekranit (përndryshe shfaqet "index") */}
      <Stack.Screen name="index" options={{ title: "Ballina" }} />
      <Stack.Screen name="artikull/[id]" options={{ title: "Detajet" }} />
    </Stack>
  );
}
