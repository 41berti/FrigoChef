import { Pressable, StyleSheet } from "react-native";

import Teksti from "@/components/Teksti";
import { hapesira, permasat, rrezet, useNgjyrat } from "@/tema/tema";

type ButoniProps = {
  titulli: string;
  onPress: () => void;
  // "primar": i gjelbër dhe i mbushur. "dytesor": vetëm kornizë me vija. "tekst": vetëm tekst.
  lloji?: "primar" | "dytesor" | "tekst";
  // Kur është true, butoni nuk shtypet (p.sh. derisa po ruhet receta).
  iCaktivizuar?: boolean;
};

// Butoni i aplikacionit, me formë pilule si në skica.
export default function Butoni({
  titulli,
  onPress,
  lloji = "primar",
  iCaktivizuar = false,
}: ButoniProps) {
  const ngjyrat = useNgjyrat();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: iCaktivizuar }}
      disabled={iCaktivizuar}
      onPress={onPress}
      // `pressed` është true derisa gishti është mbi buton, prandaj butoni zbehet pak.
      style={({ pressed }) => [
        styles.buton,
        lloji === "primar" && { backgroundColor: ngjyrat.primare },
        lloji === "dytesor" && [styles.meKornize, { borderColor: ngjyrat.kufiriIFushes }],
        (pressed || iCaktivizuar) && styles.iZbehte,
      ]}
    >
      <Teksti
        lloji="trupiITheksuar"
        ngjyra={lloji === "primar" ? "mbiPrimare" : "primareTeksti"}
        style={styles.teksti}
      >
        {titulli}
      </Teksti>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buton: {
    alignItems: "center",
    borderRadius: rrezet.pilule,
    justifyContent: "center",
    minHeight: permasat.prekjaMinimale + 6,
    paddingHorizontal: hapesira.xxl,
    paddingVertical: hapesira.m,
  },
  meKornize: { borderStyle: "dashed", borderWidth: 1.5 },
  iZbehte: { opacity: 0.6 },
  teksti: { fontWeight: "700", textAlign: "center" },
});
