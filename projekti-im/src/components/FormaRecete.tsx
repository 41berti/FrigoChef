import { usePreferencat } from "@/gjendja/preferencat";
import type { Celesi } from "@/i18n/perkthimi";
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
  const { t } = usePreferencat();
  const [titulli, setTitulli] = useState("");
  const [koha, setKoha] = useState("");
  // TextInput jep tekst, prandaj përbërësit dhe hapat ruhen si tekst deri te ruajtja.
  const [perberesitTekst, setPerberesitTekst] = useState("");
  const [hapatTekst, setHapatTekst] = useState("");
  const [gabimi, setGabimi] = useState<Celesi | null>(null);
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
      setGabimi("editor.needTitle");
      return;
    }

    // Kufijtë janë të njëjtë me policy-n e shtimit në Supabase.
    if (!Number.isInteger(kohaMinuta) || kohaMinuta < 1 || kohaMinuta > 600) {
      setGabimi("editor.needTime");
      return;
    }

    if (perberesit.length < 1 || perberesit.length > 20) {
      setGabimi("editor.needIngredients");
      return;
    }

    if (hapat.length > 30) {
      setGabimi("editor.tooManySteps");
      return;
    }

    setGabimi(null);
    setDukeRuajtur(true);

    try {
      const { error } = await shtoReceten({
        titulli: titulliFinal,
        koha_minuta: kohaMinuta,
        perberesit,
        hapat,
      });
      if (error) {
        setGabimi("editor.saveError");
        return;
      }
    } catch {
      setGabimi("editor.network");
      return;
    } finally {
      setDukeRuajtur(false);
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
        etiketa={t("editor.title")}
        placeholder={t("editor.titleExample")}
        value={titulli}
        onChangeText={setTitulli}
        maxLength={100}
      />
      <Fusha
        etiketa={t("editor.time")}
        placeholder={t("editor.timeExample")}
        value={koha}
        onChangeText={setKoha}
        keyboardType="number-pad"
        maxLength={3}
      />
      <Fusha
        etiketa={t("detail.ingredients")}
        ndihma={t("editor.commas")}
        placeholder={t("editor.ingredientsExample")}
        value={perberesitTekst}
        onChangeText={setPerberesitTekst}
        autoCapitalize="none"
        multiline
      />
      <Fusha
        etiketa={t("editor.steps")}
        ndihma={t("editor.stepsHint")}
        placeholder={t("editor.stepsExample")}
        value={hapatTekst}
        onChangeText={setHapatTekst}
        multiline
      />
      {gabimi !== null && (
        <Teksti lloji="dytesor" ngjyra="gabimi" accessibilityRole="alert">
          {t(gabimi)}
        </Teksti>
      )}
      <Butoni
        titulli={dukeRuajtur ? t("editor.saving") : t("editor.save")}
        onPress={ruajReceten}
        iCaktivizuar={dukeRuajtur}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  forma: { gap: hapesira.l },
});
