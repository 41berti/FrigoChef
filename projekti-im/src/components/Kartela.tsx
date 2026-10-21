import { StyleSheet, Text, View } from "react-native";

// Props: të dhënat që Kartela merr nga komponenti prind.
type KartelaProps = {
  titulli: string;
  teksti: string;
};

// Komponent i ripërdorshëm: shfaq një titull dhe një tekst brenda një kartele.
export default function Kartela({ titulli, teksti }: KartelaProps) {
  return (
    <View style={styles.kartela}>
      <Text style={styles.titulli}>{titulli}</Text>
      <Text style={styles.teksti}>{teksti}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  kartela: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dddddd",
    padding: 16,
    marginBottom: 12,
  },
  titulli: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#208AEF",
    marginBottom: 6,
  },
  teksti: {
    fontSize: 15,
    color: "#333333",
  },
});
