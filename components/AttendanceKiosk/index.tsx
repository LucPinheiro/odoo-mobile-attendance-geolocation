import React from "react";
import { Text, View } from "react-native";
import * as attendanceHooks from "../../hooks/otros/attendanceHooks";
import useThemeColors from "../../hooks/useThemeColors";
import { useEmployeeInfo } from "../../ts/useEmployeeInfo";
import { LocationAlert } from "../LocationAlert";
import styles from "./AttendanceStyles";
import { StepRenderer } from "./indexTs/StepRenderer";
import { useAttendanceKioskLogic } from "./useAttendanceKioskLogic";
import { getEmployeeIdFromUser, getUserName } from "../../db/odooApi";

interface AttendanceKioskProps {
  uid: number;
  pass: string;
  onLogout?: () => void;
}

const AttendanceKiosk = (props: AttendanceKioskProps) => {
  const colors = useThemeColors({ light: undefined, dark: undefined }, "text");
  const logic = useAttendanceKioskLogic(props, attendanceHooks);
  const employeeInfo = useEmployeeInfo(props.uid, props.pass);

  // Nombre/Inicial mostrados en el header
  const [headerName, setHeaderName] = React.useState<string>("Usuario");
  const [headerInitial, setHeaderInitial] = React.useState<string>("U");

  // Cargar nombre (sin foto)
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const empId = await getEmployeeIdFromUser(props.uid, props.pass);
        const data = await getUserName({
          uid: props.uid,
          pass: props.pass,
          employeeId: empId ?? undefined,
        });
        if (!mounted) return;
        const name = data?.userName || "Usuario";
        const initial = (data?.userInitial || name?.[0] || "U").toUpperCase();
        setHeaderName(name);
        setHeaderInitial(initial);
      } catch {
        if (!mounted) return;
        setHeaderName("Usuario");
        setHeaderInitial("U");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [props.uid, props.pass]);

  // Log para depuración
  React.useEffect(() => {
    console.log("[AttendanceKiosk] Render, step actual:", logic.step);
  });

  const isChanging = logic.step === "changing_task" || logic.showChangingTask;

  return (
    <View style={[styles.container, { flex: 1 }]}>
      {/* Header: solo avatar con inicial y nombre */}
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          marginTop: 50,
        }}
      >
        {/* Avatar (inicial) */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{headerInitial}</Text>
        </View>

        {/* Nombre */}
        <Text style={[styles.title, { color: colors.text }]}>{headerName}</Text>

        {/* Línea de Bolsa/Vacaciones: siempre visible, con valores por defecto */}
        <View
          style={{
            marginTop: 8,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: colors.text, fontSize: 15 }}>
            Bolsa de Horas{" "}
            <Text style={{ fontWeight: "bold" }}>
              {Number(employeeInfo?.bolsa_horas_numero ?? 0)}
            </Text>
          </Text>
          <Text style={{ color: colors.text, fontSize: 15, marginHorizontal: 8 }}>
            |
          </Text>
          <Text style={{ color: colors.text, fontSize: 15 }}>
            Vacaciones disponibles{" "}
            <Text style={{ fontWeight: "bold" }}>
              {Number(employeeInfo?.remaining_leaves ?? 0)}
            </Text>
          </Text>
        </View>
      </View>

      {/* Pasos */}
      <StepRenderer
        step={logic.step}
        showChangingTask={logic.showChangingTask}
        uid={props.uid}
        pass={props.pass}
        loading={logic.loading}
        checkInTime={logic.checkInTime}
        setCheckInTime={logic.setCheckInTime}
        checkOutTime={logic.checkOutTime}
        setCheckOutTime={logic.setCheckOutTime}
        workedHours={logic.workedHours}
        selectedProject={logic.selectedProject}
        setSelectedProject={logic.setSelectedProject}
        selectedTask={logic.selectedTask}
        setSelectedTask={logic.setSelectedTask}
        setStep={logic.setStep}
        onLogout={props.onLogout}
        timer={logic.timer}
        formatTimer={logic.formatTimer}
        observaciones={logic.observaciones}
        setObservaciones={logic.setObservaciones}
        fullTime={logic.fullTime}
        handleCheckIn={logic.handleCheckIn}
        handleCheckOut={logic.handleCheckOut}
        fetchEmployeeId={logic.fetchEmployeeId}
        setLastCheckOutTimestamp={logic.setLastCheckOutTimestamp}
        setCheckInTimestamp={logic.setCheckInTimestamp}
        showMessage={logic.showMessage}
        setLoading={logic.setLoading}
        pendingProject={logic.pendingProject}
        setPendingProject={logic.setPendingProject}
        pendingTask={logic.pendingTask}
        setPendingTask={logic.setPendingTask}
        avanceInput={logic.avance !== undefined ? logic.avance.toString() : ""}
        setAvanceInput={logic.setAvanceInput}
        safeSetPendingProject={logic.safeSetPendingProject}
        safeSetPendingTask={logic.safeSetPendingTask}
        handleCheckOutWithProgress={logic.handleCheckOutWithProgress}
        startChangingTask={logic.startChangingTask}
        handleChangeTaskFlow={logic.handleChangeTaskFlow}
        setShowChangingTask={logic.setShowChangingTask}
        onNext={logic.handleNextFromCheckedIn}
        onRestart={logic.handleRestartFromCheckedOut}
        onContinue={
          isChanging
            ? logic.handleContinueFromChangingTask
            : logic.handleContinueFromProjectTask
        }
        // ✅ CLAVE: "Actual" en changing_task es last* (congelado)
        currentProject={isChanging ? logic.lastProject : logic.selectedProject}
        currentTask={isChanging ? logic.lastTask : logic.selectedTask}
        pedirAvanceMsg={logic.pedirAvanceMsg}
      />

      <LocationAlert
        visible={logic.showLocationAlert}
        message={logic.locationAlertMessage}
        onRetry={logic.handleLocationRetry}
        onCancel={() => logic.setShowLocationAlert(false)}
      />
    </View>
  );
};

export default AttendanceKiosk;