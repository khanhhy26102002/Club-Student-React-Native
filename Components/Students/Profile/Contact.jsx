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
    backgroundColor: "#f9fbfd",
    paddingBottom: 40,
    flexGrow: 1
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
    color: "#1f2937"
  },
  description: {
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 28
  },

  infoSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  infoText: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 12
  },
  linkText: {
    fontSize: 16,
    color: "#0077cc",
    marginLeft: 12,
    textDecorationLine: "none"
  },

  subHeading: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 36,
    marginBottom: 16,
    color: "#1e293b",
    textAlign: "center"
  },

  socials: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 28,
    marginBottom: 24
  },

  button: {
    backgroundColor: "#0077cc",
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 32,
    alignItems: "center",
    shadowColor: "#0077cc",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700"
  }
});

export default Contact;
