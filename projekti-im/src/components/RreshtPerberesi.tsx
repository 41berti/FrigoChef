import { StyleSheet, View } from "react-native";

import Ikona from "@/components/Ikona";
import Teksti from "@/components/Teksti";
import { hapesira, useNgjyrat } from "@/tema/tema";

type RreshtPerberesiProps = {
  emri: string;
  // "ke" dhe "mungon" dalin kur përdoruesi ka zgjedhur përbërës te Ballina.
  // "neutral" del kur s'ka zgjedhje, pra pa shenja.
  gjendja: "ke" | "mungon" | "neutral";
};

// Një përbërës te detajet e recetës, si në skicën 3.
export default function RreshtPerberesi({ emri, gjendja }: RreshtPerberesiProps) {
  const ngjyrat = useNgjyrat();

  return (
    <View
      // Lexuesi i ekranit e lexon rreshtin si një fjali: "qumësht, mungon".
      accessible
      accessibilityLabel={
        gjendja === "ke" ? `${emri}, e ke` : gjendja === "mungon" ? `${emri}, mungon` : emri
      }
      style={styles.rreshti}
    >
      {gjendja === "ke" && (
        <View style={[styles.rrethi, { backgroundColor: ngjyrat.primareEZbehte }]}>
          <Ikona emri="po" madhesia={12} ngjyra="primareTeksti" />
        </View>
      )}
      {gjendja === "mungon" && (
        <View style={[styles.rrethi, styles.meVija, { borderColor: ngjyrat.theksi }]} />
      )}
      {gjendja === "neutral" && (
        <View style={styles.rrethi}>
          <View style={[styles.pika, { backgroundColor: ngjyrat.tekstiIZbehte }]} />
        </View>
      )}

      {/* flexShrink e lejon emrin e gjatë të kalojë në rresht të ri në vend që të dalë jashtë. */}
      <Teksti style={styles.emri}>{emri}</Teksti>
      {gjendja === "mungon" && (
        <Teksti lloji="imet" ngjyra="theksi">
          mungon
        </Teksti>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rreshti: {
    alignItems: "center",
    flexDirection: "row",
    gap: hapesira.m,
    paddingVertical: hapesira.xs,
  },
  rrethi: {
    alignItems: "center",
    borderRadius: 11,
    height: 22,
    justifyContent: "center",
    width: 22,
  },
  meVija: { borderStyle: "dashed", borderWidth: 1.5 },
  pika: { borderRadius: 3, height: 6, width: 6 },
  emri: { flexShrink: 1 },
});
