import { StyleSheet, View } from "react-native";

import Teksti from "@/components/Teksti";
import { hapesira, useNgjyrat } from "@/tema/tema";

type HapiProps = {
  numri: number;
  teksti: string;
  // Hapi i fundit s'ka vijë poshtë rrethit, sepse s'ka hap tjetër pas tij.
  iFundit: boolean;
};

// Një hap i recetës: rrethi me numër majtas, teksti djathtas, si në skicën 3.
// Vija mes rrathëve i lidh hapat njëri me tjetrin.
export default function Hapi({ numri, teksti, iFundit }: HapiProps) {
  const ngjyrat = useNgjyrat();

  return (
    <View accessible accessibilityLabel={`Hapi ${numri}: ${teksti}`} style={styles.hapi}>
      <View style={styles.majtas}>
        <View style={[styles.rrethi, { backgroundColor: ngjyrat.primare }]}>
          <Teksti lloji="imet" ngjyra="mbiPrimare">
            {numri}
          </Teksti>
        </View>
        {/* flex: 1 e zgjat vijën deri te hapi tjetër, sado i gjatë të jetë teksti. */}
        {!iFundit && <View style={[styles.vija, { backgroundColor: ngjyrat.kufiri }]} />}
      </View>
      <Teksti style={styles.teksti}>{teksti}</Teksti>
    </View>
  );
}

const styles = StyleSheet.create({
  hapi: { flexDirection: "row", gap: hapesira.m },
  majtas: { alignItems: "center", width: 26 },
  rrethi: {
    alignItems: "center",
    borderRadius: 13,
    height: 26,
    justifyContent: "center",
    width: 26,
  },
  vija: { flex: 1, marginVertical: hapesira.xs, width: 2 },
  // paddingBottom lë hapësirë mes hapave, dhe vija majtas e mbush atë hapësirë.
  teksti: { flex: 1, paddingBottom: hapesira.l, paddingTop: 1 },
});
