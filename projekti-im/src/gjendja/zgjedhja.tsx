import { createContext, useContext, useState, type ReactNode } from "react";

// Zgjedhja e përbërësve është gjendje e përbashkët: Ballina e ndryshon,
// ndërsa Lista dhe Detajet e lexojnë. Prandaj rri në një Context, jo brenda një ekrani.
// Ruhet vetëm në memorie, pra humbet kur aplikacioni mbyllet plotësisht.
type Zgjedhja = {
  // Përbërësit që përdoruesi thotë se i ka.
  zgjedhur: string[];
  // Përbërësit që i ka shtuar vetë me "+ tjetër". Nuk ruhen në databazë.
  teShtuar: string[];
  // E zgjedh përbërësin nëse s'është i zgjedhur, përndryshe e heq.
  nderroPerberesin: (perberesi: string) => void;
  // Shton një përbërës të ri te chip-at dhe e zgjedh menjëherë.
  shtoPerberesin: (perberesi: string) => void;
};

const ZgjedhjaContext = createContext<Zgjedhja | null>(null);

export function ZgjedhjaProvider({ children }: { children: ReactNode }) {
  const [zgjedhur, setZgjedhur] = useState<string[]>([]);
  const [teShtuar, setTeShtuar] = useState<string[]>([]);

  function nderroPerberesin(perberesi: string) {
    // Forma me funksion: `tani` është lista më e fundit, edhe pas disa prekjeve të shpejta.
    setZgjedhur((tani) =>
      tani.includes(perberesi) ? tani.filter((p) => p !== perberesi) : [...tani, perberesi]
    );
  }

  function shtoPerberesin(perberesi: string) {
    setTeShtuar((tani) => (tani.includes(perberesi) ? tani : [...tani, perberesi]));
    setZgjedhur((tani) => (tani.includes(perberesi) ? tani : [...tani, perberesi]));
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
