import { useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { supabase } from "@/data/supabase";

// Props: Ballina na jep funksionin që e rifreskon listën pasi të shtohet receta.
type FormaReceteProps = {
  onShtuar: () => void;
};

export default function FormaRecete({ onShtuar }: FormaReceteProps) {
  const [titulli, setTitulli] = useState("");
  const [koha, setKoha] = useState("");
  const [gabimi, setGabimi] = useState<string | null>(null);
  const [dukeRuajtur, setDukeRuajtur] = useState(false);

  // Hapësira e sigurt poshtë, që forma të mos bjerë nën home indicator-in e iPhone-it.
  const insets = useSafeAreaInsets();

  async function shtoReceten() {
    const titulliFinal = titulli.trim();
    // TextInput jep gjithmonë tekst, prandaj koha kthehet në numër para kontrollit.
    const kohaMinuta = Number(koha);

    if (titulliFinal === "") {
      setGabimi("Shkruaj titullin e recetës.");
      return;
    }

    // Kufijtë janë të njëjtë me policy-n "shtim publik" në Supabase.
    if (!Number.isInteger(kohaMinuta) || kohaMinuta < 1 || kohaMinuta > 600) {
      setGabimi("Koha duhet të jetë numër i plotë nga 1 deri në 600.");
      return;
    }

    setGabimi(null);
    setDukeRuajtur(true);

    // Id-në dhe krijuar_me i vendos vetë Supabase.
    const { error } = await supabase
      .from("recetat")
      .insert({ titulli: titulliFinal, koha_minuta: kohaMinuta });

    setDukeRuajtur(false);

    if (error) {
      setGabimi(error.message);
      return;
    }

    setTitulli("");
    setKoha("");
    Keyboard.dismiss();
    onShtuar();
  }

  return (
    // Prekja në hapësirën e zbrazët të formës e mbyll tastierën.
    <Pressable
      style={[styles.forma, { paddingBottom: Math.max(insets.bottom, 12) }]}
      onPress={Keyboard.dismiss}
      accessible={false}
      focusable={false}
    >
      <TextInput
        style={styles.fusha}
        placeholder="Titulli i recetës"
        placeholderTextColor="#888888"
        value={titulli}
        onChangeText={setTitulli}
        maxLength={100}
      />
      <View style={styles.rreshti}>
        <TextInput
          style={[styles.fusha, styles.koha]}
          placeholder="Koha në minuta"
          placeholderTextColor="#888888"
          value={koha}
          onChangeText={setKoha}
          keyboardType="number-pad"
          maxLength={3}
        />
        <Pressable style={styles.buton} onPress={shtoReceten} disabled={dukeRuajtur}>
          <Text style={styles.butonTeksti}>
            {dukeRuajtur ? "Duke ruajtur…" : "Shto recetën"}
          </Text>
        </Pressable>
      </View>
      {gabimi !== null && <Text style={styles.gabimi}>{gabimi}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  forma: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  rreshti: { flexDirection: "row", gap: 8 },
  // 44 pt është lartësia minimale e prekjes sipas Apple-it.
  fusha: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dddddd",
    color: "#333333",
    minHeight: 44,
    paddingHorizontal: 12,
  },
  koha: { flex: 1 },
  buton: {
    flex: 1,
    backgroundColor: "#208AEF",
    borderRadius: 8,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 8,
  },
  butonTeksti: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
  },
  gabimi: { color: "#c0392b" },
});
