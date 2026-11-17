import { ThemeProvider } from "expo-router";
import { NativeTabs } from "expo-router/native-tabs";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Platform, View } from "react-native";

import Butoni from "@/components/Butoni";
import Teksti from "@/components/Teksti";
import { AutentikimiProvider, useAutentikimi } from "@/gjendja/autentikimi";
import { ZgjedhjaProvider } from "@/gjendja/zgjedhja";
import { useTemaENavigimit } from "@/tema/navigimi";
import { hapesira, useNgjyrat } from "@/tema/tema";

export default function RootLayout() {
  return (
    <AutentikimiProvider>
      <Navigimi />
    </AutentikimiProvider>
  );
}

function Navigimi() {
  const tema = useTemaENavigimit();
  const ngjyrat = useNgjyrat();
  const { dukeNgarkuar, gabimi, provoPerseri } = useAutentikimi();

  // Asnjë redirect nuk ndodh para restaurimit të sesionit.
  if (dukeNgarkuar || gabimi) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          gap: hapesira.l,
          padding: hapesira.xxl,
          backgroundColor: ngjyrat.sfondi,
        }}
      >
        {dukeNgarkuar ? (
          <ActivityIndicator
            size="large"
            color={ngjyrat.primare}
            accessibilityLabel="Duke hapur FrigoChef"
          />
        ) : (
          <>
            <Teksti selectable ngjyra="gabimi" accessibilityRole="alert">
              {gabimi}
            </Teksti>
            <Butoni titulli="Provo përsëri" onPress={provoPerseri} />
          </>
        )}
        <StatusBar style="auto" />
      </View>
    );
  }

  // Në iOS shiritin e tab-eve e vizaton vetë sistemi (Liquid Glass në iOS 26),
  // prandaj atje japim vetëm ngjyrën e tab-it të zgjedhur.
  // Në Android dhe në web i japim të gjitha ngjyrat nga tema.
  const ngjyratEShiritit =
    Platform.OS === "ios"
      ? {}
      : {
          backgroundColor: ngjyrat.sfondi,
          indicatorColor: ngjyrat.primareEZbehte,
          iconColor: {
            default: ngjyrat.tekstiDytesor,
            selected: ngjyrat.primareTeksti,
          },
          labelStyle: {
            default: { color: ngjyrat.tekstiDytesor },
            selected: { color: ngjyrat.primareTeksti },
          },
        };

  return (
    // ThemeProvider ua jep ngjyrat tona header-ave dhe sfondit të çdo ekrani.
    <ThemeProvider value={tema}>
      {/* ZgjedhjaProvider i rrethon të dy tab-et, që të gjitha ekranet ta shohin
          të njëjtën zgjedhje të përbërësve. */}
      <ZgjedhjaProvider>
        {/* Fallback-u web i vendos tab-et lart me position: fixed; lëmë vend
            që të mos mbulojnë titujt. Tab-et native mbeten poshtë si më parë. */}
        <View
          style={{
            flex: 1,
            backgroundColor: ngjyrat.sfondi,
            paddingTop: Platform.OS === "web" ? hapesira.xxxl * 2 : 0,
          }}
        >
          {/* Çdo Trigger është një tab. `name` është emri i dosjes te src/app/. */}
          <NativeTabs tintColor={ngjyrat.primare} {...ngjyratEShiritit}>
            <NativeTabs.Trigger name="(frigoriferi)">
              <NativeTabs.Trigger.Label>Frigoriferi</NativeTabs.Trigger.Label>
              {/* sf është ikona në iOS (SF Symbols), md është ikona në Android (Material). */}
              <NativeTabs.Trigger.Icon
                sf={{ default: "refrigerator", selected: "refrigerator.fill" }}
                md="kitchen"
              />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="(recetat)">
              <NativeTabs.Trigger.Label>Recetat</NativeTabs.Trigger.Label>
              <NativeTabs.Trigger.Icon
                sf={{ default: "book", selected: "book.fill" }}
                md="menu_book"
              />
            </NativeTabs.Trigger>
          </NativeTabs>
        </View>
      </ZgjedhjaProvider>
      {/* Ikonat e orës dhe baterisë bëhen të bardha në dark mode. */}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
