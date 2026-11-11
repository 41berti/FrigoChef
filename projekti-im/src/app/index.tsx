import { Link, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from "react-native";

import Butoni from "@/components/Butoni";
import Kartela from "@/components/Kartela";
import Teksti from "@/components/Teksti";
import { merrRecetat, type Receta } from "@/data/recetat";
import { hapesira, permasat, useNgjyrat } from "@/tema/tema";

export default function Index() {
  const [recetat, setRecetat] = useState<Receta[]>([]);
  const [dukeNgarkuar, setDukeNgarkuar] = useState(true);
  const [gabimi, setGabimi] = useState<string | null>(null);
  const ngjyrat = useNgjyrat();
  const router = useRouter();

  // Gjendja ndryshon brenda .then, pra vetëm pasi të vijë përgjigjja nga Supabase.
  // useCallback e mban të njëjtin funksion mes rivizatimeve, që useFocusEffect
  // të mos e thërrasë pa nevojë.
  const ngarkoRecetat = useCallback(() => {
    merrRecetat().then(({ data, error }) => {
      if (error) {
        setGabimi(error.message);
      } else {
        setGabimi(null);
        setRecetat(data);
      }
      setDukeNgarkuar(false);
    });
  }, []);

  // Thirret sa herë që ekrani del në pah: kur hapet aplikacioni
  // dhe kur kthehemi nga ekrani "Recetë e re".
  useFocusEffect(ngarkoRecetat);

  return (
    <FlatList
      // Në iOS lista kalon nën header dhe nën tab-et, por fillon e mbaron jashtë tyre.
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.permbajtja}
      data={recetat}
      // Çelësi është id-ja e recetës (jo indeksi), që çdo rresht të mbajë gjendjen e vet.
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={styles.koka}>
          <Butoni
            lloji="dytesor"
            titulli="+ Shto një recetë"
            onPress={() => router.push("/shto")}
          />
          {gabimi !== null && (
            <Teksti lloji="dytesor" ngjyra="gabimi" accessibilityRole="alert">
              Recetat nuk u ngarkuan: {gabimi}
            </Teksti>
          )}
        </View>
      }
      ListEmptyComponent={
        dukeNgarkuar ? (
          <ActivityIndicator style={styles.gjendja} size="large" color={ngjyrat.primare} />
        ) : gabimi === null ? (
          // Lista bosh pa gabim zakonisht do të thotë se tabelës i mungon policy për lexim.
          <Teksti ngjyra="tekstiDytesor" style={styles.gjendja}>
            {"S'ka receta."}
          </Teksti>
        ) : undefined
      }
      renderItem={({ item }) => (
        // Kartela përmban View, prandaj Link-u e kalon lidhjen te Pressable me asChild.
        <Link href={`/artikull/${item.id}`} asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${item.titulli}, ${item.koha_minuta} minuta`}
            style={({ pressed }) => pressed && styles.eShtypur}
          >
            <Kartela titulli={item.titulli} teksti={`${item.koha_minuta} min`} />
          </Pressable>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  // Në ekrane të gjera lista rri në mes dhe nuk zgjerohet pa fund.
  permbajtja: {
    alignSelf: "center",
    gap: hapesira.m,
    maxWidth: permasat.gjeresiaMaksimale,
    padding: hapesira.xl,
    width: "100%",
  },
  koka: { gap: hapesira.m, marginBottom: hapesira.xs },
  gjendja: { paddingVertical: hapesira.xxxl, textAlign: "center" },
  eShtypur: { opacity: 0.6 },
});
