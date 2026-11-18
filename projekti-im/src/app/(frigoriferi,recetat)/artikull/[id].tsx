import { usePreferencat } from "@/gjendja/preferencat";
import type { Celesi } from "@/i18n/perkthimi";
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
import { fshiReceten, merrReceten, mundTeFshihet, type Receta } from "@/data/recetat";
import { useAutentikimi } from "@/gjendja/autentikimi";
import { useZgjedhja } from "@/gjendja/zgjedhja";
import { hapesira, permasat, useNgjyrat } from "@/tema/tema";

// Detajet e recetës. Dosja (frigoriferi,recetat) e vendos këtë ekran në të dy tab-et,
// prandaj hapet si nga lista me përputhje, ashtu edhe nga lista e të gjitha recetave.
export default function Detajet() {
  const { t } = usePreferencat();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [receta, setReceta] = useState<Receta | null>(null);
  const [dukeNgarkuar, setDukeNgarkuar] = useState(true);
  const [gabimi, setGabimi] = useState(false);
  const [dukeFshire, setDukeFshire] = useState(false);
  const [gabimiIFshirjes, setGabimiIFshirjes] = useState<Celesi | null>(null);
  const { zgjedhur } = useZgjedhja();
  const { sesioni } = useAutentikimi();
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
        setGabimi(true);
      } else {
        setGabimi(false);
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

    fshiReceten(id)
      .then(({ data, error }) => {
        setDukeFshire(false);

        if (error) {
          setGabimiIFshirjes("detail.denied");
          return;
        }
        // Lista bosh do të thotë se asnjë rresht s'u fshi: policy në Supabase nuk e lejoi.
        if (data.length === 0) {
          setGabimiIFshirjes("detail.denied");
          return;
        }
        // Ekrani mbyllet, dhe lista rifreskohet vetë kur del prapë në pah.
        router.back();
      })
      .catch(() => {
        setDukeFshire(false);
        setGabimiIFshirjes("detail.network");
      });
  }

  // Fshirja s'kthehet prapa, prandaj së pari pyesim.
  function pyetPerFshirje(titulli: string) {
    const mesazhi = t("detail.warning", { name: titulli });

    // Alert.alert nuk punon në web, prandaj atje përdoret dritarja e shfletuesit.
    if (Platform.OS === "web") {
      if (window.confirm(`${t("detail.confirm")} ${mesazhi}`)) {
        fshije();
      }
      return;
    }

    Alert.alert(t("detail.confirm"), mesazhi, [
      { text: t("common.cancel"), style: "cancel" },
      // style: "destructive" e bën butonin të kuq në iOS.
      { text: t("detail.delete"), style: "destructive", onPress: fshije },
    ]);
  }

  if (dukeNgarkuar) {
    return (
      <View style={styles.gjendja}>
        <ActivityIndicator accessibilityLabel={t("common.loading")} size="large" color={ngjyrat.primare} />
      </View>
    );
  }

  if (gabimi) {
    return (
      <View style={styles.gjendja}>
        <Teksti ngjyra="gabimi" accessibilityRole="alert" style={styles.neMes}>
          {t("detail.loadError")}
        </Teksti>
      </View>
    );
  }

  // Kontrolli (guard): pa të, TypeScript ankohet se `receta` mund të jetë null.
  if (!receta) {
    return (
      <View style={styles.gjendja}>
        <Teksti ngjyra="tekstiDytesor" style={styles.neMes}>
          {t("detail.notFound", { id })}
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
          <Teksti ngjyra="tekstiDytesor">{t("recipes.time", { minutes: receta.koha_minuta })}</Teksti>
          {kaZgjedhje && receta.perberesit.length > 0 && (
            <Etiketa
              lloji="primare"
              titulli={t("matches.have", { have: ke.length, count: receta.perberesit.length })}
            />
          )}
        </View>
      </View>

      <View style={styles.pjesa}>
        <Teksti lloji="nentitull" accessibilityRole="header">
          {t("detail.ingredients")}
        </Teksti>
        {receta.perberesit.length === 0 ? (
          // Recetat e shtuara para se të kishim këtë kolonë e kanë listën bosh.
          <Teksti ngjyra="tekstiDytesor">{t("detail.noIngredients")}</Teksti>
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
          {t("detail.steps")}
        </Teksti>
        {receta.hapat.length === 0 ? (
          <Teksti ngjyra="tekstiDytesor">{t("detail.noSteps")}</Teksti>
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

      {/* Vetëm pronari sheh fshirjen; recetat bazë dhe ato pa pronar ruhen. */}
      {mundTeFshihet(receta, sesioni?.user.id) && (
        <View style={styles.pjesa}>
          <Butoni
            lloji="rrezik"
            titulli={dukeFshire ? t("detail.deleting") : t("detail.deleteRecipe")}
            onPress={() => pyetPerFshirje(receta.titulli)}
            iCaktivizuar={dukeFshire}
          />
          {gabimiIFshirjes !== null && (
            <Teksti lloji="dytesor" ngjyra="gabimi" accessibilityRole="alert" style={styles.neMes}>
              {t(gabimiIFshirjes)}
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
  rreshti: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: hapesira.s,
  },
  pjesa: { gap: hapesira.m },
  perberesit: { flexDirection: "row", flexWrap: "wrap" },
});
