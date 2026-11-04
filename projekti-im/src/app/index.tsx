import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text } from "react-native";

import FormaRecete from "@/components/FormaRecete";
import Kartela from "@/components/Kartela";
import { supabase } from "@/data/supabase";

// Një rresht i tabelës `recetat` në Supabase.
type Receta = {
  id: string;
  titulli: string;
  koha_minuta: number;
};

export default function Index() {
  const [recetat, setRecetat] = useState<Receta[]>([]);
  const [dukeNgarkuar, setDukeNgarkuar] = useState(true);
  const [gabimi, setGabimi] = useState<string | null>(null);

  // Thirret kur hapet ekrani dhe sa herë që forma shton një recetë.
  async function ngarkoRecetat() {
    const { data, error } = await supabase
      .from("recetat")
      .select("id, titulli, koha_minuta")
      // Më të rejat në krye. Recetat me të njëjtën kohë renditen sipas titullit.
      .order("krijuar_me", { ascending: false })
      .order("titulli");

    if (error) {
      setGabimi(error.message);
    } else {
      setGabimi(null);
      setRecetat(data);
    }
    setDukeNgarkuar(false);
  }

  // Me [] në fund, ky kod ekzekutohet vetëm një herë, kur hapet ekrani.
  useEffect(() => {
    ngarkoRecetat();
  }, []);

  if (dukeNgarkuar) {
    return <ActivityIndicator style={styles.gjendja} size="large" />;
  }

  return (
    <FlatList
      data={recetat}
      // Çelësi është id-ja e recetës (jo indeksi), që çdo rresht të mbajë gjendjen e vet.
      keyExtractor={(item) => item.id}
      // Pa këtë, prekja e parë e butonit vetëm e mbyll tastierën.
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <>
          <FormaRecete onShtuar={ngarkoRecetat} />
          {gabimi !== null && (
            <Text style={styles.gjendja}>Recetat nuk u ngarkuan: {gabimi}</Text>
          )}
          <Text style={styles.koka}>Receta të rekomanduara nga frigoriferi yt</Text>
        </>
      }
      // Lista bosh pa gabim zakonisht do të thotë se tabelës i mungon policy për lexim.
      ListEmptyComponent={
        gabimi === null ? <Text style={styles.gjendja}>S'ka receta.</Text> : undefined
      }
      renderItem={({ item }) => (
        // Kartela përmban View, prandaj Link-u e kalon lidhjen te Pressable me asChild.
        <Link href={`/artikull/${item.id}`} asChild>
          <Pressable style={styles.rreshti}>
            <Kartela titulli={item.titulli} teksti={`${item.koha_minuta} min`} />
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
  gjendja: { padding: 16 },
});
