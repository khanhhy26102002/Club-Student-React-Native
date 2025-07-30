import { Alert, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Camera, useCameraPermissions } from "expo-camera";
import { fetchBaseResponse } from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CheckIn = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = React.useState(false);
  const [showCamera, setShowCamera] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Thất bại",
          "Xin lỗi, chúng tôi cần quyền truy cập camera để việc này hoạt động!"
        );
      }
    })();
  }, []);
  const handleBarCodeScanned = async (type, data) => {
    setScanned(true);
    const token = await AsyncStorage.getItem("jwt");
    try {
      const response = await fetchBaseResponse(`/api/clubs/checkin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ qrCode: data })
      });
      Alert.alert(
        "Kết quả check-in",
        response.message || "Thành công!",
        [
          {
            text: "OK",
            onPress: () => setScanned(false)
          }
        ],
        {
          cancelable: false
        }
      );
    } catch (error) {
      Alert.alert("Lỗi", "Không thể check-in. Vui lòng thử lại.", [
        { text: "Thử lại", onPress: () => setScanned(false) }
      ]);
    }
  };
  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Chưa cấp quyền camera</Text>
        <Button title="Bấm cấp quyền" onPress={requestPermission} />
      </View>
    );
  }

  if (!showCamera) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Màn hình chính</Text>
        <Button title="Mở Camera" onPress={() => setShowCamera(true)} />
      </View>
    );
  }

  return (
    <View style={styles.cameraWrapper}>
      <CameraView
        style={StyleSheet.absoluteFill}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      {/* Lớp đè lên camera */}
      <View style={styles.layerContainer}>
        <View style={styles.layerTop} />
        <View style={styles.layerCenter}>
          <View style={styles.layerLeft} />
          <View style={styles.focused} />
          <View style={styles.layerRight} />
        </View>
        <View style={styles.layerBottom} />
      </View>
    </View>
  );
};

export default CheckIn;

const styles = StyleSheet.create({
  cameraWrapper: {
    flex: 1,
    position: "relative"
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  permissionText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center"
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end"
  },
  layerContainer: {
    flex: 1
  },
  layerTop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)"
  },
  layerCenter: {
    flexDirection: "row"
  },
  layerLeft: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)"
  },
  focused: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: "#00FF00"
  },
  layerRight: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)"
  },
  layerBottom: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)"
  },
  resultContainer: {
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center"
  },
  resultText: {
    fontSize: 18,
    marginVertical: 10
  },
  button: {
    backgroundColor: "#00FF00",
    padding: 10,
    borderRadius: 5
  },
  buttonText: {
    color: "#fff",
    fontSize: 16
  }
});
