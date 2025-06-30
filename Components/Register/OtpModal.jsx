import React, { useState } from "react";
import {
  Modal,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from "react-native";

const OtpModal = ({ visible, onSubmit, onCancel }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(otp); // onSubmit là prop truyền vào từ cha
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Xác thực OTP</Text>
          <Text style={styles.subtitle}>
            Mã OTP đã được gửi tới email của bạn
          </Text>

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Nhập mã OTP"
            value={otp}
            onChangeText={setOtp}
            maxLength={6}
            editable={!loading}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Xác nhận</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Huỷ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OtpModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
    alignItems: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1f2937"
  },
  subtitle: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 20,
    textAlign: "center"
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    letterSpacing: 4
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5
  },
  confirmButton: {
    backgroundColor: "#10b981"
  },
  cancelButton: {
    backgroundColor: "#ef4444"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16
  }
});
