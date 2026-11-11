import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

import Teksti from "@/components/Teksti";
import { merrReceten, type Receta } from "@/data/recetat";
import { hapesira, permasat, useNgjyrat } from "@/tema/tema";

export default function Detajet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [receta, setReceta] = useState<Receta | null>(null);
  const [dukeNgarkuar, setDukeNgarkuar] = useState(true);
  const [gabimi, setGabimi] = useState<string | null>(null);
  const ngjyrat = useNgjyrat();

  // Receta kërkohet nga Supabase kur hapet ekrani, dhe prapë nëse ndryshon id-ja në URL.
  useEffect(() => {
    // Nëse ekrani mbyllet para se të vijë përgjigjja, nuk e prekim më gjendjen.
    let aktiv = true;

    merrReceten(id).then(({ data, error }) => {
      if (!aktiv) {
        return;
      }
      if (error) {
        setGabimi(error.message);
      } else {
        setGabimi(null);
        setReceta(data);
      }
      setDukeNgarkuar(false);
    });

    return () => {
      aktiv = false;
    };
  }, [id]);

  if (dukeNgarkuar) {
    return (
      <View style={styles.gjendja}>
        <ActivityIndicator size="large" color={ngjyrat.primare} />
      </View>
    );
  }

  if (gabimi !== null) {
    return (
      <View style={styles.gjendja}>
        <Teksti ngjyra="gabimi" accessibilityRole="alert" style={styles.neMes}>
          Receta nuk u ngarkua: {gabimi}
        </Teksti>
      </View>
    );
  }

  // Kontrolli (guard): pa të, TypeScript ankohet se `receta` mund të jetë null.
  if (!receta) {
    return (
      <View style={styles.gjendja}>
        <Teksti ngjyra="tekstiDytesor" style={styles.neMes}>
          Receta “{id}” nuk u gjet.
        </Teksti>
      </View>
    );
  }

  return (
    // ScrollView, që teksti i gjatë të lexohet edhe në telefona të vegjël.
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.permbajtja}
    >
      <Teksti lloji="titull">{receta.titulli}</Teksti>
      <Teksti lloji="dytesor" ngjyra="tekstiDytesor">
        Koha: {receta.koha_minuta} min
      </Teksti>

      <Teksti lloji="nentitull" style={styles.nentitulli}>
        Përbërësit
      </Teksti>
      {receta.perberesit.length === 0 ? (
        // Recetat e shtuara para se të kishim këtë kolonë e kanë listën bosh.
        <Teksti ngjyra="tekstiDytesor">{"Kjo recetë s'ka përbërës të shënuar."}</Teksti>
      ) : (
        receta.perberesit.map((perberesi, indeksi) => (
          <Teksti key={`${indeksi}-${perberesi}`}>• {perberesi}</Teksti>
        ))
      )}

      <Teksti lloji="nentitull" style={styles.nentitulli}>
        Hapat
      </Teksti>
      {receta.hapat.length === 0 ? (
        <Teksti ngjyra="tekstiDytesor">{"Kjo recetë s'ka hapa të shënuar."}</Teksti>
      ) : (
        receta.hapat.map((hapi, indeksi) => (
          <Teksti key={`${indeksi}-${hapi}`}>
            {indeksi + 1}. {hapi}
          </Teksti>
        ))
      )}
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
  // Ngarkimi, gabimi dhe "nuk u gjet" rrinë në mes të ekranit.
  gjendja: { flex: 1, justifyContent: "center", padding: hapesira.xl },
  neMes: { textAlign: "center" },
  nentitulli: { marginTop: hapesira.xl },
});
