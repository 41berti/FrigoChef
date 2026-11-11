import { useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";

import Butoni from "@/components/Butoni";
import Fusha from "@/components/Fusha";
import Teksti from "@/components/Teksti";
import { supabase } from "@/data/supabase";
import { hapesira } from "@/tema/tema";

// Props: ekrani na jep funksionin që thirret pasi receta të ruhet në Supabase.
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
    Keyboard.dismiss();
    onShtuar();
  }

  return (
    <View style={styles.forma}>
      <Fusha
        etiketa="Titulli i recetës"
        placeholder="p.sh. Omëletë me perime"
        value={titulli}
        onChangeText={setTitulli}
        maxLength={100}
      />
      <Fusha
        etiketa="Koha në minuta"
        placeholder="p.sh. 15"
        value={koha}
        onChangeText={setKoha}
        keyboardType="number-pad"
        maxLength={3}
      />
      {gabimi !== null && (
        <Teksti lloji="dytesor" ngjyra="gabimi" accessibilityRole="alert">
          {gabimi}
        </Teksti>
      )}
      <Butoni
        titulli={dukeRuajtur ? "Duke ruajtur…" : "Shto recetën"}
        onPress={shtoReceten}
        iCaktivizuar={dukeRuajtur}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  forma: { gap: hapesira.l },
});
