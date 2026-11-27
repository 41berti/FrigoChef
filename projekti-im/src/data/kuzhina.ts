import AsyncStorage from "@react-native-async-storage/async-storage";

import { normalizoPajisjet, type IdPajisjeje } from "@/data/pajisjet";
import { krijoRuajtjen } from "@/data/preferencat";

// null = pa konfigurim. [] = përdoruesi ruajti një kuzhinë pa pajisje.
export type KonfigurimKuzhine = readonly IdPajisjeje[] | null;
const celesi = "frigochef.equipment.v1";
const shkruaj = krijoRuajtjen<readonly IdPajisjeje[]>((teksti) => AsyncStorage.setItem(celesi, teksti));
let shkrimiIFundit = Promise.resolve();

export function lexoKonfigurimin(teksti: string | null): KonfigurimKuzhine {
  if (teksti === null) return null;
  try {
    const vlera: unknown = JSON.parse(teksti);
    if (!Array.isArray(vlera)) return null;
    const pajisjet = normalizoPajisjet(vlera);
    return vlera.length > 0 && pajisjet.length === 0 ? null : pajisjet;
  } catch {
    return null;
  }
}

export async function merrPajisjet(): Promise<KonfigurimKuzhine> {
  await shkrimiIFundit;
  return lexoKonfigurimin(await AsyncStorage.getItem(celesi));
}

export function ruajPajisjet(ids: readonly IdPajisjeje[]): Promise<void> {
  const shkrimi = shkruaj(normalizoPajisjet(ids));
  shkrimiIFundit = shkrimi.catch(() => {});
  return shkrimi;
}
