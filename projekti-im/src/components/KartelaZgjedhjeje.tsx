import { Image } from "expo-image";
import { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

import Ikona from "@/components/Ikona";
import Teksti from "@/components/Teksti";
import { hapesira, rrezet, useNgjyrat } from "@/tema/tema";

export type KartelaZgjedhjejeProps = {
  id: string;
  emri: string;
  emoji?: string;
  foto?: number;
  disabled?: boolean;
  gjeresia: number;
  zgjedhur: boolean;
  reduktuar: boolean;
  onToggle: (id: string) => void;
};

export default memo(function KartelaZgjedhjeje({
  id, emri, emoji, foto, disabled = false, gjeresia, zgjedhur, reduktuar, onToggle,
}: KartelaZgjedhjejeProps) {
  const n = useNgjyrat();
  const ms = reduktuar ? 0 : 140;

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={emri}
      accessibilityState={{ checked: zgjedhur, disabled }}
      disabled={disabled}
      aria-checked={zgjedhur}
      onPress={() => onToggle(id)}
      style={({ pressed }) => [
        { width: gjeresia },
        pressed && styles.shtypur,
      ]}
    >
      <Animated.View
        style={[
          styles.kartela,
          {
            backgroundColor: zgjedhur ? n.primareEZbehte : n.siperfaqja,
            borderColor: zgjedhur ? n.primareTeksti : n.kufiriIFushes,
            transitionProperty: ["backgroundColor", "borderColor"],
            transitionDuration: ms,
          },
        ]}
      >
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          aria-hidden
          style={[styles.vizuali, { backgroundColor: zgjedhur ? n.siperfaqja : n.mbushja }]}
        >
          {foto !== undefined ? (
            <Image source={foto} contentFit="contain" accessible={false} style={styles.foto} />
          ) : emoji ? (
            <Teksti style={styles.emoji}>{emoji}</Teksti>
          ) : (
            <Ikona emri="gatimi" madhesia={24} ngjyra="primareTeksti" />
          )}
        </View>
        <Teksti
          lloji="dytesorITheksuar"
          ngjyra={zgjedhur ? "primareTeksti" : "teksti"}
          style={styles.emri}
        >
          {emri}
        </Teksti>
        <Animated.View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          aria-hidden
          style={[
            styles.shenja,
            {
              backgroundColor: n.primare,
              opacity: zgjedhur ? 1 : 0,
              transform: [{ scale: zgjedhur || reduktuar ? 1 : 0.86 }],
              transitionProperty: ["opacity", "transform"],
              transitionDuration: ms,
            },
          ]}
        >
          <Ikona emri="po" madhesia={12} ngjyra="mbiPrimare" />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  kartela: {
    alignItems: "center",
    alignSelf: "stretch",
    borderRadius: rrezet.madhe,
    borderWidth: 1.5,
    flex: 1,
    gap: hapesira.s,
    paddingHorizontal: hapesira.xs,
    paddingVertical: hapesira.m,
  },
  vizuali: {
    alignItems: "center",
    borderRadius: rrezet.mesme,
    height: 52,
    justifyContent: "center",
    width: 56,
  },
  foto: { height: 48, width: 48 },
  emoji: { fontSize: 28, lineHeight: 40 },
  emri: { textAlign: "center" },
  shenja: {
    alignItems: "center",
    borderRadius: rrezet.pilule,
    height: 20,
    justifyContent: "center",
    position: "absolute",
    right: hapesira.xs + 2,
    top: hapesira.xs + 2,
    width: 20,
  },
  shtypur: { opacity: 0.76 },
});
