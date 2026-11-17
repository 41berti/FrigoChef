import { useNavigation, useRouter } from "expo-router";
import { StackActions } from "expo-router/react-navigation";

import Butoni from "@/components/Butoni";

export default function ButoniLlogaria() {
  const router = useRouter();
  const navigation = useNavigation();

  function hapLlogarine() {
    // Nga Frigoriferi, Recetat mund të ketë ende të hapura detajet ose një formë.
    const tabs = navigation.getParent();
    const recetat = tabs?.getState().routes.find((route) => route.name === "(recetat)")?.state;
    if (recetat?.key && (recetat.index ?? 0) > 0) {
      tabs?.dispatch({ ...StackActions.popToTop(), target: recetat.key });
    }
    router.navigate("/llogaria", { withAnchor: true });
  }

  return (
    <Butoni
      titulli="Llogaria"
      lloji="tekst"
      onPress={hapLlogarine}
    />
  );
}
