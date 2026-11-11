import { useRouter } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

import Butoni from "@/components/Butoni";
import FormaRecete from "@/components/FormaRecete";
import { hapesira, permasat } from "@/tema/tema";

// Ekrani "Recetë e re". Hapet mbi listën dhe mbyllet vetë pasi receta të ruhet.
export default function Shto() {
  const router = useRouter();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      // Në iOS përmbajtja ngrihet vetë mbi tastierë, që fusha aktive të mos mbulohet.
      automaticallyAdjustKeyboardInsets
      // Prekja e butonit punon edhe kur tastiera është e hapur.
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={styles.permbajtja}
    >
      {/* router.back() e mbyll këtë ekran. Lista rifreskohet vetë kur del prapë në pah. */}
      <FormaRecete onShtuar={() => router.back()} />
      <Butoni lloji="tekst" titulli="Anulo" onPress={() => router.back()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  permbajtja: {
    alignSelf: "center",
    gap: hapesira.s,
    maxWidth: permasat.gjeresiaMaksimale,
    padding: hapesira.xl,
    width: "100%",
  },
});
