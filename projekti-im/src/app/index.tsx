import { Link } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text } from "react-native";

import Kartela from "@/components/Kartela";
import { artikujt } from "@/data/artikujt";

export default function Index() {
  return (
    <FlatList
      data={artikujt}
      // Çelësi është id-ja e recetës (jo indeksi), që çdo rresht të mbajë gjendjen e vet.
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <Text style={styles.koka}>Receta të rekomanduara nga frigoriferi yt</Text>
      }
      renderItem={({ item }) => (
        // Kartela përmban View, prandaj Link-u e kalon lidhjen te Pressable me asChild.
        <Link href={`/artikull/${item.id}`} asChild>
          <Pressable style={styles.rreshti}>
            <Kartela titulli={item.titulli} teksti={`${item.kohaMinuta} min`} />
          </Pressable>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  rreshti: { padding: 16 },
  koka: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
