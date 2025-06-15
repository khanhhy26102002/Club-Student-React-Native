import { useTranslation } from "react-i18next";
import Header from "../../../Header/Header";
import {
  Text,
  View,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const Contact = () => {
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{t("title1")}</Text>
        <Text style={styles.description}>{t("title82")}</Text>

        <View style={styles.infoSection}>
          <FontAwesome name="user" size={20} color="#0077cc" />
          <Text style={styles.infoText}>{t("title85")}</Text>
        </View>

        <View style={styles.infoSection}>
          <FontAwesome name="envelope" size={20} color="#0077cc" />
          <Text
            style={styles.linkText}
            onPress={() =>
              Linking.openURL("mailto:studentclubs@university.edu")
            }
          >
            studentclubs@university.edu
          </Text>
        </View>

        <View style={styles.infoSection}>
          <FontAwesome name="phone" size={20} color="#0077cc" />
          <Text
            style={styles.linkText}
            onPress={() => Linking.openURL("tel:+84123456789")}
          >
            +84 123 456 789
          </Text>
        </View>

        <Text style={styles.subHeading}>{t("title83")}</Text>
        <View style={styles.socials}>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://facebook.com/studentclub")}
          >
            <FontAwesome name="facebook-square" size={36} color="#3b5998" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://instagram.com/studentclub")}
          >
            <FontAwesome name="instagram" size={36} color="#C13584" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("https://zalo.me")}>
            <FontAwesome name="comment" size={36} color="#0088cc" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL("mailto:studentclubs@university.edu")}
        >
          <Text style={styles.buttonText}>{t("title84")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f0f4f8",
    paddingBottom: 40,
    flexGrow: 1
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center",
    color: "#1e2a3a"
  },
  description: {
    fontSize: 15,
    color: "#5c6b7a",
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 24
  },

  infoSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignSelf: "center",
    width: "100%"
  },
  infoText: {
    fontSize: 15,
    color: "#1e2a3a"
  },
  linkText: {
    fontSize: 15,
    color: "#0077cc",
    textDecorationLine: "none"
  },

  subHeading: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 30,
    marginBottom: 14,
    color: "#1e2a3a",
    textAlign: "center"
  },

  socials: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24
  },

  button: {
    backgroundColor: "#0077cc",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 32,
    alignItems: "center",
    shadowColor: "#0077cc",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700"
  }
});

export default Contact;
