import { useRouter } from "expo-router";

import Butoni from "@/components/Butoni";

export default function ButoniLlogaria() {
  const router = useRouter();
  return (
    <Butoni
      titulli="Llogaria"
      lloji="tekst"
      onPress={() => router.push("/llogaria")}
    />
  );
}
