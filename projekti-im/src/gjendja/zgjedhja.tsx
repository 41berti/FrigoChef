import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

import { celesiIPerberesit, normalizoEmrin, perberesiMeId } from "@/data/perberesit";

type PerberesManual = { id: string; emri: string };

// Zgjedhja e përbërësve është gjendje e përbashkët: Ballina e ndryshon,
// ndërsa Lista dhe Detajet e lexojnë. Prandaj rri në një Context, jo brenda një ekrani.
// Ruhet vetëm në memorie, pra humbet kur aplikacioni mbyllet plotësisht.
type Zgjedhja = {
  // ID të katalogut ose çelësa custom: për përbërësit manualë.
  zgjedhur: string[];
  teShtuar: PerberesManual[];
  // E zgjedh përbërësin nëse s'është i zgjedhur, përndryshe e heq.
  nderroPerberesin: (perberesi: string) => void;
  // Shton një përbërës të ri te chip-at dhe e zgjedh menjëherë.
  shtoPerberesin: (perberesi: string) => void;
};

const ZgjedhjaContext = createContext<Zgjedhja | null>(null);

export function ZgjedhjaProvider({ children }: { children: ReactNode }) {
  const [zgjedhur, setZgjedhur] = useState<string[]>([]);
  const [teShtuar, setTeShtuar] = useState<PerberesManual[]>([]);

  const nderroPerberesin = useCallback((id: string) => {
    // Forma me funksion: `tani` është lista më e fundit, edhe pas disa prekjeve të shpejta.
    setZgjedhur((tani) => tani.includes(id) ? tani.filter((p) => p !== id) : [...tani, id]);
  }, []);

  function shtoPerberesin(teksti: string) {
    const emri = teksti.trim();
    if (!normalizoEmrin(emri)) return;

    const id = celesiIPerberesit(emri);
    if (!perberesiMeId(id)) {
      setTeShtuar((tani) => tani.some((p) => p.id === id) ? tani : [...tani, { id, emri }]);
    }
    setZgjedhur((tani) => tani.includes(id) ? tani : [...tani, id]);
  }

  return (
    <ZgjedhjaContext.Provider value={{ zgjedhur, teShtuar, nderroPerberesin, shtoPerberesin }}>
      {children}
    </ZgjedhjaContext.Provider>
  );
}

// Ekranet e lexojnë zgjedhjen me këtë hook.
export function useZgjedhja(): Zgjedhja {
  const zgjedhja = useContext(ZgjedhjaContext);

  if (!zgjedhja) {
    throw new Error("useZgjedhja duhet të përdoret brenda ZgjedhjaProvider.");
  }

  return zgjedhja;
}
