import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  StatusBar
} from "react-native";
import { useTranslation } from "react-i18next";
import Header from "../../../Header/Header";
const clubsData = [
  {
    id: "1",
    image:
      "https://vinschool.edu.vn/wp-content/uploads/2019/09/12/CLB-STEM-CODING-800.jpg",
    titleKey: "title68",
    descriptionKey: "title69"
  },
  {
    id: "2",
    image:
      "https://i.ytimg.com/vi/xBRwXfn4VOI/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDkr2frmtasoDknf2DGhOhQa1qvlA",
    titleKey: "title70",
    descriptionKey: "title71"
  },
  {
    id: "3",
    image: "https://swinburne-vn.edu.vn/wp-content/uploads/2019/11/NA1.jpg",
    titleKey: "title72",
    descriptionKey: "title73"
  },
  {
    id: "4",
    image: "https://swinburne-vn.edu.vn/wp-content/uploads/2019/11/NA1.jpg",
    titleKey: "title72",
    descriptionKey: "title73"
  }
];
const newClubsData = [
  {
    id: "1",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTasLPrX4mgct1VbqpUE6TbLxd-yT2Oo1rtCA&s",
    titleKey: "title74",
    descriptionKey: "title75"
  },
  {
    id: "2",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbZ1PPFAsYs0Cu6frNKVzL8EHysnVtd3K7vg&s",
    titleKey: "title76",
    descriptionKey: "title77"
  },
  {
    id: "3",
    image:
      "https://btec.fpt.edu.vn/wp-content/uploads/2021/10/IMG_9481-scaled.jpg.webp",
    titleKey: "title78",
    descriptionKey: "title79"
  },
  {
    id: "4",
    image:
      "https://btec.fpt.edu.vn/wp-content/uploads/2021/10/IMG_9481-scaled.jpg.webp",
    titleKey: "title78",
    descriptionKey: "title79"
  }
];
const ClubData = [
  {
    id: "1",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTasLPrX4mgct1VbqpUE6TbLxd-yT2Oo1rtCA&s",
    titleKey: "title12",
    descriptionKey: "title75"
  },
  {
    id: "2",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDZu1HSKySbNHs4-jckUrmCaLgggfUjBPEyQ&s",
    titleKey: "title12",
    descriptionKey: "title77"
  },
  {
    id: "3",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_MgHjpDBjydEzQEt0fp8eYofcPCQg9XvylA&s",
    titleKey: "title12",
    descriptionKey: "title79"
  },
  {
    id: "4",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_MgHjpDBjydEzQEt0fp8eYofcPCQg9XvylA&s",
    titleKey: "title12",
    descriptionKey: "title79"
  }
];
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 24 * 2 - 12) / 2; // padding 24 + giữa 2 card là 12
const Homepage = () => {
  const { t } = useTranslation();
  const renderClubItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardTextWrapper}>
        <Text style={styles.cardTitle}>{t(item.titleKey)}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {t(item.descriptionKey)}
        </Text>
      </View>
    </View>
  );

  const renderList = (title, data) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionDivider} />
      <FlatList
        data={data}
        renderItem={renderClubItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false} // dùng ScrollView cha để cuộn
        columnWrapperStyle={styles.row}
      />
    </View>
  );
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar backgroundColor="#f2f4f8" barStyle="dark-content" />
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        {renderList(`🌟 ${t("title80")}`, clubsData)}
        {renderList(`💡 ${t("title81")}`, newClubsData)}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{t("title10")}</Text>
          <Text style={styles.infoSubtitle}>{t("title11")}</Text>
        </View>

        {renderList(`🎯 ${t("title12")}`, ClubData)}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f0f6ff"
  },
  container: {
    padding: 24,
    paddingBottom: 36,
    gap: 32
  },
  section: {
    marginBottom: 32
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1c1c1e",
    marginBottom: 6
  },
  sectionDivider: {
    height: 3,
    backgroundColor: "#007AFF",
    width: 50,
    borderRadius: 2,
    marginBottom: 16
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: CARD_WIDTH,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4
  },
  image: {
    width: "100%",
    height: 110,
    resizeMode: "cover"
  },
  cardTextWrapper: {
    padding: 14
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1c1c1e",
    marginBottom: 4
  },
  cardDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18
  },
  infoCard: {
    backgroundColor: "#E8F0FE",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    marginVertical: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },
  infoTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 8,
    textAlign: "center"
  },
  infoSubtitle: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    lineHeight: 20
  }
});


export default Homepage;
