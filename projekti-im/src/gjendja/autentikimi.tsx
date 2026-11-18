import type { Celesi } from "@/i18n/perkthimi";
import type { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { AppState, Platform } from "react-native";

import { mesazhiIGabimit } from "@/data/llogaria";
import { supabase } from "@/data/supabase";

type Autentikimi = {
  sesioni: Session | null;
  dukeNgarkuar: boolean;
  gabimi: Celesi | null;
  provoPerseri: () => void;
};

const Konteksti = createContext<Autentikimi | null>(null);

export function AutentikimiProvider({ children }: { children: ReactNode }) {
  const [sesioni, setSesioni] = useState<Session | null>(null);
  const [dukeNgarkuar, setDukeNgarkuar] = useState(true);
  const [gabimi, setGabimi] = useState<Celesi | null>(null);
  const [prova, setProva] = useState(0);

  useEffect(() => {
    let aktiv = true;
    let ngjarje = 0;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!aktiv) return;
      ngjarje++;
      setSesioni(session);
      // getSession trajton edhe gabimet e ruajtjes para se të hapet navigimi.
    });
    const fillimi = ngjarje;
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!aktiv) return;
        if (error) throw error;
        // Një dalje/hyrje më e re nuk mbishkruhet nga përgjigjja e restaurimit.
        if (ngjarje === fillimi) setSesioni(data.session);
        setGabimi(null);
        setDukeNgarkuar(false);
      })
      .catch((error: unknown) => {
        if (!aktiv) return;
        setGabimi(mesazhiIGabimit(error));
        setDukeNgarkuar(false);
      });

    function rifresko(gjendja: string | null | undefined) {
      if (gjendja === "active") void supabase.auth.startAutoRefresh();
      else void supabase.auth.stopAutoRefresh();
    }
    // Në web Supabase e ndjek vetë dukshmërinë e faqes.
    const listener = Platform.OS !== "web" ? AppState.addEventListener("change", rifresko) : null;
    if (Platform.OS !== "web") rifresko(AppState.currentState);
    return () => {
      aktiv = false;
      subscription.unsubscribe();
      listener?.remove();
      if (Platform.OS !== "web") void supabase.auth.stopAutoRefresh();
    };
  }, [prova]);

  function provoPerseri() {
    setDukeNgarkuar(true);
    setGabimi(null);
    setProva((value) => value + 1);
  }

  return (
    <Konteksti.Provider value={{ sesioni, dukeNgarkuar, gabimi, provoPerseri }}>
      {children}
    </Konteksti.Provider>
  );
}

export function useAutentikimi() {
  const value = useContext(Konteksti);
  if (!value) throw new Error("useAutentikimi kërkon AutentikimiProvider.");
  return value;
}
