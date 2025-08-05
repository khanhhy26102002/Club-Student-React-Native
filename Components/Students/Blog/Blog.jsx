import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions
} from "react-native";
import React from "react";
import Header from "../../../Header/Header";
import { fetchBaseResponse } from "../../../utils/api";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - 20 * 2 - CARD_MARGIN * 2) / 2; // padding container + margin

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};

const Blog = ({ navigation }) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetchBaseResponse(`/api/blogs/public`, {
            method: "GET"
          });

          if (!response || !response.data || response.data.length === 0) {
            Alert.alert("Thông báo", "Không có blog nào để hiển thị.");
            setData([]);
          } else {
            setData(response.data);
          }
        } catch (error) {
          Alert.alert("Lỗi lấy dữ liệu", error.message || "Không xác định");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.thumbnailUrl && (
        <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
      )}
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.meta}>
          📝 <Text style={styles.author}>{item.authorName}</Text> •{" "}
          {formatDate(item.createdAt)}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.content}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("Club", {
              screen: "BlogDetail",
              params: {
                blogId: item.blogId
              }
            })
          }
        >
          <Text style={styles.buttonText}>Xem chi tiết</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <Header />
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color="#333" />
          <Text style={[styles.backText, { marginLeft: 25, marginTop: -20 }]}>
            Quay về trang chủ
          </Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>📰 Bài viết Blog</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.blogId.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={{ paddingBottom: 40 }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Không có dữ liệu blog.</Text>
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </>
  );
};

export default Blog;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 20,
    paddingTop: -12
  },
  backText: {
    fontSize: 15,
    color: "#2563eb",
    marginBottom: 12
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 20,
    textAlign: "center"
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3
  },
  thumbnail: {
    width: "100%",
    height: 120,
    resizeMode: "cover"
  },
  cardContent: {
    padding: 12
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6
  },
  meta: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 6
  },
  author: {
    fontWeight: "600",
    color: "#2563eb"
  },
  description: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 18,
    marginBottom: 10
  },
  button: {
    alignSelf: "flex-start",
    backgroundColor: "#2563eb",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 13
  },
  loadingContainer: {
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  emptyText: {
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 16,
    marginTop: 20
  },
  backButton: {
    backgroundColor: "#f0f0f0", // hoặc màu theo chủ đề
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: "flex-start", // để nó không chiếm toàn bộ chiều ngang
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
    marginBottom: 20
  },
  backText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500"
  }
});
