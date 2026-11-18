import { usePreferencat } from "@/gjendja/preferencat";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from "react-native";

import Butoni from "@/components/Butoni";
import KartelaRecete from "@/components/KartelaRecete";
import Teksti from "@/components/Teksti";
import { gjejPerputhjet, tekstiIMungeses } from "@/data/perputhja";
import { merrRecetat, type Receta } from "@/data/recetat";
import { useZgjedhja } from "@/gjendja/zgjedhja";
import { hapesira, permasat, useNgjyrat } from "@/tema/tema";

// "Recetat për ty": recetat nga Supabase që përputhen me përbërësit e zgjedhur te Ballina.
export default function Lista() {
  const { t } = usePreferencat();
  const { zgjedhur } = useZgjedhja();
  const [recetat, setRecetat] = useState<Receta[]>([]);
  const [dukeNgarkuar, setDukeNgarkuar] = useState(true);
  const [gabimi, setGabimi] = useState(false);
  const ngjyrat = useNgjyrat();
  const router = useRouter();

  // Njësoj si te tab-i "Recetat": gjendja ndryshon vetëm pasi të vijë përgjigjja.
  const ngarkoRecetat = useCallback(() => {
    merrRecetat().then(({ data, error }) => {
      if (error) {
        setGabimi(true);
      } else {
        setGabimi(false);
        setRecetat(data);
      }
      setDukeNgarkuar(false);
    });
  }, []);

  useFocusEffect(ngarkoRecetat);

  // Përputhja llogaritet në telefon, sa herë që ndryshojnë recetat ose zgjedhja.
  const perputhjet = gjejPerputhjet(recetat, zgjedhur);

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.permbajtja}
      data={perputhjet}
      keyExtractor={(item) => item.receta.id}
      ListHeaderComponent={
        <View style={styles.koka}>
          <Teksti ngjyra="tekstiDytesor">
            {t("matches.with", { count: zgjedhur.length })}
            {" · "}
            {/* Teksti brenda tekstit sillet si lidhje: prekja kthen te Ballina. */}
            <Teksti
              lloji="trupiITheksuar"
              ngjyra="primareTeksti"
              accessibilityRole="link"
              onPress={() => router.back()}
            >
              {t("matches.change")}
            </Teksti>
          </Teksti>
          <Teksti lloji="dytesor" ngjyra="tekstiDytesor">
            {t("matches.sort")}
          </Teksti>
          {gabimi && (
            <Teksti lloji="dytesor" ngjyra="gabimi" accessibilityRole="alert">
              {t("recipes.error")}
            </Teksti>
          )}
        </View>
      }
      ListEmptyComponent={
        dukeNgarkuar ? (
          <ActivityIndicator accessibilityLabel={t("common.loading")} style={styles.gjendja} size="large" color={ngjyrat.primare} />
        ) : !gabimi ? (
          <View style={styles.gjendja}>
            <Teksti ngjyra="tekstiDytesor" style={styles.neMes}>
              {t("matches.empty")}
            </Teksti>
            <Butoni lloji="dytesor" titulli={t("matches.edit")} onPress={() => router.back()} />
          </View>
        ) : undefined
      }
      renderItem={({ item, index }) => (
        // Lidhja s'e ka emrin e tab-it, prandaj detajet hapen brenda tab-it ku jemi.
        <Link href={`/artikull/${item.receta.id}`} asChild>
          <Pressable
            accessibilityRole="button"
            // Lexuesi i ekranit e lexon gjithë kartelën si një fjali.
            accessibilityLabel={
              [item.receta.titulli, t("recipes.duration", { count: item.receta.koha_minuta }),
                t("matches.have", { have: item.ke.length, count: item.receta.perberesit.length }),
                tekstiIMungeses(item.mungojne, t)].join(", ")
            }
            style={({ pressed }) => pressed && styles.eShtypur}
          >
            <KartelaRecete perputhja={item} ePara={index === 0} />
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
  koka: { gap: hapesira.xs, marginBottom: hapesira.xs },
  gjendja: { gap: hapesira.l, paddingVertical: hapesira.xxxl },
  neMes: { textAlign: "center" },
  eShtypur: { opacity: 0.6 },
});
