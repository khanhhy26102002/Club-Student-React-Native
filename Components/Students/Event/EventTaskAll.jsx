import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { Card, Avatar, useTheme, FAB, Chip } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../Header/Header";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

const EventTaskAll = () => {
  const navigation = useNavigation();
  const [data, setData] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [userNameFilter, setUserNameFilter] = React.useState(""); // UserName để filter
  const theme = useTheme();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");

        const response = await fetchBaseResponse(`/api/tasks/allTask`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.status === 200) {
          // Sắp xếp giảm dần theo createdAt
          const sortedData = response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          setData(sortedData);
          setFilteredData(sortedData);
        } else {
          setError(`HTTP Status: ${response.status}`);
        }
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Lọc theo userName
  const handleFilterByUserName = (userName) => {
    setUserNameFilter(userName);
    if (!userName) {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((task) => task.userName === userName));
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Event", {
          screen: "EventAllTask",
          params: {
            eventId: item.eventId
          }
        });
        console.log("Nhấn vào task:", item.taskId);
      }}
      activeOpacity={0.8} // hiệu ứng nhấn
    >
      <Card style={styles.card}>
        <Card.Title
          title={item.title}
          subtitle={
            <>
              <Text>
                🕒{" "}
                {item.dueDate
                  ? moment(item.dueDate).format("DD/MM/YYYY HH:mm")
                  : "Không có deadline"}
              </Text>
              <Text>📅 {item.eventTitle}</Text>
              {item.parentTitle && <Text>↳ {item.parentTitle}</Text>}
            </>
          }
          left={(props) => (
            <Avatar.Icon
              {...props}
              icon="checkbox-marked-circle-outline"
              color={theme.colors.accent}
              style={styles.icon}
            />
          )}
        />
        <Card.Content>
          <Text style={styles.desc}>
            {item.description || "Không có mô tả."}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color={theme.colors.primary}
        style={styles.loading}
      />
    );

  if (error)
    return (
      <View style={styles.center}>
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color={theme.colors.error}
        />
        <Text style={styles.error}>{error}</Text>
      </View>
    );

  // Lấy danh sách userName duy nhất từ data
  const uniqueUserNames = [...new Set(data.map((t) => t.userName))];

  return (
    <>
      <Header />
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>
            Danh Sách Task ({filteredData.length})
          </Text>
        </View>

        <View style={styles.filterRow}>
          <Chip
            selected={userNameFilter === ""}
            onPress={() => handleFilterByUserName("")}
            style={styles.chip}
          >
            Tất cả
          </Chip>
          {uniqueUserNames.map((name) => (
            <Chip
              key={name}
              selected={userNameFilter === name}
              onPress={() => handleFilterByUserName(name)}
              style={styles.chip}
            >
              {name}
            </Chip>
          ))}
        </View>

        {filteredData.length === 0 ? (
          <View style={styles.center}>
            <Ionicons name="infinite-outline" size={40} color="#bbb" />
            <Text style={styles.emptyText}>Không có công việc nào.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item) => item.taskId.toString()}
            contentContainerStyle={{ paddingBottom: 10 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#E65100",
    marginLeft: 8 // tạo khoảng cách giữa icon và chữ
  },
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 12
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#E65100", // cam đậm
    marginBottom: 14,
    textAlign: "left",
    marginTop: -25
  },
  filterRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  chip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#FFE0B2", // chip nền cam nhạt
    borderColor: "#FB8C00",
    borderWidth: 1
  },
  card: {
    marginVertical: 8,
    borderRadius: 18,
    elevation: 4,
    backgroundColor: "#FFE0B2" // card nhạt cam
  },
  desc: {
    marginTop: 6,
    color: "#4E342E", // nâu đậm
    fontSize: 15
  },
  icon: {
    backgroundColor: "#FFCC80" // icon nền cam nhạt
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 38,
    backgroundColor: "#FB8C00", // cam sáng
    elevation: 8
  },
  loading: { flex: 1, justifyContent: "center" },
  error: { color: "#D84315", marginTop: 12, fontWeight: "600" }, // đỏ cam
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { marginTop: 12, color: "#8D6E63", fontSize: 17 } // nâu nhạt
});

export default EventTaskAll;
