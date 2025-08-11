// File: ChangePasswordScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const ChangePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Kiểm tra độ mạnh mật khẩu: ít nhất 8 ký tự, có chữ hoa, thường, số, ký tự đặc biệt
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.])[A-Za-z\d!@#$%^&*.]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMsg('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu mới không khớp.');
      return;
    }
    if (!validatePassword(newPassword)) {
      setErrorMsg('Mật khẩu mới phải từ 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.');
      return;
    }

    // TODO: Gọi API đổi mật khẩu ở đây
    // Giả lập thành công
    setTimeout(() => {
      setSuccessMsg('Thay đổi mật khẩu thành công!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      Alert.alert('Thông báo', 'Đổi mật khẩu thành công!');
    }, 700);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps='handled'
        >
          <View style={styles.headerBox}>
            <Text style={styles.title}>Đổi mật khẩu 🔒</Text>
            <Text style={styles.subtitle}>
              Đảm bảo mật khẩu đủ mạnh để bảo vệ tài khoản của bạn.
            </Text>
          </View>

          <View style={styles.form}>
            {errorMsg ? <Text style={styles.errorMsg}>{errorMsg}</Text> : null}
            {successMsg ? <Text style={styles.successMsg}>{successMsg}</Text> : null}

            <Text style={styles.label}>Mật khẩu cũ</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu cũ"
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
            />

            <Text style={styles.label}>Mật khẩu mới</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu mới"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <Text style={styles.hint}>
              Tối thiểu 8 ký tự, có chữ hoa, thường, số & ký tự đặc biệt
            </Text>

            <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập lại mật khẩu mới"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonTxt}>Đổi mật khẩu</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f8ff',
  },
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  headerBox: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    letterSpacing: 0.5,
    fontWeight: 'bold',
    color: '#3155ff',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 22,
    borderRadius: 16,
    shadowColor: '#1e2d59',
    shadowOpacity: 0.09,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  label: {
    marginTop: 8,
    marginBottom: 4,
    fontWeight: '600',
    fontSize: 15,
    color: '#273c66',
  },
  input: {
    height: 48,
    borderRadius: 8,
    borderColor: '#dde5f3',
    borderWidth: 1,
    backgroundColor: '#f9fbff',
    paddingHorizontal: 14,
    marginBottom: 8,
    fontSize: 15,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  errorMsg: {
    color: '#df2e2e',
    textAlign: 'center',
    marginBottom: 8,
  },
  successMsg: {
    color: '#3db670',
    textAlign: 'center',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#3155ff',
    borderRadius: 8,
    marginTop: 18,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#2547a5',
    shadowOpacity: 0.17,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  buttonTxt: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
});

export default ChangePasswordScreen;