import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView
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
const Homepage = () => {
  const { t } = useTranslation();

  const renderClubItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{t(item.titleKey)}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {t(item.descriptionKey)}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Section
          title={`🌟 ${t("title80")}`}
          data={clubsData}
          renderItem={renderClubItem}
        />
        <Section
          title={`💡 ${t("title81")}`}
          data={newClubsData}
          renderItem={renderClubItem}
        />

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{t("title10")}</Text>
          <Text style={styles.infoSubtitle}>{t("title11")}</Text>
        </View>

        <Section
          title={`🎯 ${t("title12")}`}
          data={ClubData}
          renderItem={renderClubItem}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const Section = ({ title, data, renderItem }) => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeaderWrapper}>
      <Text style={styles.sectionHeader}>{title}</Text>
      <View style={styles.sectionDivider} />
    </View>
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${title}-${index}`}
      numColumns={2}
      scrollEnabled={false}
      columnWrapperStyle={styles.columnWrapper}
    />
  </View>
);
export default Homepage;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9fb"
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40
  },
  sectionContainer: {
    marginBottom: 32
  },
  sectionHeaderWrapper: {
    marginBottom: 12,
    alignItems: "center"
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a1a1a"
  },
  sectionDivider: {
    marginTop: 6,
    height: 3,
    width: 50,
    backgroundColor: "#007aff",
    borderRadius: 3
  },
  columnWrapper: {
    gap: 16,
    justifyContent: "space-between"
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
    flex: 1,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3
  },
  image: {
    width: "100%",
    height: 140
  },
  textWrapper: {
    padding: 14
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#212121",
    marginBottom: 6
  },
  description: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18
  },
  infoCard: {
    backgroundColor: "#e6f2ff",
    borderRadius: 20,
    padding: 24,
    marginTop: 24,
    marginBottom: 40,
    alignItems: "center"
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#007aff",
    marginBottom: 6,
    textAlign: "center"
  },
  infoSubtitle: {
    fontSize: 14,
    color: "#3d3d3d",
    textAlign: "center",
    lineHeight: 20
  }
});
