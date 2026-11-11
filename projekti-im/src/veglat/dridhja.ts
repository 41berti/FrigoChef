import * as Haptics from "expo-haptics";

// Dridhjet e telefonit (haptics). Përdoren rrallë, vetëm te veprimet kryesore,
// që përdoruesi ta ndiejë se prekja u regjistrua.
// .catch(): në pajisjet pa motor dridhjeje thirrja dështon, dhe atë gabim e injorojmë.

// Dridhje shumë e shkurtër kur zgjidhet ose hiqet një përbërës.
export function dridhjeZgjedhjeje() {
  Haptics.selectionAsync().catch(() => {});
}

// Dridhje suksesi kur receta ruhet në Supabase.
export function dridhjeSuksesi() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}
