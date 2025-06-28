import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
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
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
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
    </>
  );
};

const Section = ({ title, data, renderItem }) => (
  <>
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
  </>
);

export default Homepage;

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 40,
    marginTop: 30
  },
  columnWrapper: {
    gap: 12,
    justifyContent: "space-between"
  },
  sectionHeaderWrapper: {
    width: "100%",
    marginBottom: 16,
    marginTop: 24
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1c1c1e",
    textAlign: "center"
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    flex: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3
  },
  image: {
    width: "100%",
    height: 140,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16
  },
  textWrapper: {
    padding: 12
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 4
  },
  description: {
    fontSize: 13,
    color: "#495057",
    lineHeight: 18
  },
  infoCard: {
    backgroundColor: "#eaf4ff",
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    alignItems: "center",
    width: "100%"
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0077cc",
    marginBottom: 6,
    textAlign: "center"
  },
  infoSubtitle: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    lineHeight: 20
  }
});
