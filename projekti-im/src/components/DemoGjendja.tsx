import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

// Një buton i thjeshtë: Pressable (zona që shtypet) + Text (teksti i butonit).
function Buton({ titulli, onPress }: { titulli: string; onPress: () => void }) {
  return (
    <Pressable style={styles.buton} onPress={onPress}>
      <Text style={styles.butonTeksti}>{titulli}</Text>
    </Pressable>
  );
}

export default function DemoGjendja() {
  // 1) Variabël e zakonshme me `let`.
  //    Kur e ndryshojmë, React NUK e di që duhet ta vizatojë ekranin përsëri,
  //    prandaj në ekran mbetet 0 (vlera ndryshon vetëm në memorie, shih console.log).
  //    Sa herë që komponenti rivizatohet (re-render), ky rresht ekzekutohet sërish
  //    dhe numriLet kthehet në 0.
  let numriLet = 0;

  // 2) Gjendje me `useState`.
  //    React e ruan vlerën mes rivizatimeve. Kur thërrasim setNumri(...),
  //    React e ndryshon vlerën dhe e rivizaton ekranin.
  const [numri, setNumri] = useState(0);

  function shtoLet() {
    numriLet = numriLet + 1;
    console.log("numriLet =", numriLet); // ndryshon në terminal, por jo në ekran
  }

  // Forma e zakonshme: përdor `numri` që kishim kur u vizatua ekrani.
  function shtoNjeHere() {
    setNumri(numri + 1);
  }

  // Forma me funksion: React na jep vlerën më të fundit `n`, ne kthejmë n + 1.
  function shtoNjeHereMeFunksion() {
    setNumri((n) => n + 1);
  }

  // 3 herë me formën e zakonshme => vetëm +1!
  // `numri` është i njëjti (p.sh. 0) në të tre rreshtat,
  // pra i themi React-it tri herë: "vendose 0 + 1".
  function shtoTreHere() {
    setNumri(numri + 1);
    setNumri(numri + 1);
    setNumri(numri + 1);
  }

  // 3 herë me formën me funksion => +3.
  // Çdo thirrje merr rezultatin e thirrjes së mëparshme: 0 -> 1 -> 2 -> 3.
  function shtoTreHereMeFunksion() {
    setNumri((n) => n + 1);
    setNumri((n) => n + 1);
    setNumri((n) => n + 1);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulli}>Demo e gjendjes: let kundër useState</Text>

      {/* Dy numëruesit krah për krah */}
      <View style={styles.rresht}>
        <View style={styles.kolone}>
          <Text style={styles.etiketa}>Me let</Text>
          <Text style={styles.numri}>{numriLet}</Text>
          <Buton titulli="Shto 1" onPress={shtoLet} />
          <Text style={styles.shenim}>
            Ekrani nuk ndryshon. Shiko vlerën në terminal.
          </Text>
        </View>

        <View style={styles.kolone}>
          <Text style={styles.etiketa}>Me useState</Text>
          <Text style={styles.numri}>{numri}</Text>
          <Buton titulli="Shto 1" onPress={shtoNjeHere} />
          <Text style={styles.shenim}>Ekrani përditësohet menjëherë.</Text>
        </View>
      </View>

      {/* Dy format e setter-it, krah për krah */}
      <Text style={styles.nentitulli}>Dy format e setNumri</Text>
      <View style={styles.rresht}>
        <View style={styles.kolone}>
          <Text style={styles.etiketa}>Forma e zakonshme</Text>
          <Text style={styles.kodi}>setNumri(numri + 1)</Text>
          <Buton titulli="Thirr 1 herë" onPress={shtoNjeHere} />
          <Buton titulli="Thirr 3 herë" onPress={shtoTreHere} />
        </View>

        <View style={styles.kolone}>
          <Text style={styles.etiketa}>Forma me funksion</Text>
          <Text style={styles.kodi}>setNumri(n =&gt; n + 1)</Text>
          <Buton titulli="Thirr 1 herë" onPress={shtoNjeHereMeFunksion} />
          <Buton titulli="Thirr 3 herë" onPress={shtoTreHereMeFunksion} />
        </View>
      </View>

      <Text style={styles.shenim}>
        Provo «Thirr 3 herë»: forma e zakonshme shton vetëm 1, forma me funksion
        shton 3.
      </Text>
      <Buton titulli="Rivendos në 0" onPress={() => setNumri(0)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dddddd",
    padding: 16,
    marginBottom: 24,
  },
  titulli: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#208AEF",
    marginBottom: 12,
  },
  nentitulli: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
  },
  rresht: {
    flexDirection: "row", // fëmijët vendosen krah për krah
    gap: 12,
  },
  kolone: {
    flex: 1, // secila kolonë merr gjysmën e gjerësisë
    alignItems: "center",
    backgroundColor: "#f4f8fd",
    borderRadius: 8,
    padding: 10,
  },
  etiketa: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  numri: {
    fontSize: 40,
    fontWeight: "bold",
    marginVertical: 6,
  },
  kodi: {
    fontSize: 12,
    color: "#a0306b",
    textAlign: "center",
    marginVertical: 6,
  },
  shenim: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
    marginTop: 6,
  },
  buton: {
    alignSelf: "stretch",
    backgroundColor: "#208AEF",
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 8,
  },
  butonTeksti: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
