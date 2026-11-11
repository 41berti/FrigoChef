import { ThemeProvider } from "expo-router";
import { NativeTabs } from "expo-router/native-tabs";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";

import { useTemaENavigimit } from "@/tema/navigimi";
import { useNgjyrat } from "@/tema/tema";

export default function RootLayout() {
  const tema = useTemaENavigimit();
  const ngjyrat = useNgjyrat();

  // Në iOS shiritin e tab-eve e vizaton vetë sistemi (Liquid Glass në iOS 26),
  // prandaj atje japim vetëm ngjyrën e tab-it të zgjedhur.
  // Në Android dhe në web i japim të gjitha ngjyrat nga tema.
  const ngjyratEShiritit =
    Platform.OS === "ios"
      ? {}
      : {
          backgroundColor: ngjyrat.sfondi,
          indicatorColor: ngjyrat.primareEZbehte,
          iconColor: { default: ngjyrat.tekstiDytesor, selected: ngjyrat.primareTeksti },
          labelStyle: {
            default: { color: ngjyrat.tekstiDytesor },
            selected: { color: ngjyrat.primareTeksti },
          },
        };

  return (
    // ThemeProvider ua jep ngjyrat tona header-ave dhe sfondit të çdo ekrani.
    <ThemeProvider value={tema}>
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
          <NativeTabs.Trigger.Icon sf={{ default: "book", selected: "book.fill" }} md="menu_book" />
        </NativeTabs.Trigger>
      </NativeTabs>
      {/* Ikonat e orës dhe baterisë bëhen të bardha në dark mode. */}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
