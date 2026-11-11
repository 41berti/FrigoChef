import { StyleSheet, View } from "react-native";

import Teksti from "@/components/Teksti";
import { hapesira, rrezet, useNgjyrat } from "@/tema/tema";

// Props: të dhënat që Kartela merr nga komponenti prind.
type KartelaProps = {
  titulli: string;
  teksti: string;
};

// Komponent i ripërdorshëm: shfaq një titull dhe një tekst brenda një kartele.
// Ngjyrat vijnë nga tema, prandaj kartela ndryshon vetë në dark mode.
export default function Kartela({ titulli, teksti }: KartelaProps) {
  const ngjyrat = useNgjyrat();

  return (
    <View
      style={[
        styles.kartela,
        { backgroundColor: ngjyrat.siperfaqja, borderColor: ngjyrat.kufiri },
      ]}
    >
      <Teksti lloji="trupiITheksuar">{titulli}</Teksti>
      <Teksti lloji="dytesor" ngjyra="tekstiDytesor">
        {teksti}
      </Teksti>
    </View>
  );
}

const styles = StyleSheet.create({
  kartela: {
    borderRadius: rrezet.madhe,
    borderWidth: 1,
    gap: hapesira.xs,
    padding: hapesira.l,
  },
});
