import { ScrollView, StyleSheet, Text } from "react-native";

import DemoGjendja from "@/components/DemoGjendja";
import Kartela from "@/components/Kartela";

export default function Index() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pershendetje}>
        Mirë se vini! Ky është ekrani i parë i aplikacionit tim.
      </Text>

      {/* I njëjti komponent, i përdorur disa herë me props të ndryshme */}
      <Kartela
        titulli="Çfarë është React Native?"
        teksti="Një mënyrë për të ndërtuar aplikacione për telefon me JavaScript dhe TypeScript."
      />
      <Kartela
        titulli="Çfarë është Expo?"
        teksti="Një mjet që na lejon ta shohim aplikacionin menjëherë në telefon me Expo Go."
      />
      <Kartela
        titulli="Komponentët"
        teksti="Pjesë të vogla dhe të ripërdorshme të ekranit, si kjo kartelë."
      />

      <DemoGjendja />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  pershendetje: {
    fontSize: 16,
    marginBottom: 16,
  },
});
