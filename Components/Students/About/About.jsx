import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from "react-native";
import Header from "../../../Header/Header";
import { useTranslation } from "react-i18next";
const About = () => {
  const { t } = useTranslation();
  const url =
    "https://www.mbacrystalball.com/wp-content/uploads/2019/02/student-clubs.jpg";
  return (
    <>
      <Header />
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Image source={{ uri: url }} style={styles.image} />
          <Text style={styles.heading}>{t("title19")}</Text>
          <Text style={styles.paragraph}>{t("title20")}</Text>
          <Text style={styles.paragraph}>{t("aboutDescription")}</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>{t("joinNow")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#e8f0fe"
  },
  container: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 20
  },
  heading: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 18,
    textAlign: "center"
  },
  paragraph: {
    fontSize: 16,
    color: "#444",
    lineHeight: 26,
    marginBottom: 16,
    textAlign: "justify"
  },
  button: {
    backgroundColor: "#0077cc",
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 24,
    alignItems: "center",
    shadowColor: "#0077cc",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18
  }
});

export default About;
