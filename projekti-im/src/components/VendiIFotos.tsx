import { StyleSheet, View } from "react-native";

import Ikona from "@/components/Ikona";
import { rrezet, useNgjyrat } from "@/tema/tema";

type VendiIFotosProps = {
  // "vogel" është katrori te kartela e recetës, "madh" është fotoja në krye të detajeve.
  lloji: "vogel" | "madh";
};

// Vendi ku do të dalë fotoja e gatimit. Recetat ende s'kanë foto (foto_url është bosh),
// prandaj deri atëherë shfaqet një ikonë mbi sfond të gjelbër të lehtë.
export default function VendiIFotos({ lloji }: VendiIFotosProps) {
  const ngjyrat = useNgjyrat();

  return (
    <View
      // Është zbukurim, prandaj lexuesi i ekranit e anashkalon.
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.vendi,
        lloji === "vogel" ? styles.vogel : styles.madh,
        { backgroundColor: ngjyrat.primareEZbehte },
      ]}
    >
      <Ikona emri="gatimi" madhesia={lloji === "vogel" ? 24 : 44} ngjyra="primareTeksti" />
    </View>
  );
}

const styles = StyleSheet.create({
  vendi: { alignItems: "center", justifyContent: "center" },
  vogel: { borderRadius: rrezet.mesme, height: 56, width: 56 },
  // aspectRatio e mban formën e njëjtë në çdo gjerësi ekrani.
  madh: { aspectRatio: 2.2, borderRadius: rrezet.madhe, width: "100%" },
});
