import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

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
    onShtuar();
  }

  return (
    <View style={styles.forma}>
      <TextInput
        style={styles.fusha}
        placeholder="Titulli i recetës"
        placeholderTextColor="#888888"
        value={titulli}
        onChangeText={setTitulli}
        maxLength={100}
      />
      <TextInput
        style={styles.fusha}
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
      {gabimi !== null && <Text style={styles.gabimi}>{gabimi}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  forma: { padding: 16, gap: 8 },
  fusha: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dddddd",
    color: "#333333",
    padding: 12,
  },
  buton: {
    backgroundColor: "#208AEF",
    borderRadius: 8,
    paddingVertical: 12,
  },
  butonTeksti: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
  },
  gabimi: { color: "#c0392b" },
});
