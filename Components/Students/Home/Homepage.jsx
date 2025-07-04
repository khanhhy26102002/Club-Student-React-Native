import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity
} from "react-native";
import Header from "../../../Header/Header";
import ClubCard from "./ClubCard";

const clubsData = [
  {
    id: "1",
    image:
      "https://vinschool.edu.vn/wp-content/uploads/2019/09/12/CLB-STEM-CODING-800.jpg",
    titleKey: "club.coding.title",
    descriptionKey: "club.coding.description",
    members: 124,
    tags: ["STEM", "Coding", "Robotics"]
  },
  {
    id: "2",
    image:
      "https://cdn.sforum.vn/sforum/wp-content/uploads/2023/10/clb-anh-thumb.jpg",
    titleKey: "club.photography.title",
    descriptionKey: "club.photography.description",
    members: 87,
    tags: ["Photography", "Art", "Creativity"]
  },
  {
    id: "3",
    image:
      "https://i.pinimg.com/736x/42/99/1e/42991ed60fd7a37fa9d02b63f50f83ee.jpg",
    titleKey: "club.music.title",
    descriptionKey: "club.music.description",
    members: 152,
    tags: ["Music", "Performance", "Teamwork"]
  },
  {
    id: "4",
    image:
      "https://media.vov.vn/sites/default/files/styles/large/public/2023-10/bong-da-vov-2.jpg",
    titleKey: "club.football.title",
    descriptionKey: "club.football.description",
    members: 98,
    tags: ["Sports", "Football", "Fitness"]
  },
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
      "https://img.hoidap247.com/picture/question/20220223/large_1645585801133.jpg",
    titleKey: "title80",
    descriptionKey: "title81"
  },
  {
    id: "5",
    image:
      "https://cdn.tgdd.vn/Files/2022/10/03/1475483/clb-la-gi-cac-clb-truong-dai-hoc-o-viet-nam-hien-nay-202210032134042879.jpg",
    titleKey: "title82",
    descriptionKey: "title83"
  },
  {
    id: "6",
    image: "https://media.baodautu.vn/Images/duonglinh/2021/12/04/huflit.jpg",
    titleKey: "title84",
    descriptionKey: "title85"
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
  },
  {
    id: "5",
    image:
      "https://img.vietcetera.com/uploads/images/02-oct-2023/z4759647852955-b038c22c8ab7353bc4b1993348ad1c04.jpg",
    titleKey: "title84",
    descriptionKey: "title85"
  },
  {
    id: "6",
    image:
      "https://daihoc.fpt.edu.vn/wp-content/uploads/2021/06/CLB-truyen-thong.jpg",
    titleKey: "title86",
    descriptionKey: "title87"
  }
];

const Homepage = () => {
  const renderClubItem = ({ item }) => <ClubCard item={item} />;

  const renderList = (title, data) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={renderClubItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ gap: 16 }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar backgroundColor="#f4f6f8" barStyle="dark-content" />
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        {renderList("\u{1F195} Câu lạc bộ nổi bật", clubsData)}
        {renderList("\u{1F195} Sự kiện nổi bật", newClubsData)}
        {/* <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            Tham gia CLB để phát triển bản thân
          </Text>
          <Text style={styles.infoSubtitle}>
            Kết nối, học hỏi, và cùng nhau tạo nên những giá trị tuyệt vời.
          </Text>
        </View> */}
        {/* {renderList("\u{1F3AF} Gợi ý cho bạn", ClubData)} */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4f6f8"
  },
  container: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    gap: 28
  },
  section: {
    marginBottom: -24
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a"
  },
  viewAll: {
    fontSize: 14,
    color: "#3366FF",
    fontWeight: "500"
  },
  row: {
    justifyContent: "space-between",
    gap: 12
  },
  infoCard: {
    marginTop: -20,
    backgroundColor: "#DCEBFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3366FF",
    marginBottom: 10,
    textAlign: "center"
  },
  infoSubtitle: {
    fontSize: 14,
    color: "#4f4f4f",
    textAlign: "center",
    lineHeight: 20
  }
});

export default Homepage;
