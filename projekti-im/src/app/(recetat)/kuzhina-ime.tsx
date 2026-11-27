import { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo, ActivityIndicator, Alert, Platform, ScrollView, StyleSheet,
  View, useWindowDimensions,
} from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Butoni from "@/components/Butoni";
import Ikona from "@/components/Ikona";
import KartelaZgjedhjeje from "@/components/KartelaZgjedhjeje";
import Teksti from "@/components/Teksti";
import { merrPajisjet, ruajPajisjet, type KonfigurimKuzhine } from "@/data/kuzhina";
import { kataloguIPajisjeve, normalizoPajisjet, type IdPajisjeje } from "@/data/pajisjet";
import { usePreferencat } from "@/gjendja/preferencat";
import { hapesira, permasat, rrezet, useNgjyrat } from "@/tema/tema";
import { dridhjeSuksesi, dridhjeZgjedhjeje } from "@/veglat/dridhja";
import { useLevizjeReduktuar } from "@/veglat/useLevizjeReduktuar";

const ilustrimet: Record<(typeof kataloguIPajisjeve)[number]["visual"], number> = {
  oven: require("@/assets/equipment/oven.png"),
  cooktop: require("@/assets/equipment/cooktop.png"),
  "air-fryer": require("@/assets/equipment/air-fryer.png"),
  microwave: require("@/assets/equipment/microwave.png"),
  "jug-blender": require("@/assets/equipment/jug-blender.png"),
  toaster: require("@/assets/equipment/toaster.png"),
  "kettle-grill": require("@/assets/equipment/kettle-grill.png"),
  "slow-cooker": require("@/assets/equipment/slow-cooker.png"),
  "pressure-pot": require("@/assets/equipment/pressure-pot.png"),
  "rice-cooker": require("@/assets/equipment/rice-cooker.png"),
  "electric-kettle": require("@/assets/equipment/electric-kettle.png"),
  "food-processor": require("@/assets/equipment/food-processor.png"),
};

type Ngarkimi = "loading" | "ready" | "error";
type Ruajtja = "idle" | "saving" | "saved" | "error";

export default function KuzhinaIme() {
  const { gjuha, t } = usePreferencat();
  const n = useNgjyrat();
  const reduktuar = useLevizjeReduktuar();
  const { width, fontScale } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const [ngarkimi, setNgarkimi] = useState<Ngarkimi>("loading");
  const [prova, setProva] = useState(0);
  const [ruajtur, setRuajtur] = useState<KonfigurimKuzhine>(null);
  const [zgjedhur, setZgjedhur] = useState<readonly IdPajisjeje[]>([]);
  const [ruajtja, setRuajtja] = useState<Ruajtja>("idle");
  const poRuhet = useRef(false);
  const numriIPara = useRef<number | null>(null);

  useEffect(() => {
    let aktiv = true;
    void merrPajisjet().then(
      (konfigurimi) => {
        if (!aktiv) return;
        setRuajtur(konfigurimi);
        setZgjedhur(konfigurimi ?? []);
        setNgarkimi("ready");
      },
      () => { if (aktiv) setNgarkimi("error"); },
    );
    return () => { aktiv = false; };
  }, [prova]);

  const numri = zgjedhur.length;
  const numerimi = t("kitchen.selected", { count: numri });
  const mesazhi = ruajtja === "saved" ? t("kitchen.saved")
    : ruajtja === "error" ? t("kitchen.saveError") : null;
  const paNdryshime = ruajtur !== null && ruajtur.length === numri
    && ruajtur.every((id, i) => id === zgjedhur[i]);
  const gjendja = paNdryshime
    ? t(numri === 0 ? "kitchen.savedEmpty" : "kitchen.savedHere")
    : t(ruajtur === null && numri === 0 ? "kitchen.notConfigured" : "kitchen.unsaved");

  useEffect(() => {
    if (ngarkimi !== "ready" || Platform.OS !== "ios") return;
    if (numriIPara.current !== null && numriIPara.current !== numri) {
      AccessibilityInfo.announceForAccessibility(numerimi);
    }
    numriIPara.current = numri;
  }, [ngarkimi, numri, numerimi]);

  useEffect(() => {
    if (mesazhi && Platform.OS === "ios") AccessibilityInfo.announceForAccessibility(mesazhi);
  }, [mesazhi]);

  function nderroPajisjen(id: IdPajisjeje) {
    if (poRuhet.current) return;
    setZgjedhur((tani) => tani.includes(id)
      ? tani.filter((pajisja) => pajisja !== id)
      : normalizoPajisjet([...tani, id]));
    setRuajtja("idle");
    dridhjeZgjedhjeje();
  }

  async function ruaj(ids: readonly IdPajisjeje[]) {
    if (poRuhet.current) return;
    poRuhet.current = true;
    setRuajtja("saving");
    try {
      await ruajPajisjet(ids);
      setRuajtur(ids);
      setZgjedhur(ids);
      setRuajtja("saved");
      dridhjeSuksesi();
    } catch {
      setRuajtja("error");
    } finally {
      poRuhet.current = false;
    }
  }

  function konfirmoPastrimin() {
    const titulli = t("kitchen.clearTitle");
    const mesazhi = t("kitchen.clearMessage");
    if (Platform.OS === "web") {
      if (window.confirm(`${titulli}\n${mesazhi}`)) void ruaj([]);
      return;
    }
    Alert.alert(titulli, mesazhi, [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("kitchen.clear"), style: "destructive", onPress: () => { void ruaj([]); } },
    ]);
  }

  function ruajZgjedhjen() {
    if (numri === 0 && ruajtur?.length) konfirmoPastrimin();
    else void ruaj(zgjedhur);
  }

  const brenda = Math.min(width, permasat.gjeresiaMaksimale) - hapesira.xl * 2;
  const kolona = Math.max(1, Math.min(4, Math.floor((brenda + hapesira.s) / (104 * fontScale + hapesira.s))));
  const gjeresia = Math.floor((brenda - (kolona - 1) * hapesira.s) / kolona);
  const dukeRuajtur = ruajtja === "saving";

  return (
    <View style={styles.ekrani}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.permbajtja}>
        <View style={[styles.hyrja, { backgroundColor: n.primareEZbehte }]}>
          <View style={styles.hyrjaTeksti}>
            <Teksti lloji="titullIMadh" accessibilityRole="header">{t("kitchen.heading")}</Teksti>
            <Teksti>{t("kitchen.description")}</Teksti>
          </View>
          <Ikona emri="kuzhina" madhesia={28} ngjyra="primareTeksti" />
        </View>

        {ngarkimi === "loading" && (
          <ActivityIndicator color={n.primare} accessibilityLabel={t("kitchen.loading")} />
        )}
        {ngarkimi === "error" && (
          <View style={styles.seksioni}>
            <Teksti ngjyra="gabimi" accessibilityRole="alert">{t("kitchen.loadError")}</Teksti>
            <Butoni titulli={t("common.retry")} onPress={() => {
              setNgarkimi("loading");
              setProva((tani) => tani + 1);
            }} />
          </View>
        )}
        {ngarkimi === "ready" && (
          <View style={styles.seksioni}>
            <View style={styles.kokaEKatalogut}>
              <Teksti lloji="nentitull" accessibilityRole="header">{t("kitchen.equipment")}</Teksti>
              <Butoni
                lloji="tekst" titulli={t("kitchen.clear")} onPress={konfirmoPastrimin}
                iCaktivizuar={dukeRuajtur || (numri === 0 && !ruajtur?.length)}
              />
            </View>
            <View style={styles.rrjeta}>
              {kataloguIPajisjeve.map(({ id, names, visual }) => (
                <KartelaZgjedhjeje
                  key={id}
                  id={id}
                  emri={names[gjuha]}
                  foto={ilustrimet[visual]}
                  gjeresia={gjeresia}
                  zgjedhur={zgjedhur.includes(id)}
                  reduktuar={reduktuar}
                  disabled={dukeRuajtur}
                  onToggle={() => nderroPajisjen(id)}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {ngarkimi === "ready" && (
        <View style={[styles.fundi, {
          backgroundColor: n.siperfaqja, borderTopColor: n.kufiri,
          paddingBottom: hapesira.m + (Platform.OS === "ios" ? bottom : 0),
        }]}>
          <View style={styles.fundiBrenda}>
            <View accessibilityLiveRegion="polite" aria-live="polite">
              <Animated.View key={numri} style={reduktuar ? undefined : {
                animationName: {
                  from: { opacity: 0.75, transform: [{ translateY: 3 }] },
                  to: { opacity: 1, transform: [{ translateY: 0 }] },
                },
                animationDuration: 140,
              }}>
                <Teksti lloji="dytesorITheksuar" ngjyra="primareTeksti" style={styles.neMes}>{numerimi}</Teksti>
              </Animated.View>
            </View>
            <Teksti
              lloji="dytesor"
              ngjyra={ruajtja === "error" ? "gabimi" : mesazhi ? "primareTeksti" : "tekstiDytesor"}
              accessibilityRole={ruajtja === "error" ? "alert" : undefined}
              accessibilityLiveRegion="polite"
              aria-live="polite"
              style={styles.neMes}
            >{mesazhi ?? gjendja}</Teksti>
            <Butoni
              titulli={t(dukeRuajtur ? "kitchen.saving" : "kitchen.save")}
              onPress={ruajZgjedhjen}
              iCaktivizuar={dukeRuajtur || paNdryshime}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ekrani: { flex: 1 },
  permbajtja: {
    alignSelf: "center", width: "100%", maxWidth: permasat.gjeresiaMaksimale,
    padding: hapesira.xl, gap: hapesira.xl,
  },
  hyrja: {
    flexDirection: "row", alignItems: "flex-start", borderRadius: rrezet.madhe,
    padding: hapesira.xl, gap: hapesira.m,
  },
  hyrjaTeksti: { flex: 1, gap: hapesira.s },
  seksioni: { gap: hapesira.s },
  kokaEKatalogut: {
    flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between",
    alignItems: "center", minHeight: permasat.prekjaMinimale,
  },
  rrjeta: { flexDirection: "row", flexWrap: "wrap", gap: hapesira.s },
  fundi: { borderTopWidth: 1, paddingHorizontal: hapesira.xl, paddingTop: hapesira.m },
  fundiBrenda: {
    alignSelf: "center", width: "100%", maxWidth: permasat.gjeresiaMaksimale, gap: hapesira.s,
  },
  neMes: { textAlign: "center" },
});
