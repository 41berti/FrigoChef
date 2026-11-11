import { Pressable, StyleSheet } from "react-native";

import Ikona from "@/components/Ikona";
import Teksti from "@/components/Teksti";
import { hapesira, rrezet, useNgjyrat } from "@/tema/tema";

type ChipProps = {
  titulli: string;
  onPress: () => void;
  // I zgjedhur: mbushet me të gjelbër dhe merr shenjën e zgjedhjes.
  iZgjedhur?: boolean;
  // Me kornizë me vija, për chip-in "+ tjetër" që hap fushën e shtimit.
  meVija?: boolean;
};

// Chip-i i një përbërësi, si në skicën 1. Prekja e zgjedh ose e heq përbërësin.
export default function Chip({ titulli, onPress, iZgjedhur = false, meVija = false }: ChipProps) {
  const ngjyrat = useNgjyrat();

  return (
    <Pressable
      // Lexuesi i ekranit e lexon si kuti zgjedhjeje: "vezë, e zgjedhur".
      accessibilityRole={meVija ? "button" : "checkbox"}
      accessibilityState={meVija ? undefined : { checked: iZgjedhur }}
      accessibilityLabel={titulli}
      onPress={onPress}
      // Chip-i është pak më i ulët se 44 pt, prandaj zona e prekjes zgjerohet nga jashtë.
      hitSlop={4}
      style={({ pressed }) => [
        styles.chip,
        iZgjedhur
          ? { backgroundColor: ngjyrat.primare, borderColor: ngjyrat.primare }
          : { backgroundColor: ngjyrat.siperfaqja, borderColor: ngjyrat.kufiriIFushes },
        meVija && styles.meVija,
        pressed && styles.iShtypur,
      ]}
    >
      {iZgjedhur && <Ikona emri="po" madhesia={14} ngjyra="mbiPrimare" />}
      <Teksti
        lloji={iZgjedhur ? "dytesorITheksuar" : "dytesor"}
        ngjyra={iZgjedhur ? "mbiPrimare" : meVija ? "tekstiDytesor" : "teksti"}
      >
        {titulli}
      </Teksti>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: "center",
    borderRadius: rrezet.pilule,
    borderWidth: 1.5,
    flexDirection: "row",
    gap: hapesira.xs + 2,
    minHeight: 38,
    paddingHorizontal: hapesira.m + 2,
    paddingVertical: hapesira.s,
  },
  meVija: { borderStyle: "dashed" },
  iShtypur: { opacity: 0.6 },
});
