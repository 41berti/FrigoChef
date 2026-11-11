import { StyleSheet, View } from "react-native";

import Teksti from "@/components/Teksti";
import { hapesira, rrezet, useNgjyrat } from "@/tema/tema";

type EtiketaProps = {
  titulli: string;
  // "theks" është portokalli ("deri 20 min"), "primare" është e gjelbër ("ke 5 nga 6 përbërës").
  lloji?: "theks" | "primare";
};

// Etiketë e vogël në formë pilule, me tekst me ngjyrë mbi sfond të lehtë të së njëjtës ngjyrë.
export default function Etiketa({ titulli, lloji = "theks" }: EtiketaProps) {
  const ngjyrat = useNgjyrat();
  const eshteTheks = lloji === "theks";

  return (
    <View
      style={[
        styles.etiketa,
        { backgroundColor: eshteTheks ? ngjyrat.theksiIZbehte : ngjyrat.primareEZbehte },
      ]}
    >
      <Teksti lloji="imet" ngjyra={eshteTheks ? "theksi" : "primareTeksti"}>
        {titulli}
      </Teksti>
    </View>
  );
}

const styles = StyleSheet.create({
  etiketa: {
    alignSelf: "flex-start",
    borderRadius: rrezet.pilule,
    paddingHorizontal: hapesira.s + 2,
    paddingVertical: 2,
  },
});
