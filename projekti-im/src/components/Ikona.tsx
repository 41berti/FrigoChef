import { SymbolView } from "expo-symbols";

import { useNgjyrat, type Ngjyrat } from "@/tema/tema";

// Çdo ikonë ka dy emra: SF Symbols për iOS dhe Material Symbols për Android dhe web.
const ikonat = {
  po: { ios: "checkmark", android: "check", web: "check" },
  ora: { ios: "clock", android: "schedule", web: "schedule" },
  gatimi: { ios: "fork.knife", android: "restaurant", web: "restaurant" },
} as const;

type IkonaProps = {
  emri: keyof typeof ikonat;
  madhesia?: number;
  // Emri i ngjyrës në temë.
  ngjyra?: keyof Ngjyrat;
};

// Ikonë e vogël me vija, si në skica. Është zbukurim, prandaj lexuesi i ekranit e anashkalon.
export default function Ikona({ emri, madhesia = 18, ngjyra = "tekstiDytesor" }: IkonaProps) {
  const ngjyrat = useNgjyrat();

  return (
    <SymbolView
      name={ikonat[emri]}
      size={madhesia}
      tintColor={ngjyrat[ngjyra]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}
