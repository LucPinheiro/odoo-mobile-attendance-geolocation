import React, { useCallback, useState } from "react";
import { Button, Switch, Text, TextInput, View } from "react-native";
import { useColorScheme } from "../../../hooks/useColorScheme";
import LoginErrorModal from "../../LoginErrorModal";
import styles from "../AttendanceStyles";
import { BeforeCheckoutStepProps } from "./AttendanceStepTypes";

export const BeforeCheckoutStep: React.FC<BeforeCheckoutStepProps> = ({
  // workedHours, // si lo necesitas, descomenta
  onCheckOut,
  onChangeTask,
  loading,
  timer,
  formatTimer,
  observaciones,
  setObservaciones,
  avanceInput,
  setAvanceInput,
  pedirAvanceMsg,
}) => {
  const [calidad, setCalidad] = useState(true);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? "#fff" : "#222";

  // Normalizamos pedirAvanceMsg para evitar null/undefined
  const pedirAvanceMsgTrim = (pedirAvanceMsg ?? "").trim();
  const shouldShowAvanceMsg =
    pedirAvanceMsgTrim !== "" &&
    pedirAvanceMsgTrim.toLowerCase() !== "no";

  const handleCloseModal = useCallback(() => {
    setErrorModalVisible(false);
  }, []);

  const handleChangeObservaciones = useCallback(
    (text: string) => {
      setObservaciones(text);
    },
    [setObservaciones]
  );

  const handleChangeAvance = useCallback(
    (text: string) => {
      setAvanceInput(text);
    },
    [setAvanceInput]
  );

  const handleSalida = useCallback(() => {
    const trimmedObs = observaciones.trim();

    if (!trimmedObs) {
      setErrorMessage(
        "Por favor, escribe una observación antes de registrar la salida."
      );
      setErrorModalVisible(true);
      return;
    }

    const avanceNum =
      avanceInput && avanceInput.trim() !== ""
        ? Number(avanceInput)
        : undefined;

    // onCheckOut acepta (obs, calidad?, avance?) → se pueden pasar los 3 siempre
    onCheckOut(trimmedObs, calidad, avanceNum);
  }, [observaciones, avanceInput, calidad, onCheckOut]);

  return (
    <>
      {/* Modal de error */}
      <LoginErrorModal
        visible={errorModalVisible}
        title="Observación"
        message={errorMessage}
        onClose={handleCloseModal}
      />

      <View style={{ flex: 1, padding: 16 }}>
        <View style={{ width: "100%", maxWidth: 400, alignSelf: "center" }}>
          {/* Título */}
          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={[
                styles.message,
                { textAlign: "center", marginBottom: 16, color: textColor },
              ]}
            >
              ¿Registrar salida?
            </Text>
          </View>

          {/* Contador */}
          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <View
              style={[
                styles.centered,
                {
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <Text style={styles.timerLabel}>Contador:</Text>
              <Text style={styles.timer}>{formatTimer(timer)}</Text>
            </View>
          </View>

          {/* Avance y Calidad */}
          <View style={{ flexDirection: "row", width: "100%", marginBottom: 16 }}>
            {/* Avance */}
            <View
              style={{
                width: "50%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{ fontSize: 16, color: textColor, marginBottom: 4 }}
              >
                Avance
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  padding: 8,
                  width: "80%",
                  fontSize: 16,
                  textAlign: "center",
                  color: textColor,
                }}
                value={avanceInput}
                onChangeText={handleChangeAvance}
                keyboardType="numeric"
              />
            </View>

            {/* Calidad */}
            <View
              style={{
                width: "50%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{ fontSize: 16, color: textColor, marginBottom: 4 }}
              >
                ¿Calidad?
              </Text>
              <Switch
                value={calidad}
                onValueChange={setCalidad}
                trackColor={{ false: "#ccc", true: "#d32f2f" }}
                thumbColor={calidad ? "#b71c1c" : "#f4f3f4"}
                ios_backgroundColor="#ccc"
                style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
              />
            </View>
          </View>

          {/* Mensaje de avance */}
          {shouldShowAvanceMsg && (
            <View
              style={{
                marginVertical: 5,
                width: "100%",
                alignItems: "center",
              }}
            >
              <Text
                style={{ textAlign: "center", fontSize: 16, marginBottom: 4 }}
              >
                <Text style={{ color: "#fff" }}>Avance:</Text>
                <Text style={{ color: "#b71c1c" }}>
                  {" "}
                  {pedirAvanceMsgTrim !== "" ? pedirAvanceMsgTrim : "ninguno"}
                </Text>
              </Text>
            </View>
          )}

          {/* Observaciones */}
          <View
            style={{
              marginVertical: 5,
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text
              style={[
                styles.message,
                { textAlign: "center", color: textColor },
              ]}
            >
              Observaciones:
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 8,
                marginBottom: 12,
                width: "100%",
                fontSize: 16,
                minHeight: 80,
                textAlignVertical: "top",
                textAlign: "left",
                color: textColor,
              }}
              placeholder="Describe lo realizado en esta actividad..."
              value={observaciones}
              onChangeText={handleChangeObservaciones}
              multiline
            />
          </View>

          {/* Botones */}
          <View
            style={[
              styles.buttonRow,
              {
                justifyContent: "center",
                width: "100%",
                alignItems: "center",
              },
            ]}
          >
            <View style={[styles.button, { backgroundColor: "#b71c1c" }]}>
              <Button
                title="Salida"
                color="#b71c1c"
                onPress={handleSalida}
                disabled={loading}
              />
            </View>

            <View style={[styles.button, { backgroundColor: "#b71c1c" }]}>
              <Button
                title="Cambiar tarea"
                color="#b71c1c"
                onPress={onChangeTask}
              />
            </View>
          </View>
        </View>
      </View>
    </>
  );
};
