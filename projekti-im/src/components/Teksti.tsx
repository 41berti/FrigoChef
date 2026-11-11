import { Text, type TextProps } from "react-native";

import { shkronjat, useNgjyrat, type Ngjyrat } from "@/tema/tema";

type TekstiProps = TextProps & {
  // Madhësia dhe trashësia, sipas emrave te `shkronjat` në temë.
  lloji?: keyof typeof shkronjat;
  // Emri i ngjyrës në temë, p.sh. "tekstiDytesor".
  ngjyra?: keyof Ngjyrat;
};

// Teksti i aplikacionit. Përdoret në vend të <Text>, që madhësia dhe ngjyra
// të vijnë nga tema dhe të ndryshojnë vetë në dark mode.
export default function Teksti({
  lloji = "trupi",
  ngjyra = "teksti",
  style,
  ...tjerat
}: TekstiProps) {
  const ngjyrat = useNgjyrat();

  return <Text style={[shkronjat[lloji], { color: ngjyrat[ngjyra] }, style]} {...tjerat} />;
}
