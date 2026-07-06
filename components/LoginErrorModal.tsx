import React from "react";
import { Modal, View, Text, Button, StyleSheet } from "react-native";

interface LoginErrorModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
}

const LoginErrorModal: React.FC<LoginErrorModalProps> = ({
  visible,
  title = "Aviso",
  message,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <Button title="Aceptar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
});

export default LoginErrorModal;
