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
  {
    id: "5",
    image: "https://www.ufm.edu.vn/images/upload/clb-tinh-nguyen-ufm.jpg",
    titleKey: "club.volunteer.title",
    descriptionKey: "club.volunteer.description",
    members: 76,
    tags: ["Community", "Charity", "Empathy"]
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
      <View style={styles.sectionDivider} />
      <FlatList
        data={data}
        renderItem={renderClubItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar backgroundColor="#f2f4f8" barStyle="dark-content" />
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        {renderList("🌟 Câu lạc bộ nổi bật", clubsData)}
        {renderList("🆕 Câu lạc bộ mới thành lập", newClubsData)}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            Tham gia CLB để phát triển bản thân
          </Text>
          <Text style={styles.infoSubtitle}>
            Kết nối, học hỏi, và cùng nhau tạo nên những giá trị tuyệt vời.
          </Text>
        </View>

        {renderList("🎯 Gợi ý cho bạn", ClubData)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#EEF4FF"
  },
  container: {
    padding: 20,
    gap: 12,
    paddingBottom: -40
  },
  section: {
    marginBottom: 32
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1c1c1e"
  },
  viewAll: {
    fontSize: 13,
    color: "#007AFF",
    fontWeight: "500",
    textDecorationLine: "none"
  },
  sectionDivider: {
    height: 3,
    backgroundColor: "#007AFF",
    width: 40,
    borderRadius: 2,
    marginVertical: 8
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 20
  },
  infoCard: {
    marginTop: -40,
    backgroundColor: "#e1efff",
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 8,
    textAlign: "center"
  },
  infoSubtitle: {
    fontSize: 14,
    color: "#4a4a4a",
    textAlign: "center",
    lineHeight: 20
  }
});

export default Homepage;
