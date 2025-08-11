import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";

const OtpPopup = ({ visible, onClose, onConfirm, loading }) => {
  const [otp, setOtp] = useState("");

  const submit = () => {
    if (!otp) return;
    onConfirm(otp);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>Nhập mã xác thực (OTP)</Text>
          <Text style={styles.label}>
            Mã OTP vừa được gửi tới email của bạn.
          </Text>
          <TextInput
            style={styles.input}
            value={otp}
            placeholder="Nhập OTP"
            keyboardType="number-pad"
            onChangeText={setOtp}
            maxLength={6}
          />
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancel}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={{ color: "#888", fontWeight: "bold" }}>HỦY</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirm}
              onPress={submit}
              disabled={loading || !otp}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                {loading ? "ĐANG XÁC THỰC..." : "XÁC NHẬN"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#0008",
    alignItems: "center",
    justifyContent: "center"
  },
  popup: {
    width: 305,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 7
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3d49fa",
    marginBottom: 8
  },
  label: { color: "#666", fontSize: 14, marginBottom: 14, textAlign: "center" },
  input: {
    width: 120,
    height: 46,
    fontSize: 22,
    fontWeight: "bold",
    backgroundColor: "#f0f5ff",
    borderColor: "#aaa",
    borderRadius: 10,
    borderWidth: 1,
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 12
  },
  actions: { flexDirection: "row", marginTop: 3 },
  cancel: {
    padding: 11,
    borderRadius: 9,
    marginRight: 14,
    backgroundColor: "#f2f2f2"
  },
  confirm: {
    padding: 11,
    borderRadius: 9,
    backgroundColor: "#4d79fe",
    minWidth: 96,
    alignItems: "center"
  }
});

export default OtpPopup;
