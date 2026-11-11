import { useState } from "react";
import { StyleSheet, TextInput, type TextInputProps, View } from "react-native";

import Teksti from "@/components/Teksti";
import { hapesira, permasat, rrezet, shkronjat, useNgjyrat } from "@/tema/tema";

type FushaProps = TextInputProps & {
  // Teksti mbi fushë, që tregon çka shkruhet në të.
  etiketa: string;
};

// Fushë teksti me etiketë sipër. Korniza bëhet e gjelbër kur fusha është aktive.
export default function Fusha({ etiketa, style, ...tjerat }: FushaProps) {
  const ngjyrat = useNgjyrat();
  const [eFokusuar, setEFokusuar] = useState(false);

  return (
    <View style={styles.grupi}>
      <Teksti lloji="dytesorITheksuar" ngjyra="tekstiDytesor">
        {etiketa}
      </Teksti>
      <TextInput
        accessibilityLabel={etiketa}
        placeholderTextColor={ngjyrat.tekstiIZbehte}
        onFocus={() => setEFokusuar(true)}
        onBlur={() => setEFokusuar(false)}
        style={[
          styles.fusha,
          {
            backgroundColor: ngjyrat.siperfaqja,
            borderColor: eFokusuar ? ngjyrat.primare : ngjyrat.kufiriIFushes,
            color: ngjyrat.teksti,
          },
          style,
        ]}
        {...tjerat}
      />
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
});
