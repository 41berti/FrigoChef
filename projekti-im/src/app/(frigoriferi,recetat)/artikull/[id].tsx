import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import Butoni from "@/components/Butoni";
import Etiketa from "@/components/Etiketa";
import Hapi from "@/components/Hapi";
import Ikona from "@/components/Ikona";
import RreshtPerberesi from "@/components/RreshtPerberesi";
import Teksti from "@/components/Teksti";
import VendiIFotos from "@/components/VendiIFotos";
import { ndajPerberesit } from "@/data/perputhja";
import { eshteReceteBaze, fshiReceten, merrReceten, type Receta } from "@/data/recetat";
import { useZgjedhja } from "@/gjendja/zgjedhja";
import { hapesira, permasat, useNgjyrat } from "@/tema/tema";

// Detajet e recetës. Dosja (frigoriferi,recetat) e vendos këtë ekran në të dy tab-et,
// prandaj hapet si nga lista me përputhje, ashtu edhe nga lista e të gjitha recetave.
export default function Detajet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [receta, setReceta] = useState<Receta | null>(null);
  const [dukeNgarkuar, setDukeNgarkuar] = useState(true);
  const [gabimi, setGabimi] = useState<string | null>(null);
  const [dukeFshire, setDukeFshire] = useState(false);
  const [gabimiIFshirjes, setGabimiIFshirjes] = useState<string | null>(null);
  const { zgjedhur } = useZgjedhja();
  const ngjyrat = useNgjyrat();
  const router = useRouter();
  // Gjerësia e ekranit ndryshon kur telefoni rrotullohet ose në tablet.
  const { width } = useWindowDimensions();

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

  // E fshin recetën në Supabase. Thirret vetëm pasi përdoruesi ta konfirmojë.
  function fshije() {
    setGabimiIFshirjes(null);
    setDukeFshire(true);

    fshiReceten(id).then(({ data, error }) => {
      setDukeFshire(false);

      if (error) {
        setGabimiIFshirjes(error.message);
        return;
      }
      // Lista bosh do të thotë se asnjë rresht s'u fshi: policy në Supabase nuk e lejoi.
      if (data.length === 0) {
        setGabimiIFshirjes("Kjo recetë nuk mund të fshihet.");
        return;
      }
      // Ekrani mbyllet, dhe lista rifreskohet vetë kur del prapë në pah.
      router.back();
    });
  }

  // Fshirja s'kthehet prapa, prandaj së pari pyesim.
  function pyetPerFshirje(titulli: string) {
    const mesazhi = `“${titulli}” fshihet përgjithmonë.`;

    // Alert.alert nuk punon në web, prandaj atje përdoret dritarja e shfletuesit.
    if (Platform.OS === "web") {
      if (window.confirm(`Të fshihet receta? ${mesazhi}`)) {
        fshije();
      }
      return;
    }

    Alert.alert("Të fshihet receta?", mesazhi, [
      { text: "Anulo", style: "cancel" },
      // style: "destructive" e bën butonin të kuq në iOS.
      { text: "Fshi", style: "destructive", onPress: fshije },
    ]);
  }

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

  // Pa zgjedhje te Ballina, përbërësit dalin neutralë, pa shenjat "ke" dhe "mungon".
  const kaZgjedhje = zgjedhur.length > 0;
  const { ke, mungojne } = ndajPerberesit(receta.perberesit, zgjedhur);
  // Në ekrane të gjera përbërësit dalin në dy kolona, në telefon në një.
  const gjeresiaERreshtit = width >= 600 ? "50%" : "100%";

  return (
    // ScrollView, që teksti i gjatë të lexohet edhe në telefona të vegjël.
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.permbajtja}
    >
      <VendiIFotos lloji="madh" />

      <View style={styles.koka}>
        <Teksti lloji="titullIMadh" accessibilityRole="header">
          {receta.titulli}
        </Teksti>
        <View style={styles.rreshti}>
          <Ikona emri="ora" />
          <Teksti ngjyra="tekstiDytesor">{receta.koha_minuta} min</Teksti>
          {kaZgjedhje && receta.perberesit.length > 0 && (
            <Etiketa
              lloji="primare"
              titulli={`ke ${ke.length} nga ${receta.perberesit.length} përbërës`}
            />
          )}
        </View>
      </View>

      <View style={styles.pjesa}>
        <Teksti lloji="nentitull" accessibilityRole="header">
          Përbërësit
        </Teksti>
        {receta.perberesit.length === 0 ? (
          // Recetat e shtuara para se të kishim këtë kolonë e kanë listën bosh.
          <Teksti ngjyra="tekstiDytesor">{"Kjo recetë s'ka përbërës të shënuar."}</Teksti>
        ) : (
          <View style={styles.perberesit}>
            {kaZgjedhje
              ? // Së pari ata që i ke, pastaj ata që mungojnë.
                [...ke, ...mungojne].map((perberesi, indeksi) => (
                  <View key={`${indeksi}-${perberesi}`} style={{ width: gjeresiaERreshtit }}>
                    <RreshtPerberesi
                      emri={perberesi}
                      gjendja={indeksi < ke.length ? "ke" : "mungon"}
                    />
                  </View>
                ))
              : receta.perberesit.map((perberesi, indeksi) => (
                  <View key={`${indeksi}-${perberesi}`} style={{ width: gjeresiaERreshtit }}>
                    <RreshtPerberesi emri={perberesi} gjendja="neutral" />
                  </View>
                ))}
          </View>
        )}
      </View>

      <View style={styles.pjesa}>
        <Teksti lloji="nentitull" accessibilityRole="header">
          Hapat
        </Teksti>
        {receta.hapat.length === 0 ? (
          <Teksti ngjyra="tekstiDytesor">{"Kjo recetë s'ka hapa të shënuar."}</Teksti>
        ) : (
          <View>
            {receta.hapat.map((hapi, indeksi) => (
              <Hapi
                key={`${indeksi}-${hapi}`}
                numri={indeksi + 1}
                teksti={hapi}
                iFundit={indeksi === receta.hapat.length - 1}
              />
            ))}
          </View>
        )}
      </View>

      {/* Recetat bazë "1"–"8" nuk fshihen, prandaj për to butoni nuk shfaqet fare. */}
      {!eshteReceteBaze(receta.id) && (
        <View style={styles.pjesa}>
          <Butoni
            lloji="rrezik"
            titulli={dukeFshire ? "Duke fshirë…" : "Fshi recetën"}
            onPress={() => pyetPerFshirje(receta.titulli)}
            iCaktivizuar={dukeFshire}
          />
          {gabimiIFshirjes !== null && (
            <Teksti
              lloji="dytesor"
              ngjyra="gabimi"
              accessibilityRole="alert"
              style={styles.neMes}
            >
              Receta nuk u fshi: {gabimiIFshirjes}
            </Teksti>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  permbajtja: {
    alignSelf: "center",
    gap: hapesira.xxl,
    maxWidth: permasat.gjeresiaMaksimale,
    padding: hapesira.xl,
    width: "100%",
  },
  // Ngarkimi, gabimi dhe "nuk u gjet" rrinë në mes të ekranit.
  gjendja: { flex: 1, justifyContent: "center", padding: hapesira.xl },
  neMes: { textAlign: "center" },
  koka: { gap: hapesira.s },
  rreshti: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: hapesira.s },
  pjesa: { gap: hapesira.m },
  perberesit: { flexDirection: "row", flexWrap: "wrap" },
});
