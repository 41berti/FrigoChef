import { Pressable, StyleSheet } from "react-native";

import Ikona from "@/components/Ikona";
import Teksti from "@/components/Teksti";
import { hapesira, permasat, rrezet, useNgjyrat } from "@/tema/tema";

type ChipProps = {
  titulli: string;
  etiketa?: string;
  lloji: "filter" | "heq";
  onPress: () => void;
  iZgjedhur?: boolean;
};

export default function Chip({ titulli, etiketa, lloji, onPress, iZgjedhur = false }: ChipProps) {
  const n = useNgjyrat();
  const hiq = lloji === "heq";
  const iTheksuar = hiq || iZgjedhur;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={hiq ? undefined : { selected: iZgjedhur }}
      aria-pressed={hiq ? undefined : iZgjedhur}
      accessibilityLabel={etiketa ?? titulli}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: iTheksuar ? n.primareEZbehte : n.siperfaqja },
        !hiq && [styles.filter, { borderColor: iZgjedhur ? n.primareTeksti : n.kufiriIFushes }],
        pressed && styles.iShtypur,
      ]}
    >
      <Teksti lloji="dytesorITheksuar" ngjyra={iTheksuar ? "primareTeksti" : "teksti"}>{titulli}</Teksti>
      {hiq && <Ikona emri="hiq" madhesia={14} ngjyra="primareTeksti" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: "center",
    borderRadius: rrezet.pilule,
    flexDirection: "row",
    gap: hapesira.s,
    minHeight: permasat.prekjaMinimale,
    paddingHorizontal: hapesira.m,
    paddingVertical: hapesira.s,
  },
  filter: { borderWidth: 1 },
  iShtypur: { opacity: 0.72 },
});
