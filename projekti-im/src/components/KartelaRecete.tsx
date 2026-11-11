import { StyleSheet, View } from "react-native";

import Etiketa from "@/components/Etiketa";
import Ikona from "@/components/Ikona";
import Teksti from "@/components/Teksti";
import VendiIFotos from "@/components/VendiIFotos";
import { tekstiIMungeses, type Perputhje } from "@/data/perputhja";
import { hapesira, rrezet, useNgjyrat } from "@/tema/tema";

type KartelaReceteProps = {
  perputhja: Perputhje;
  // Receta e parë në listë (përputhja më e mirë) merr kornizë të gjelbër.
  ePara?: boolean;
};

// Kartela e recetës te lista me përputhje, si në skicën 2.
export default function KartelaRecete({ perputhja, ePara = false }: KartelaReceteProps) {
  const ngjyrat = useNgjyrat();
  const { receta, ke, mungojne } = perputhja;
  const gjithsej = receta.perberesit.length;

  return (
    <View
      style={[
        styles.kartela,
        { backgroundColor: ngjyrat.siperfaqja, borderColor: ngjyrat.kufiri },
        ePara && { borderColor: ngjyrat.primare, borderWidth: 2 },
      ]}
    >
      <VendiIFotos lloji="vogel" />

      {/* flex: 1 i jep kësaj kolone gjithë gjerësinë që mbetet pas fotos. */}
      <View style={styles.teDhenat}>
        <Teksti lloji="trupiITheksuar" numberOfLines={2}>
          {receta.titulli}
        </Teksti>

        <View style={styles.rreshti}>
          <Ikona emri="ora" madhesia={16} />
          <Teksti lloji="dytesor" ngjyra="tekstiDytesor">
            {receta.koha_minuta} min
          </Teksti>
          {/* Skica e thekson recetën që gatuhet më shpejt se sa vjen një porosi. */}
          {receta.koha_minuta <= 20 && <Etiketa titulli="deri 20 min" />}
        </View>

        <View style={styles.rreshti}>
          {/* Shiriti: pjesa e gjelbër është aq e gjerë sa pjesa e përbërësve që ke. */}
          <View style={[styles.shiriti, { backgroundColor: ngjyrat.kufiri }]}>
            <View
              style={[
                styles.mbushja,
                { backgroundColor: ngjyrat.primare, width: `${(ke.length / gjithsej) * 100}%` },
              ]}
            />
          </View>
          <Teksti lloji="dytesorITheksuar" ngjyra="primareTeksti">
            ke {ke.length} nga {gjithsej}
          </Teksti>
        </View>

        <Teksti
          lloji="dytesor"
          ngjyra={mungojne.length === 0 ? "primareTeksti" : "tekstiDytesor"}
          numberOfLines={1}
        >
          {tekstiIMungeses(mungojne)}
        </Teksti>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  kartela: {
    borderRadius: rrezet.madhe,
    borderWidth: 1,
    flexDirection: "row",
    gap: hapesira.m,
    padding: hapesira.m,
  },
  teDhenat: { flex: 1, gap: hapesira.xs + 2 },
  // flexWrap: në ekrane shumë të ngushta etiketa kalon në rresht të ri në vend që të pritet.
  rreshti: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: hapesira.s },
  shiriti: { borderRadius: 3, flex: 1, height: 6, minWidth: 60, overflow: "hidden" },
  mbushja: { borderRadius: 3, height: 6 },
});
