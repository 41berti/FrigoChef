import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

import Butoni from "@/components/Butoni";
import Fusha from "@/components/Fusha";
import Teksti from "@/components/Teksti";
import { kycu, mesazhiIGabimit, regjistrohu, validoLlogarine } from "@/data/llogaria";
import { useAutentikimi } from "@/gjendja/autentikimi";
import { hapesira, permasat, rrezet, useNgjyrat } from "@/tema/tema";

export default function FormaLlogarie({ regjistrim = false }: { regjistrim?: boolean }) {
  const { sesioni } = useAutentikimi();
  const { pas } = useLocalSearchParams<{ pas?: string }>();
  const router = useRouter();
  const ngjyrat = useNgjyrat();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [perseritja, setPerseritja] = useState("");
  const [dukeDerguar, setDukeDerguar] = useState(false);
  const neProces = useRef(false);
  const [gabimi, setGabimi] = useState<string | null>(null);
  const [konfirmimi, setKonfirmimi] = useState(false);
  // Vetëm kjo rrugë kthimi lejohet; URL-ja nuk mund të japë një redirect arbitrar.
  const parametrat = pas === "shto" ? { pas: "shto" } : {};

  async function dergo() {
    if (neProces.current) return;
    const problem = validoLlogarine(email, password, regjistrim, perseritja);
    setGabimi(problem);
    if (problem) return;
    neProces.current = true;
    setDukeDerguar(true);
    try {
      if (regjistrim) {
        const result = await regjistrohu(email, password);
        setKonfirmimi(result.duhetKonfirmim);
      } else {
        await kycu(email, password);
      }
      setPassword("");
      setPerseritja("");
    } catch (error) {
      setGabimi(mesazhiIGabimit(error));
    } finally {
      neProces.current = false;
      setDukeDerguar(false);
    }
  }

  if (sesioni && !dukeDerguar) return <Redirect href={pas === "shto" ? "/shto" : "/llogaria"} />;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustKeyboardInsets
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={styles.permbajtja}
    >
      <View style={[styles.hyrja, { backgroundColor: ngjyrat.primareEZbehte }]}>
        <Teksti lloji="titull" ngjyra="primareTeksti" accessibilityRole="header">
          {konfirmimi
            ? "Kontrollo email-in"
            : regjistrim
              ? "Mirë se vjen në FrigoChef"
              : "Mirë se u ktheve"}
        </Teksti>
        <Teksti ngjyra="tekstiDytesor">
          {konfirmimi
            ? "Nëse adresa mund të regjistrohet, do të marrësh një lidhje konfirmimi. Kontrollo edhe dosjen Spam. Konfirmo email-in, pastaj kthehu këtu dhe kyçu."
            : "Shfleto recetat lirisht. Me llogari mund të shtosh edhe recetat e tua."}
        </Teksti>
      </View>
      {konfirmimi ? (
        <Butoni
          titulli="Kyçu"
          onPress={() => router.replace({ pathname: "/kycu", params: parametrat })}
        />
      ) : (
        <View style={styles.forma}>
          <Fusha
            etiketa="Email-i"
            placeholder="emri@shembull.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            editable={!dukeDerguar}
          />
          <Fusha
            etiketa="Fjalëkalimi"
            ndihma={regjistrim ? "Së paku 8 karaktere. Përdor një fjalëkalim unik." : undefined}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete={regjistrim ? "new-password" : "current-password"}
            textContentType={regjistrim ? "newPassword" : "password"}
            editable={!dukeDerguar}
            onSubmitEditing={regjistrim ? undefined : dergo}
            returnKeyType={regjistrim ? "next" : "go"}
          />
          {regjistrim && (
            <Fusha
              etiketa="Përsërit fjalëkalimin"
              value={perseritja}
              onChangeText={setPerseritja}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              editable={!dukeDerguar}
              onSubmitEditing={dergo}
              returnKeyType="go"
            />
          )}
          {gabimi && (
            <Teksti selectable ngjyra="gabimi" accessibilityRole="alert">
              {gabimi}
            </Teksti>
          )}
          {dukeDerguar && (
            <ActivityIndicator color={ngjyrat.primare} accessibilityLabel="Duke dërguar" />
          )}
          <Butoni
            titulli={dukeDerguar ? "Duke pritur…" : regjistrim ? "Regjistrohu" : "Kyçu"}
            onPress={dergo}
            iCaktivizuar={dukeDerguar}
          />
          <Butoni
            lloji="tekst"
            titulli={regjistrim ? "Ke llogari? Kyçu" : "Nuk ke llogari? Regjistrohu"}
            iCaktivizuar={dukeDerguar}
            onPress={() =>
              router.replace({
                pathname: regjistrim ? "/kycu" : "/regjistrohu",
                params: parametrat,
              })
            }
          />
        </View>
      )}
      <Butoni
        lloji="tekst"
        titulli="Vazhdo me recetat"
        iCaktivizuar={dukeDerguar}
        onPress={() => router.replace("/(recetat)/recetat")}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  permbajtja: {
    alignSelf: "center",
    width: "100%",
    maxWidth: permasat.gjeresiaMaksimale,
    padding: hapesira.xl,
    gap: hapesira.xxl,
  },
  hyrja: { padding: hapesira.xl, borderRadius: rrezet.madhe, gap: hapesira.m },
  forma: { gap: hapesira.l },
});
