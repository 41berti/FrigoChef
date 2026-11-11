import { useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";

import Butoni from "@/components/Butoni";
import Fusha from "@/components/Fusha";
import Teksti from "@/components/Teksti";
import { shtoReceten } from "@/data/recetat";
import { hapesira } from "@/tema/tema";
import { dridhjeSuksesi } from "@/veglat/dridhja";

// Props: ekrani na jep funksionin që thirret pasi receta të ruhet në Supabase.
type FormaReceteProps = {
  onShtuar: () => void;
};

// E ndan tekstin në pjesë, ua heq hapësirat anash dhe i largon pjesët bosh.
// P.sh. "vezë, djathë,, domate" bëhet ["vezë", "djathë", "domate"].
function ndajTekstin(teksti: string, ndaresi: RegExp): string[] {
  return teksti
    .split(ndaresi)
    .map((pjesa) => pjesa.trim())
    .filter((pjesa) => pjesa !== "");
}

export default function FormaRecete({ onShtuar }: FormaReceteProps) {
  const [titulli, setTitulli] = useState("");
  const [koha, setKoha] = useState("");
  // TextInput jep tekst, prandaj përbërësit dhe hapat ruhen si tekst deri te ruajtja.
  const [perberesitTekst, setPerberesitTekst] = useState("");
  const [hapatTekst, setHapatTekst] = useState("");
  const [gabimi, setGabimi] = useState<string | null>(null);
  const [dukeRuajtur, setDukeRuajtur] = useState(false);

  async function ruajReceten() {
    const titulliFinal = titulli.trim();
    // TextInput jep gjithmonë tekst, prandaj koha kthehet në numër para kontrollit.
    const kohaMinuta = Number(koha);
    // Përbërësit ndahen me presje ose me rresht të ri dhe kthehen në shkronja të vogla.
    // Set-i i heq të përsëriturit, që "Vezë" dhe "vezë" të numërohen një herë.
    const perberesit = [
      ...new Set(ndajTekstin(perberesitTekst, /[,\n]/).map((p) => p.toLowerCase())),
    ];
    // Çdo rresht është një hap.
    const hapat = ndajTekstin(hapatTekst, /\n/);

    if (titulliFinal === "") {
      setGabimi("Shkruaj titullin e recetës.");
      return;
    }

    // Kufijtë janë të njëjtë me policy-n "shtim publik" në Supabase.
    if (!Number.isInteger(kohaMinuta) || kohaMinuta < 1 || kohaMinuta > 600) {
      setGabimi("Koha duhet të jetë numër i plotë nga 1 deri në 600.");
      return;
    }

    if (perberesit.length < 1 || perberesit.length > 20) {
      setGabimi("Shkruaj nga 1 deri në 20 përbërës, të ndarë me presje.");
      return;
    }

    if (hapat.length > 30) {
      setGabimi("Receta mund të ketë më së shumti 30 hapa.");
      return;
    }

    setGabimi(null);
    setDukeRuajtur(true);

    const { error } = await shtoReceten({
      titulli: titulliFinal,
      koha_minuta: kohaMinuta,
      perberesit,
      hapat,
    });

    setDukeRuajtur(false);

    if (error) {
      setGabimi(error.message);
      return;
    }

    setTitulli("");
    setKoha("");
    setPerberesitTekst("");
    setHapatTekst("");
    Keyboard.dismiss();
    // Dridhje e shkurtër, që përdoruesi ta ndiejë se receta u ruajt.
    dridhjeSuksesi();
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
      <Fusha
        etiketa="Përbërësit"
        ndihma="Ndaji me presje."
        placeholder="p.sh. vezë, djathë, domate"
        value={perberesitTekst}
        onChangeText={setPerberesitTekst}
        autoCapitalize="none"
        multiline
      />
      <Fusha
        etiketa="Hapat (opsionale)"
        ndihma="Shkruaj një hap në çdo rresht."
        placeholder="Një hap për rresht"
        value={hapatTekst}
        onChangeText={setHapatTekst}
        multiline
      />
      {gabimi !== null && (
        <Teksti lloji="dytesor" ngjyra="gabimi" accessibilityRole="alert">
          {gabimi}
        </Teksti>
      )}
      <Butoni
        titulli={dukeRuajtur ? "Duke ruajtur…" : "Shto recetën"}
        onPress={ruajReceten}
        iCaktivizuar={dukeRuajtur}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  forma: { gap: hapesira.l },
});
