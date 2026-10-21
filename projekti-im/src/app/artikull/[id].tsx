import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { gjeArtikullin } from "@/data/artikujt";

export default function Detajet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const artikulli = gjeArtikullin(id);

  // Kontrolli (guard): pa të, TypeScript jep TS18048 ('artikulli' is possibly 'undefined').
  if (!artikulli) {
    return <Text style={styles.ekrani}>Artikulli “{id}” nuk u gjet.</Text>;
  }

  return (
    <View style={styles.ekrani}>
      <Text style={styles.titulli}>{artikulli.titulli}</Text>
      <Text>Koha: {artikulli.kohaMinuta} min</Text>

      <Text style={styles.nentitulli}>Përbërësit</Text>
      {artikulli.perberesit.map((perberesi) => (
        <Text key={perberesi}>• {perberesi}</Text>
      ))}

      <Text style={styles.pershkrimi}>{artikulli.pershkrimi}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ekrani: { padding: 16 },
  titulli: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  nentitulli: { fontWeight: "bold", marginTop: 16, marginBottom: 4 },
  pershkrimi: { marginTop: 16 },
});
