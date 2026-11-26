import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocales } from "expo-localization";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Appearance, Platform, useColorScheme } from "react-native";

import {
  fillestare,
  gjuhaEPajisjes,
  krijoRuajtjen,
  lexoPreferencat,
  temaEfektive,
  type Preferenca,
} from "@/data/preferencat";
import { perkthyesi, type Gjuha, type Perkthe } from "@/i18n/perkthimi";

const celesi = "frigochef.preferences.v1";
const ruaj = krijoRuajtjen((v) => AsyncStorage.setItem(celesi, v));

type Gjendja = {
  gjuha: Gjuha;
  pamja: Preferenca["pamja"];
  tema: "light" | "dark";
  t: Perkthe;
  ndrysho: (v: Partial<Preferenca>) => void;
  gabimRuajtjeje: boolean;
};
const Konteksti = createContext<Gjendja | null>(null);

function zbatoPamjen(pamja: Preferenca["pamja"]) {
  if (Platform.OS !== "web") Appearance.setColorScheme(pamja === "system" ? "auto" : pamja);
}

export function PreferencatProvider({ children }: { children: ReactNode }) {
  const [vlera, setVlera] = useState<Preferenca | null>(null);
  const fundit = useRef(fillestare);
  const [gabimRuajtjeje, setGabim] = useState(false);
  const lokalet = useLocales();
  const sistemi = useColorScheme();

  useEffect(() => {
    let aktiv = true;
    async function rikthe() {
      let v = fillestare;
      try {
        v = lexoPreferencat(await AsyncStorage.getItem(celesi));
      } catch {
        if (aktiv) setGabim(true);
      }
      if (!aktiv) return;
      zbatoPamjen(v.pamja);
      fundit.current = v;
      setVlera(v);
    }
    void rikthe();
    return () => {
      aktiv = false;
    };
  }, []);

  const gjuha = vlera?.gjuha ?? gjuhaEPajisjes(lokalet.map((l) => l.languageCode));
  const pamja = vlera?.pamja ?? "system";
  const tema = temaEfektive(pamja, sistemi);
  const t = useMemo(() => perkthyesi(gjuha), [gjuha]);
  useEffect(() => {
    if (Platform.OS === "web" && vlera) {
      document.documentElement.lang = gjuha;
      document.documentElement.style.colorScheme = tema;
    }
  }, [gjuha, tema, vlera]);

  function ndrysho(pjese: Partial<Preferenca>) {
    const v = { ...fundit.current, ...pjese };
    if (v.pamja !== fundit.current.pamja) zbatoPamjen(v.pamja);
    fundit.current = v;
    setVlera(v);
    void ruaj(v).then(
      () => {
        if (fundit.current === v) setGabim(false);
      },
      () => {
        if (fundit.current === v) setGabim(true);
      },
    );
  }

  if (!vlera) return null;
  return (
    <Konteksti.Provider value={{ gjuha, pamja, tema, t, ndrysho, gabimRuajtjeje }}>
      {children}
    </Konteksti.Provider>
  );
}

export function usePreferencat() {
  const v = useContext(Konteksti);
  if (!v) throw new Error("usePreferencat kërkon PreferencatProvider.");
  return v;
}
