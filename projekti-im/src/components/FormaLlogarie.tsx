import { usePreferencat } from "@/gjendja/preferencat";
import type { Celesi } from "@/i18n/perkthimi";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

import Butoni from "@/components/Butoni";
import Fusha from "@/components/Fusha";
import Teksti from "@/components/Teksti";
import { kycu, mesazhiIGabimit, regjistrohu, validoLlogarine } from "@/data/llogaria";
import { useAutentikimi } from "@/gjendja/autentikimi";
import { hapesira, permasat, rrezet, useNgjyrat } from "@/tema/tema";

export default function FormaLlogarie({ regjistrim = false }: { regjistrim?: boolean }) {
  const { t } = usePreferencat();
  const { sesioni } = useAutentikimi();
  const { pas } = useLocalSearchParams<{ pas?: string }>();
  const router = useRouter();
  const ngjyrat = useNgjyrat();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [perseritja, setPerseritja] = useState("");
  const [dukeDerguar, setDukeDerguar] = useState(false);
  const neProces = useRef(false);
  const [gabimi, setGabimi] = useState<Celesi | null>(null);
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

  useFocusEffect(
    useCallback(() => {
      if (!sesioni || dukeDerguar) return;
      if (pas === "shto") router.replace("/shto");
      else router.dismissTo("/llogaria");
    }, [sesioni, dukeDerguar, pas, router]),
  );

  if (sesioni && !dukeDerguar) return null;

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
            ? t("auth.check")
            : regjistrim
              ? t("auth.welcome")
              : t("auth.welcomeBack")}
        </Teksti>
        <Teksti ngjyra="tekstiDytesor">
          {konfirmimi
            ? t("auth.confirmHint")
            : t("auth.browseHint")}
        </Teksti>
      </View>
      {konfirmimi ? (
        <Butoni
          titulli={t("nav.login")}
          onPress={() => router.replace({ pathname: "/kycu", params: parametrat })}
        />
      ) : (
        <View style={styles.forma}>
          <Fusha
            etiketa={t("auth.email")}
            placeholder={t("auth.emailExample")}
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
            etiketa={t("auth.password")}
            ndihma={regjistrim ? t("auth.passwordHint") : undefined}
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
              etiketa={t("auth.repeat")}
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
              {t(gabimi)}
            </Teksti>
          )}
          {dukeDerguar && (
            <ActivityIndicator color={ngjyrat.primare} accessibilityLabel={t("auth.sending")} />
          )}
          <Butoni
            titulli={dukeDerguar ? t("auth.wait") : regjistrim ? t("nav.register") : t("nav.login")}
            onPress={dergo}
            iCaktivizuar={dukeDerguar}
          />
          <Butoni
            lloji="tekst"
            titulli={regjistrim ? t("auth.haveAccount") : t("auth.newAccount")}
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
        titulli={t("auth.continue")}
        iCaktivizuar={dukeDerguar}
        onPress={() => router.dismissTo("/recetat")}
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
