import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

import Ikona from "@/components/Ikona";
import Teksti from "@/components/Teksti";
import type { Pamja } from "@/data/preferencat";
import { usePreferencat } from "@/gjendja/preferencat";
import { hapesira, permasat, rrezet, shkronjat, useNgjyrat } from "@/tema/tema";
import { dridhjeZgjedhjeje } from "@/veglat/dridhja";
import { useLevizjeReduktuar } from "@/veglat/useLevizjeReduktuar";

type OpsionProps = {
  label: string;
  aktiv: boolean;
  onPress: () => void;
  ikona?: Pamja;
  ms: number;
};

function Opsion({ label, aktiv, onPress, ikona, ms }: OpsionProps) {
  const n = useNgjyrat();
  const ngjyra = aktiv ? "primareTeksti" : "teksti";
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: aktiv }}
      aria-checked={aktiv}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.prekja, pressed && styles.shtypur]}
    >
      <Animated.View
        style={[
          styles.opsioni,
          {
            backgroundColor: aktiv ? n.primareEZbehte : n.siperfaqja,
            borderColor: aktiv ? n.primareTeksti : n.kufiriIFushes,
            transitionProperty: ["backgroundColor", "borderColor"],
            transitionDuration: ms,
          },
        ]}
      >
        {ikona && <Ikona emri={ikona} madhesia={24} ngjyra={ngjyra} />}
        <View style={styles.emri}>
          <Animated.Text
            style={[
              shkronjat.dytesorITheksuar,
              styles.teksti,
              {
                color: n[ngjyra],
                transitionProperty: "color",
                transitionDuration: ms,
              },
            ]}
          >
            {label}
          </Animated.Text>
          <Animated.View
            style={{
              opacity: aktiv ? 1 : 0,
              transitionProperty: "opacity",
              transitionDuration: ms,
            }}
          >
            <Ikona emri="po" ngjyra="primareTeksti" madhesia={16} />
          </Animated.View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default function Cilesimet() {
  const { gjuha, pamja, ndrysho, t, gabimRuajtjeje } = usePreferencat();
  const n = useNgjyrat();
  const ms = useLevizjeReduktuar() ? 0 : 220;
  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: n.sfondi,
        transitionProperty: "backgroundColor",
        transitionDuration: ms,
      }}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.permbajtja}
      >
        <Teksti lloji="etiketa" ngjyra="tekstiDytesor" accessibilityRole="header">
          {t("settings.general")}
        </Teksti>
        <Link href="/kuzhina-ime" asChild>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={t("kitchen.title")}
            accessibilityHint={t("kitchen.openHint")}
            style={({ pressed }) => [
              styles.kuzhina,
              { backgroundColor: n.siperfaqja, borderColor: n.kufiriIFushes },
              pressed && styles.shtypur,
            ]}
          >
            <View style={[styles.ikonaKuzhines, { backgroundColor: n.primareEZbehte }]}>
              <Ikona emri="kuzhina" madhesia={24} ngjyra="primareTeksti" />
            </View>
            <View style={styles.pershkrimiKuzhines}>
              <Teksti lloji="trupiITheksuar">{t("kitchen.title")}</Teksti>
              <Teksti lloji="dytesor" ngjyra="tekstiDytesor">{t("kitchen.openHint")}</Teksti>
            </View>
            <Ikona emri="shigjeta" />
          </Pressable>
        </Link>
        <View style={styles.seksioni}>
          <Teksti lloji="nentitull" accessibilityRole="header">
            {t("settings.language")}
          </Teksti>
          <View
            accessibilityRole="radiogroup"
            accessibilityLabel={t("settings.language")}
            style={styles.grupi}
          >
            <Opsion
              label="Shqip"
              aktiv={gjuha === "sq"}
              onPress={() => ndrysho({ gjuha: "sq" })}
              ms={ms}
            />
            <Opsion
              label="English"
              aktiv={gjuha === "en"}
              onPress={() => ndrysho({ gjuha: "en" })}
              ms={ms}
            />
          </View>
        </View>
        <View style={styles.seksioni}>
          <Teksti lloji="nentitull" accessibilityRole="header">
            {t("settings.appearance")}
          </Teksti>
          <View
            accessibilityRole="radiogroup"
            accessibilityLabel={t("settings.appearance")}
            style={styles.grupi}
          >
            {(["system", "light", "dark"] as const).map((v) => (
              <Opsion
                key={v}
                label={t(`settings.${v}`)}
                ikona={v}
                aktiv={pamja === v}
                ms={ms}
                onPress={() => {
                  if (v !== pamja) dridhjeZgjedhjeje();
                  ndrysho({ pamja: v });
                }}
              />
            ))}
          </View>
        </View>
        {gabimRuajtjeje && (
          <Teksti ngjyra="gabimi" accessibilityRole="alert">
            {t("settings.storage")}
          </Teksti>
        )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  permbajtja: {
    alignSelf: "center",
    width: "100%",
    maxWidth: permasat.gjeresiaMaksimale,
    padding: hapesira.xl,
    gap: hapesira.xxl,
  },
  kuzhina: {
    alignItems: "center", borderRadius: rrezet.madhe, borderWidth: 1,
    flexDirection: "row", gap: hapesira.m, padding: hapesira.l,
  },
  ikonaKuzhines: {
    alignItems: "center", borderRadius: rrezet.mesme, height: permasat.prekjaMinimale,
    justifyContent: "center", width: permasat.prekjaMinimale,
  },
  pershkrimiKuzhines: { flex: 1, gap: hapesira.xs },
  seksioni: { gap: hapesira.m },
  grupi: { flexDirection: "row", flexWrap: "wrap", gap: hapesira.s },
  prekja: { flexGrow: 1, flexBasis: 88 },
  shtypur: { opacity: 0.8 },
  opsioni: {
    flex: 1,
    minHeight: permasat.prekjaMinimale + hapesira.s,
    borderWidth: 1.5,
    borderRadius: rrezet.mesme,
    padding: hapesira.m,
    gap: hapesira.s,
    justifyContent: "center",
  },
  emri: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: hapesira.xs,
  },
  teksti: { flexShrink: 1 },
});
