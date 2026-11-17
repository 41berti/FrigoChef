import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

import Butoni from "@/components/Butoni";
import Teksti from "@/components/Teksti";
import { dilNgaLlogaria, mesazhiIGabimit } from "@/data/llogaria";
import { useAutentikimi } from "@/gjendja/autentikimi";
import { hapesira, permasat, rrezet, useNgjyrat } from "@/tema/tema";

export default function Llogaria() {
  const { sesioni } = useAutentikimi();
  const router = useRouter();
  const ngjyrat = useNgjyrat();
  const [dukeDale, setDukeDale] = useState(false);
  const neProces = useRef(false);
  const [gabimi, setGabimi] = useState<string | null>(null);

  async function dil() {
    if (neProces.current) return;
    neProces.current = true;
    setDukeDale(true);
    setGabimi(null);
    try {
      await dilNgaLlogaria();
    } catch (error) {
      setGabimi(mesazhiIGabimit(error));
    } finally {
      neProces.current = false;
      setDukeDale(false);
    }
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.permbajtja}
    >
      <View style={[styles.kartela, { backgroundColor: ngjyrat.primareEZbehte }]}>
        <Teksti lloji="titull" ngjyra="primareTeksti" accessibilityRole="header">
          {sesioni ? "Llogaria jote" : "Gatuaj dhe ndaj recetat e tua"}
        </Teksti>
        <Teksti ngjyra="tekstiDytesor">
          {sesioni
            ? "Je i kyçur në FrigoChef."
            : "Recetat mund t’i shfletosh pa llogari. Kyçu ose regjistrohu për të shtuar recetat e tua."}
        </Teksti>
        {sesioni && (
          <Teksti selectable lloji="trupiITheksuar">
            {sesioni.user.email}
          </Teksti>
        )}
      </View>
      {gabimi && (
        <Teksti selectable ngjyra="gabimi" accessibilityRole="alert">
          {gabimi}
        </Teksti>
      )}
      {sesioni ? (
        <View style={styles.veprimet}>
          {dukeDale && <ActivityIndicator color={ngjyrat.primare} accessibilityLabel="Duke dalë" />}
          <Butoni
            lloji="rrezik"
            titulli={dukeDale ? "Duke dalë…" : "Dil nga llogaria"}
            onPress={dil}
            iCaktivizuar={dukeDale}
          />
        </View>
      ) : (
        <View style={styles.veprimet}>
          <Butoni titulli="Kyçu" onPress={() => router.push("/kycu")} />
          <Butoni
            lloji="dytesor"
            titulli="Regjistrohu"
            onPress={() => router.push("/regjistrohu")}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  permbajtja: {
    alignSelf: "center",
    width: "100%",
    maxWidth: permasat.gjeresiaMaksimale,
    padding: hapesira.xl,
    gap: hapesira.xxl,
  },
  kartela: {
    borderRadius: rrezet.madhe,
    padding: hapesira.xl,
    gap: hapesira.m,
  },
  veprimet: { gap: hapesira.m },
});
