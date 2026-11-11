import { Stack } from "expo-router";

// Tab-i "Frigoriferi" ka Stack-un e vet, që lista dhe detajet të hapen brenda tij.
export default function FrigoriferiLayout() {
  return (
    <Stack screenOptions={{ headerShadowVisible: false }}>
      <Stack.Screen name="index" options={{ title: "FrigoChef" }} />
    </Stack>
  );
}
