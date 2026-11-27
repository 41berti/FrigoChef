import KartelaZgjedhjeje, { type KartelaZgjedhjejeProps } from "@/components/KartelaZgjedhjeje";

const ilustrimet: Record<string, number | undefined> = {
  apple: require("@/assets/ingredients/apple.png"),
  basil: require("@/assets/ingredients/basil.png"),
  "bell-pepper": require("@/assets/ingredients/bell-pepper.png"),
  carrot: require("@/assets/ingredients/carrot.png"),
  chicken: require("@/assets/ingredients/chicken.png"),
  cucumber: require("@/assets/ingredients/cucumber.png"),
  egg: require("@/assets/ingredients/egg.png"),
  garlic: require("@/assets/ingredients/garlic.png"),
  lemon: require("@/assets/ingredients/lemon.png"),
  mushroom: require("@/assets/ingredients/mushroom.png"),
  "olive-oil": require("@/assets/ingredients/olive-oil.png"),
  pasta: require("@/assets/ingredients/pasta.png"),
  rice: require("@/assets/ingredients/rice.png"),
  tomato: require("@/assets/ingredients/tomato.png"),
  "white-cheese": require("@/assets/ingredients/white-cheese.png"),
  zucchini: require("@/assets/ingredients/zucchini.png"),
};

type KartelaPerberesiProps = Omit<KartelaZgjedhjejeProps, "foto"> & { ilustrimi?: string };

export default function KartelaPerberesi({ ilustrimi, ...props }: KartelaPerberesiProps) {
  const foto = ilustrimi ? ilustrimet[ilustrimi] : undefined;
  return <KartelaZgjedhjeje {...props} foto={foto} />;
}
