import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Keyboard, Platform, Pressable, ScrollView, StyleSheet, View, useWindowDimensions,
} from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Butoni from "@/components/Butoni";
import Chip from "@/components/Chip";
import Fusha from "@/components/Fusha";
import Ikona from "@/components/Ikona";
import KartelaPerberesi from "@/components/KartelaPerberesi";
import Teksti from "@/components/Teksti";
import {
  kategoriteEPerberesve, kerkoPerberesit, normalizoEmrin, perberesiMeId,
  type KategoriaPerberesit,
} from "@/data/perberesit";
import { usePreferencat } from "@/gjendja/preferencat";
import { useZgjedhja } from "@/gjendja/zgjedhja";
import { hapesira, permasat, rrezet, useNgjyrat } from "@/tema/tema";
import { dridhjeZgjedhjeje } from "@/veglat/dridhja";
import { useLevizjeReduktuar } from "@/veglat/useLevizjeReduktuar";

const filtrat = ["all", ...kategoriteEPerberesve] as const;

export default function Frigoriferi() {
  const { gjuha, t } = usePreferencat();
  const { zgjedhur, teShtuar, nderroPerberesin, shtoPerberesin } = useZgjedhja();
  const [kerkimi, setKerkimi] = useState("");
  const [kategoria, setKategoria] = useState<KategoriaPerberesit | "all">("all");
  // null kur formulari është i mbyllur. Vargu bosh është një formular i hapur.
  const [hyrjaManuale, setHyrjaManuale] = useState<string | null>(null);
  const n = useNgjyrat();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, fontScale } = useWindowDimensions();
  const reduktuar = useLevizjeReduktuar();

  const filtruar = kategoria === "all" ? undefined : kategoria;
  const grupet = useMemo(() => {
    const rezultatet = kerkoPerberesit(kerkimi, filtruar);
    return kategoriteEPerberesve
      .map((id) => ({ id, perberesit: rezultatet.filter((p) => p.category === id) }))
      .filter((grupi) => grupi.perberesit.length > 0);
  }, [kerkimi, filtruar]);
  const zgjedhja = useMemo(() => new Set(zgjedhur), [zgjedhur]);
  const kerkimiNormal = normalizoEmrin(kerkimi);
  const manualet = !filtruar || filtruar === "other"
    ? teShtuar.filter((p) => normalizoEmrin(p.emri).includes(kerkimiNormal))
    : [];
  const numri = zgjedhur.length;

  const gjeresiaEBrendshme = Math.min(width, permasat.gjeresiaMaksimale) - hapesira.xl * 2;
  const gjeresiaMinimale = 94 * Math.max(1, fontScale);
  const kolonat = Math.max(1, Math.min(5, Math.floor(
    (gjeresiaEBrendshme + hapesira.s) / (gjeresiaMinimale + hapesira.s),
  )));
  const gjeresiaEKarteles = Math.floor((gjeresiaEBrendshme - (kolonat - 1) * hapesira.s) / kolonat);

  const prekPerberesin = useCallback((id: string) => {
    dridhjeZgjedhjeje();
    nderroPerberesin(id);
  }, [nderroPerberesin]);

  function ruajManualisht() {
    if (hyrjaManuale === null || !normalizoEmrin(hyrjaManuale)) return;
    shtoPerberesin(hyrjaManuale);
    dridhjeZgjedhjeje();
    setHyrjaManuale(null);
    setKerkimi("");
    setKategoria("all");
    Keyboard.dismiss();
  }

  return (
    <View style={styles.ekrani}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.permbajtja}
      >
        <View style={styles.koka}>
          <Teksti lloji="titullIMadh" accessibilityRole="header">{t("fridge.title")}</Teksti>
          <Teksti ngjyra="tekstiDytesor">{t("fridge.hint")}</Teksti>
        </View>

        <View style={styles.kerkimi}>
          <Fusha
            etiketa={t("fridge.search")}
            etiketeEDukshme={false}
            placeholder={t("fridge.search")}
            value={kerkimi}
            onChangeText={setKerkimi}
            autoCapitalize="none"
            maxLength={60}
            returnKeyType="search"
            style={[styles.kerkimiInput, { backgroundColor: n.mbushja }]}
          />
          <View style={styles.kerkimiIkona} pointerEvents="none">
            <Ikona emri="kerko" />
          </View>
          {kerkimi.length > 0 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("fridge.clearSearch")}
              onPress={() => setKerkimi("")}
              style={styles.pastro}
            >
              <Ikona emri="hiq" />
            </Pressable>
          )}
        </View>

        {numri > 0 && (
          <View style={styles.grupi}>
            <Teksti lloji="dytesorITheksuar" accessibilityRole="header">{t("fridge.selection")}</Teksti>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.shiriti}
            >
              {zgjedhur.map((id) => {
                const emri = perberesiMeId(id)?.names[gjuha] ?? teShtuar.find((p) => p.id === id)?.emri;
                return emri && (
                  <Chip
                    key={id}
                    lloji="heq"
                    titulli={emri}
                    etiketa={t("fridge.remove", { name: emri })}
                    onPress={() => prekPerberesin(id)}
                  />
                );
              })}
            </ScrollView>
          </View>
        )}

        <View style={styles.grupi}>
          <View style={styles.titulliIKatalogut}>
            <Teksti lloji="titull" accessibilityRole="header">{t("fridge.catalog")}</Teksti>
            {hyrjaManuale === null && (
              <Pressable
                accessibilityRole="button"
                onPress={() => setHyrjaManuale(kerkimi.trim().slice(0, 40))}
                style={({ pressed }) => [styles.shtoManualisht, pressed && styles.shtypur]}
              >
                <Ikona emri="shto" madhesia={16} ngjyra="primareTeksti" />
                <Teksti lloji="dytesorITheksuar" ngjyra="primareTeksti">{t("fridge.more")}</Teksti>
              </Pressable>
            )}
          </View>

          {hyrjaManuale !== null && (
            <View style={[styles.formaManuale, { backgroundColor: n.mbushja }]}>
              <Fusha
                etiketa={t("fridge.custom")}
                placeholder={t("fridge.example")}
                value={hyrjaManuale}
                onChangeText={setHyrjaManuale}
                onSubmitEditing={ruajManualisht}
                returnKeyType="done"
                autoCapitalize="none"
                autoFocus
                maxLength={40}
              />
              <View style={styles.veprimet}>
                <Butoni lloji="tekst" titulli={t("common.cancel")} onPress={() => setHyrjaManuale(null)} />
                <Butoni titulli={t("fridge.add")} onPress={ruajManualisht} iCaktivizuar={!normalizoEmrin(hyrjaManuale)} />
              </View>
            </View>
          )}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.shiriti}
          >
            {filtrat.map((id) => (
              <Chip
                key={id}
                lloji="filter"
                titulli={t(`ingredientCategory.${id}`)}
                iZgjedhur={kategoria === id}
                onPress={() => setKategoria(id)}
              />
            ))}
          </ScrollView>
        </View>

        {grupet.map(({ id, perberesit }) => (
          <View key={id} style={styles.grupi}>
            <Teksti lloji="nentitull" accessibilityRole="header">{t(`ingredientCategory.${id}`)}</Teksti>
            <View style={styles.rrjeta}>
              {perberesit.map((p) => (
                <KartelaPerberesi
                  key={p.id}
                  id={p.id}
                  emri={p.names[gjuha]}
                  emoji={p.emoji}
                  ilustrimi={p.illustration}
                  gjeresia={gjeresiaEKarteles}
                  zgjedhur={zgjedhja.has(p.id)}
                  reduktuar={reduktuar}
                  onToggle={prekPerberesin}
                />
              ))}
            </View>
          </View>
        ))}

        {manualet.length > 0 && (
          <View style={styles.grupi}>
            <Teksti lloji="nentitull" accessibilityRole="header">{t("fridge.manual")}</Teksti>
            <View style={styles.rrjeta}>
              {manualet.map((p) => (
                <KartelaPerberesi
                  key={p.id}
                  id={p.id}
                  emri={p.emri}
                  gjeresia={gjeresiaEKarteles}
                  zgjedhur={zgjedhja.has(p.id)}
                  reduktuar={reduktuar}
                  onToggle={prekPerberesin}
                />
              ))}
            </View>
          </View>
        )}

        {grupet.length === 0 && manualet.length === 0 && (
          <Teksti ngjyra="tekstiDytesor" accessibilityLiveRegion="polite">{t("fridge.noResults")}</Teksti>
        )}
      </ScrollView>

      <View
        style={[
          styles.fundi,
          {
            backgroundColor: n.siperfaqja,
            borderTopColor: n.kufiri,
            paddingBottom: hapesira.m + (Platform.OS === "ios" ? insets.bottom : 0),
          },
        ]}
      >
        <View style={styles.fundiBrenda}>
          <View accessibilityLiveRegion="polite" aria-live="polite">
            <Animated.View
              key={numri}
              style={reduktuar ? undefined : {
                animationName: {
                  from: { opacity: 0.75, transform: [{ translateY: 3 }] },
                  to: { opacity: 1, transform: [{ translateY: 0 }] },
                },
                animationDuration: 140,
              }}
            >
              <Teksti
                lloji="dytesorITheksuar"
                ngjyra={numri > 0 ? "primareTeksti" : "tekstiDytesor"}
                style={styles.neMes}
              >
                {numri > 0 ? t("fridge.selected", { count: numri }) : t("fridge.empty")}
              </Teksti>
            </Animated.View>
          </View>
          <Butoni titulli={t("fridge.show")} onPress={() => router.push("/lista")} iCaktivizuar={numri === 0} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ekrani: { flex: 1 },
  permbajtja: {
    alignSelf: "center",
    gap: hapesira.xl,
    maxWidth: permasat.gjeresiaMaksimale,
    padding: hapesira.xl,
    width: "100%",
  },
  koka: { gap: hapesira.xs },
  kerkimi: { position: "relative" },
  kerkimiInput: { paddingLeft: permasat.prekjaMinimale, paddingRight: permasat.prekjaMinimale },
  kerkimiIkona: { bottom: 0, justifyContent: "center", left: hapesira.l, position: "absolute", top: 0 },
  pastro: {
    alignItems: "center", bottom: 0, justifyContent: "center", position: "absolute", right: 0,
    top: 0, width: permasat.prekjaMinimale,
  },
  grupi: { gap: hapesira.s },
  titulliIKatalogut: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  shtoManualisht: { alignItems: "center", flexDirection: "row", gap: hapesira.xs, minHeight: permasat.prekjaMinimale },
  shiriti: { alignItems: "center", gap: hapesira.s },
  formaManuale: { borderRadius: rrezet.madhe, gap: hapesira.s, padding: hapesira.m },
  veprimet: { flexDirection: "row", flexWrap: "wrap", gap: hapesira.s, justifyContent: "flex-end" },
  rrjeta: { flexDirection: "row", flexWrap: "wrap", gap: hapesira.s },
  fundi: { borderTopWidth: 1, paddingHorizontal: hapesira.xl, paddingTop: hapesira.m },
  fundiBrenda: {
    alignSelf: "center",
    gap: hapesira.s,
    maxWidth: permasat.gjeresiaMaksimale,
    width: "100%",
  },
  neMes: { textAlign: "center" },
  shtypur: { opacity: 0.72 },
});
