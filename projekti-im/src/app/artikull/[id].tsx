import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

import Teksti from "@/components/Teksti";
import { gjeArtikullin } from "@/data/artikujt";
import { hapesira, permasat } from "@/tema/tema";

export default function Detajet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const artikulli = gjeArtikullin(id);

  // Kontrolli (guard): pa të, TypeScript jep TS18048 ('artikulli' is possibly 'undefined').
  if (!artikulli) {
    return (
      <View style={styles.permbajtja}>
        <Teksti ngjyra="tekstiDytesor">Artikulli “{id}” nuk u gjet.</Teksti>
      </View>
    );
  }

  return (
    // ScrollView, që teksti i gjatë të lexohet edhe në telefona të vegjël.
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.permbajtja}
    >
      <Teksti lloji="titull">{artikulli.titulli}</Teksti>
      <Teksti lloji="dytesor" ngjyra="tekstiDytesor">
        Koha: {artikulli.kohaMinuta} min
      </Teksti>

      <Teksti lloji="nentitull" style={styles.nentitulli}>
        Përbërësit
      </Teksti>
      {artikulli.perberesit.map((perberesi) => (
        <Teksti key={perberesi}>• {perberesi}</Teksti>
      ))}

      <Teksti style={styles.pershkrimi}>{artikulli.pershkrimi}</Teksti>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  permbajtja: {
    alignSelf: "center",
    gap: hapesira.xs,
    maxWidth: permasat.gjeresiaMaksimale,
    padding: hapesira.xl,
    width: "100%",
  },
  nentitulli: { marginTop: hapesira.xl },
  pershkrimi: { marginTop: hapesira.xl },
});
