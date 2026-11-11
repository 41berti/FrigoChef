import { useRouter } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

import Butoni from "@/components/Butoni";
import Teksti from "@/components/Teksti";
import { hapesira, permasat } from "@/tema/tema";

// Ballina. Zgjedhja e përbërësve ndërtohet në issue-n e Ballinës dhe të Listës.
// Deri atëherë, ky ekran e çon përdoruesin te të gjitha recetat.
export default function Frigoriferi() {
  const router = useRouter();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.permbajtja}
    >
      <Teksti lloji="titullIMadh">Çka ke në frigorifer?</Teksti>
      <Teksti ngjyra="tekstiDytesor">
        Së shpejti këtu i zgjedh përbërësit që ke sot. Deri atëherë, shiko të gjitha recetat.
      </Teksti>
      {/* /recetat është në tab-in tjetër, prandaj navigimi e ndërron edhe tab-in. */}
      <Butoni titulli="Shiko recetat" onPress={() => router.navigate("/recetat")} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  permbajtja: {
    alignSelf: "center",
    gap: hapesira.l,
    maxWidth: permasat.gjeresiaMaksimale,
    padding: hapesira.xl,
    width: "100%",
  },
});
