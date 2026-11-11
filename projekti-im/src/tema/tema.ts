import { useColorScheme } from "react-native";

// Tema e FrigoChef: ngjyrat, shkronjat, hapësirat, rrezet dhe hijet në një vend.
// Vlerat vijnë nga skicat te docs/skica/. Ekranet s'shkruajnë ngjyra vetë, i marrin nga këtu,
// prandaj një ndryshim këtu e ndryshon të gjithë aplikacionin.

export type Ngjyrat = {
  sfondi: string; // sfondi i ekranit
  siperfaqja: string; // kartelat dhe fushat e tekstit
  mbushja: string; // vendi bosh i fotos, zonat e shtypura
  teksti: string;
  tekstiDytesor: string;
  tekstiIZbehte: string; // placeholder-at dhe ikonat e vogla
  kufiri: string;
  kufiriIFushes: string; // chip-at dhe fushat e tekstit
  primare: string; // butonat dhe chip-at e zgjedhur
  primareTeksti: string; // tekst i gjelbër mbi sfond (më i errët, që të lexohet)
  primareEZbehte: string; // sfond i gjelbër i lehtë për etiketa
  mbiPrimare: string; // teksti mbi ngjyrën primare
  theksi: string; // "deri 20 min", "mungon"
  theksiIZbehte: string;
  gabimi: string;
};

const ngjyratCelet: Ngjyrat = {
  sfondi: "#FFFFFF",
  siperfaqja: "#FFFFFF",
  mbushja: "#F1F3F5",
  teksti: "#1F2933",
  tekstiDytesor: "#6B7280",
  tekstiIZbehte: "#9CA3AF",
  kufiri: "#E5E7EB",
  kufiriIFushes: "#CBD5E1",
  primare: "#1F9D6B",
  primareTeksti: "#177F56",
  primareEZbehte: "#E3F4EC",
  mbiPrimare: "#FFFFFF",
  theksi: "#C2410C",
  theksiIZbehte: "#FFEDD5",
  gabimi: "#B42318",
};

// Skicat janë vetëm në light mode. Këto janë të njëjtat role, të përshtatura për sfond të errët.
const ngjyratErret: Ngjyrat = {
  sfondi: "#111417",
  siperfaqja: "#1A1F24",
  mbushja: "#20262D",
  teksti: "#F2F4F7",
  tekstiDytesor: "#A6AFBB",
  tekstiIZbehte: "#768091",
  kufiri: "#2A313A",
  kufiriIFushes: "#3B4450",
  primare: "#1F9D6B",
  primareTeksti: "#4CC996",
  primareEZbehte: "#143A2B",
  mbiPrimare: "#FFFFFF",
  theksi: "#FDBA74",
  theksiIZbehte: "#4A2A12",
  gabimi: "#F97066",
};

// Kthen ngjyrat sipas cilësimit të telefonit (light ose dark).
// Kur përdoruesi e ndryshon cilësimin, ekrani vizatohet prapë me ngjyrat e reja.
export function useNgjyrat(): Ngjyrat {
  const skema = useColorScheme();
  return skema === "dark" ? ngjyratErret : ngjyratCelet;
}

// Hapësirat mes elementeve. Përdorim vetëm këto vlera, që ekranet të duken njësoj.
export const hapesira = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// Rrezet e këndeve. `pilule` është aq e madhe sa e bën elementin krejt të rrumbullakët.
export const rrezet = {
  vogel: 8,
  mesme: 12,
  madhe: 16,
  pilule: 999,
} as const;

// Madhësitë e shkronjave. Skicat janë vizatuar për ekran të ngushtë,
// prandaj këtu janë rritur në madhësitë e zakonshme të iOS-it (teksti kryesor 17).
export const shkronjat = {
  titullIMadh: { fontSize: 28, lineHeight: 34, fontWeight: "700" },
  titull: { fontSize: 22, lineHeight: 28, fontWeight: "700" },
  nentitull: { fontSize: 20, lineHeight: 25, fontWeight: "700" },
  trupi: { fontSize: 17, lineHeight: 24, fontWeight: "400" },
  trupiITheksuar: { fontSize: 17, lineHeight: 24, fontWeight: "600" },
  dytesor: { fontSize: 15, lineHeight: 20, fontWeight: "400" },
  dytesorITheksuar: { fontSize: 15, lineHeight: 20, fontWeight: "700" },
  // Teksti i etiketave të vogla, si "deri 20 min" dhe "mungon".
  imet: { fontSize: 13, lineHeight: 18, fontWeight: "700" },
  etiketa: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
} as const;

// Skicat s'kanë hije te kartelat. Kjo përdoret vetëm për elementet që rrinë mbi përmbajtje.
export const hijet = {
  ngritur: { boxShadow: "0 4px 16px rgba(31, 41, 51, 0.12)" },
} as const;

export const permasat = {
  // Në ekrane të gjera (tablet, landscape) përmbajtja nuk zgjerohet më shumë se kaq.
  gjeresiaMaksimale: 640,
  // Lartësia minimale e një elementi që preket, sipas Apple-it.
  prekjaMinimale: 44,
} as const;
