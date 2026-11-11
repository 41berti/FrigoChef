import { useState } from "react";
import { StyleSheet, TextInput, type TextInputProps, View } from "react-native";

import Teksti from "@/components/Teksti";
import { hapesira, permasat, rrezet, shkronjat, useNgjyrat } from "@/tema/tema";

type FushaProps = TextInputProps & {
  // Teksti mbi fushë, që tregon çka shkruhet në të.
  etiketa: string;
  // Tekst i vogël nën fushë, që shpjegon si shkruhet. Nuk është i detyrueshëm.
  ndihma?: string;
};

// Fushë teksti me etiketë sipër. Korniza bëhet e gjelbër kur fusha është aktive.
// Me `multiline` fusha bëhet më e lartë dhe pranon disa rreshta.
export default function Fusha({ etiketa, ndihma, multiline, style, ...tjerat }: FushaProps) {
  const ngjyrat = useNgjyrat();
  const [eFokusuar, setEFokusuar] = useState(false);

  return (
    <View style={styles.grupi}>
      <Teksti lloji="dytesorITheksuar" ngjyra="tekstiDytesor">
        {etiketa}
      </Teksti>
      <TextInput
        accessibilityLabel={etiketa}
        accessibilityHint={ndihma}
        multiline={multiline}
        placeholderTextColor={ngjyrat.tekstiIZbehte}
        onFocus={() => setEFokusuar(true)}
        onBlur={() => setEFokusuar(false)}
        style={[
          styles.fusha,
          multiline && styles.shumeRreshta,
          {
            backgroundColor: ngjyrat.siperfaqja,
            borderColor: eFokusuar ? ngjyrat.primare : ngjyrat.kufiriIFushes,
            color: ngjyrat.teksti,
          },
          style,
        ]}
        {...tjerat}
      />
      {ndihma !== undefined && (
        <Teksti lloji="dytesor" ngjyra="tekstiDytesor">
          {ndihma}
        </Teksti>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grupi: { gap: hapesira.s },
  fusha: {
    borderRadius: rrezet.mesme,
    borderWidth: 1.5,
    fontSize: shkronjat.trupi.fontSize,
    minHeight: permasat.prekjaMinimale + 6,
    paddingHorizontal: hapesira.l,
    paddingVertical: hapesira.m,
  },
  // textAlignVertical e nis tekstin nga lart edhe në Android.
  shumeRreshta: { minHeight: 96, textAlignVertical: "top" },
});
