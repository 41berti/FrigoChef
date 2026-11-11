import { Link } from "expo-router";
import { useHeaderHeight } from "expo-router/react-navigation";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

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
  const lartesiaHeader = useHeaderHeight();

  // Thirret kur hapet ekrani dhe sa herë që forma shton një recetë.
  // Gjendja ndryshon brenda .then, pra vetëm pasi të vijë përgjigjja nga Supabase.
  function ngarkoRecetat() {
    supabase
      .from("recetat")
      .select("id, titulli, koha_minuta")
      // Më të rejat në krye. Recetat me të njëjtën kohë renditen sipas titullit.
      .order("krijuar_me", { ascending: false })
      .order("titulli")
      .then(({ data, error }) => {
        if (error) {
          setGabimi(error.message);
        } else {
          setGabimi(null);
          setRecetat(data);
        }
        setDukeNgarkuar(false);
      });
  }

  // Me [] në fund, ky kod ekzekutohet vetëm një herë, kur hapet ekrani.
  useEffect(() => {
    ngarkoRecetat();
  }, []);

  if (dukeNgarkuar) {
    return <ActivityIndicator style={styles.gjendja} size="large" />;
  }

  return (
    // Kur hapet tastiera, forma ngrihet mbi të. Offset-i llogarit header-in e Stack-ut,
    // përndryshe një pjesë e formës mbetet nën tastierë.
    <KeyboardAvoidingView
      style={styles.faqja}
      behavior="padding"
      keyboardVerticalOffset={lartesiaHeader}
    >
      <FlatList
        style={styles.faqja}
        data={recetat}
        // Çelësi është id-ja e recetës (jo indeksi), që çdo rresht të mbajë gjendjen e vet.
        keyExtractor={(item) => item.id}
        // Prekja në listë e mbyll tastierën, por prekja e një recete e hap atë.
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListHeaderComponent={
          <>
            {gabimi !== null && (
              <Text style={styles.gjendja}>Recetat nuk u ngarkuan: {gabimi}</Text>
            )}
            <Text style={styles.koka}>Receta të rekomanduara nga frigoriferi yt</Text>
          </>
        }
        // Lista bosh pa gabim zakonisht do të thotë se tabelës i mungon policy për lexim.
        ListEmptyComponent={
          gabimi === null ? <Text style={styles.gjendja}>{"S'ka receta."}</Text> : undefined
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
      {/* Forma është jashtë listës, që prekjet në fusha të mos i marrë scroll-i. */}
      <FormaRecete onShtuar={ngarkoRecetat} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  faqja: { flex: 1 },
  rreshti: { padding: 16 },
  koka: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  gjendja: { padding: 16 },
});
