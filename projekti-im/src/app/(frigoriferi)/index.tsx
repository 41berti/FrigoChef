import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Butoni from "@/components/Butoni";
import Chip from "@/components/Chip";
import Fusha from "@/components/Fusha";
import Teksti from "@/components/Teksti";
import { grupetEPerberesve, perberesitEGrupeve } from "@/data/perberesit";
import { useZgjedhja } from "@/gjendja/zgjedhja";
import { hapesira, permasat, useNgjyrat } from "@/tema/tema";

// Ballina: "Çka ke në frigorifer?". Përdoruesi i zgjedh përbërësit me prekje.
export default function Frigoriferi() {
  const { zgjedhur, teShtuar, nderroPerberesin, shtoPerberesin } = useZgjedhja();
  // Fusha për "+ tjetër" del vetëm pasi të preket chip-i me vija.
  const [fushaEHapur, setFushaEHapur] = useState(false);
  const [perberesiIRi, setPerberesiIRi] = useState("");
  const ngjyrat = useNgjyrat();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  function shtoTjeter() {
    // Shkronja të vogla dhe pa hapësira anash, njësoj si përbërësit e recetave.
    const emri = perberesiIRi.trim().toLowerCase();

    if (emri !== "") {
      if (perberesitEGrupeve.includes(emri)) {
        // Ekziston si chip, prandaj vetëm e zgjedhim, pa e shtuar dy herë.
        if (!zgjedhur.includes(emri)) {
          nderroPerberesin(emri);
        }
      } else {
        shtoPerberesin(emri);
      }
    }

    setPerberesiIRi("");
    setFushaEHapur(false);
  }

  // Në iOS ekrani vazhdon nën tab-et, prandaj pjesa e poshtme ngrihet mbi to.
  // Në Android këtë hapësirë e lë vetë sistemi.
  const hapesiraPoshte = Platform.OS === "ios" ? insets.bottom : 0;

  return (
    <View style={styles.ekrani}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        // Në iOS përmbajtja ngrihet mbi tastierë kur shkruhet përbërësi i ri.
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.permbajtja}
      >
        <View style={styles.koka}>
          <Teksti lloji="titullIMadh" accessibilityRole="header">
            Çka ke në frigorifer?
          </Teksti>
          <Teksti ngjyra="tekstiDytesor">Prek përbërësit që ke sot.</Teksti>
        </View>

        {grupetEPerberesve.map((grupi) => (
          <View key={grupi.titulli} style={styles.grupi}>
            <Teksti lloji="etiketa" ngjyra="tekstiDytesor" accessibilityRole="header">
              {grupi.titulli}
            </Teksti>
            {/* flexWrap i kalon chip-at në rresht të ri kur s'ka më vend, në çdo gjerësi ekrani. */}
            <View style={styles.chipat}>
              {grupi.perberesit.map((perberesi) => (
                <Chip
                  key={perberesi}
                  titulli={perberesi}
                  iZgjedhur={zgjedhur.includes(perberesi)}
                  onPress={() => nderroPerberesin(perberesi)}
                />
              ))}
            </View>
          </View>
        ))}

        <View style={styles.grupi}>
          <Teksti lloji="etiketa" ngjyra="tekstiDytesor" accessibilityRole="header">
            Të tjerë
          </Teksti>
          <View style={styles.chipat}>
            {teShtuar.map((perberesi) => (
              <Chip
                key={perberesi}
                titulli={perberesi}
                iZgjedhur={zgjedhur.includes(perberesi)}
                onPress={() => nderroPerberesin(perberesi)}
              />
            ))}
            {!fushaEHapur && (
              <Chip meVija titulli="+ tjetër" onPress={() => setFushaEHapur(true)} />
            )}
          </View>
          {fushaEHapur && (
            <View style={styles.shtimi}>
              <Fusha
                etiketa="Përbërës tjetër"
                ndihma="Shtohet vetëm në zgjedhjen tënde, jo në databazë."
                placeholder="p.sh. proshutë"
                value={perberesiIRi}
                onChangeText={setPerberesiIRi}
                // Butoni "done" i tastierës e shton përbërësin, njësoj si butoni poshtë.
                onSubmitEditing={shtoTjeter}
                returnKeyType="done"
                autoCapitalize="none"
                autoFocus
                maxLength={40}
              />
              <Butoni lloji="dytesor" titulli="Shto përbërësin" onPress={shtoTjeter} />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Pjesa e poshtme rri jashtë ScrollView-it, prandaj mbetet në vend kur lëvizin chip-at. */}
      <View
        style={[
          styles.fundi,
          {
            backgroundColor: ngjyrat.sfondi,
            borderTopColor: ngjyrat.kufiri,
            paddingBottom: hapesira.m + hapesiraPoshte,
          },
        ]}
      >
        <View style={styles.fundiBrenda}>
          {zgjedhur.length === 0 ? (
            <Teksti lloji="dytesor" ngjyra="tekstiDytesor" style={styles.neMes}>
              Zgjidh së paku një përbërës.
            </Teksti>
          ) : (
            <Teksti lloji="dytesor" ngjyra="tekstiDytesor" style={styles.neMes}>
              <Teksti lloji="dytesorITheksuar" ngjyra="primareTeksti">
                {zgjedhur.length}
              </Teksti>
              {zgjedhur.length === 1 ? " përbërës i zgjedhur" : " përbërës të zgjedhur"}
            </Teksti>
          )}
          {/* Lista me përputhje vjen në hapin tjetër. Deri atëherë butoni hap të gjitha recetat. */}
          <Butoni
            titulli="Shiko recetat  →"
            onPress={() => router.navigate("/recetat")}
            iCaktivizuar={zgjedhur.length === 0}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ekrani: { flex: 1 },
  // Në ekrane të gjera përmbajtja rri në mes dhe nuk zgjerohet pa fund.
  permbajtja: {
    alignSelf: "center",
    gap: hapesira.xxl,
    maxWidth: permasat.gjeresiaMaksimale,
    padding: hapesira.xl,
    width: "100%",
  },
  koka: { gap: hapesira.xs },
  grupi: { gap: hapesira.m },
  chipat: { flexDirection: "row", flexWrap: "wrap", gap: hapesira.s },
  shtimi: { gap: hapesira.m },
  fundi: {
    borderTopWidth: 1,
    paddingHorizontal: hapesira.xl,
    paddingTop: hapesira.m,
  },
  fundiBrenda: {
    alignSelf: "center",
    gap: hapesira.s,
    maxWidth: permasat.gjeresiaMaksimale,
    width: "100%",
  },
  neMes: { textAlign: "center" },
});
