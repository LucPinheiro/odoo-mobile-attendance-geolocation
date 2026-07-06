import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";
import styles from "../AttendanceStyles";
import { ProjectTaskStepProps, WebLocation } from "./AttendanceStepTypes";
import { getLocationWeb } from "../../../utils/getLocationWeb";
import ProjectTaskDropdowns from "../otros/ProjectTaskDropdowns";

export function ProjectTaskStep(props: ProjectTaskStepProps) {
  const {
    loading,
    uid,
    pass,
    selectedProject,
    selectedTask,
    setSelectedProject,
    setSelectedTask,
    observaciones,
    setObservaciones,
    avanceInput,
    setAvanceInput,
    onCheckIn,
    onLogout,
    onCancel,
    onContinue,
    mode,
    continueButtonColor,
    pedirAvanceMsg,
    pendingProject,
    pendingTask,
    safeSetPendingProject,
    safeSetPendingTask,
    currentProject,
    currentTask,
  } = props;

  const [location, setLocation] = useState<WebLocation | null>(null);

  const isWelcomeMode = mode === "welcome";
  const isChangingTask = mode === "changing_task";

  const pedirAvanceMsgTrim = (pedirAvanceMsg ?? "").trim();
  const pedirAvanceMsgLower = pedirAvanceMsgTrim.toLowerCase();
  const shouldShowAvanceInput =
    pedirAvanceMsgTrim !== "" && pedirAvanceMsgLower !== "no";

  // ---------- Location ----------
  useEffect(() => {
    let isMounted = true;

    const fetchLocation = async () => {
      try {
        const loc = await getLocationWeb();
        if (!isMounted) return;

        if (loc) {
          setLocation(loc);
          console.log("[ProjectTaskStep] Localización obtenida:", loc);
        } else {
          setLocation(null);
          console.log("[ProjectTaskStep] No se pudo obtener la localización");
        }
      } catch (err) {
        if (!isMounted) return;
        setLocation(null);
        console.log("[ProjectTaskStep] Error al obtener la localización:", err);
      }
    };

    fetchLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  // ---------- Helpers ----------
  const filterProjects = useCallback((projects: any) => {
    if (!projects) return projects;
    if (Array.isArray(projects)) {
      return projects.filter((p) => p?.id !== 0);
    }
    return projects;
  }, []);

  // "Actual" (la actividad vigente). Si por tu flujo current* no viene, usamos selected* como fallback.
  const actualProject = useMemo(
    () => currentProject ?? selectedProject,
    [currentProject, selectedProject]
  );
  const actualTask = useMemo(
    () => currentTask ?? selectedTask,
    [currentTask, selectedTask]
  );

  // Para los dropdowns: en modo changing_task editan pending; en welcome editan selected
  const projectListSelectedProject = isChangingTask ? pendingProject : selectedProject;
  const projectListSelectedTask = isChangingTask ? pendingTask : selectedTask;

  const projectListSetProject =
    isChangingTask && safeSetPendingProject ? safeSetPendingProject : setSelectedProject;

  const projectListSetTask =
    isChangingTask && safeSetPendingTask ? safeSetPendingTask : setSelectedTask;

  // Al entrar a cambiar tarea, inicializamos pending con lo actual si aún está vacío
  useEffect(() => {
    if (!isChangingTask) return;

    if (!pendingProject && actualProject) {
      safeSetPendingProject?.(actualProject);
    }
    if (!pendingTask && actualTask) {
      safeSetPendingTask?.(actualTask);
    }
  }, [
    isChangingTask,
    pendingProject,
    pendingTask,
    actualProject,
    actualTask,
    safeSetPendingProject,
    safeSetPendingTask,
  ]);

  // Validaciones por modo
  const canEnter = !!selectedProject && !!selectedTask;
  const canContinue = isChangingTask
    ? !!pendingProject && !!pendingTask
    : canEnter;

  const handleChangeAvance = useCallback(
    (text: string) => {
      if (setAvanceInput) {
        setAvanceInput(text);
      }
    },
    [setAvanceInput]
  );

  const handleCheckIn = useCallback(() => {
    if (!onCheckIn) return;
    onCheckIn(observaciones || "", location);
  }, [onCheckIn, observaciones, location]);

  const handleContinue = useCallback(() => {
    if (!onContinue) return;
    onContinue(location);
  }, [onContinue, location]);

  const entradaColor = continueButtonColor || "#b71c1c";

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        padding: 16,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ width: "100%", maxWidth: 500, alignSelf: "center" }}>
        <Text
          style={
            isWelcomeMode
              ? {
                  ...styles.welcome,
                  textAlign: "center",
                  marginBottom: 16,
                  color: "#fff",
                }
              : {
                  ...styles.welcome,
                  textAlign: "center",
                  marginBottom: 16,
                  color: "#333",
                }
          }
        >
          {isWelcomeMode ? "¡Bienvenido!" : "Selecciona nueva tarea"}
        </Text>

        <ProjectTaskDropdowns
          uid={uid}
          pass={pass}
          selectedProject={filterProjects(projectListSelectedProject)}
          selectedTask={projectListSelectedTask}
          onSelectProject={projectListSetProject}
          onSelectTask={projectListSetTask}
          hideTitle={isChangingTask}
          pedirAvanceMsg={pedirAvanceMsg}
          // ✅ IMPORTANTE: "Actual" SIEMPRE es la vigente (no pending)
          currentProject={filterProjects(actualProject)}
          currentTask={actualTask}
        />

        {shouldShowAvanceInput && (
          <View
            style={{
              marginVertical: 16,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextInput
              placeholder={pedirAvanceMsgTrim || "Ingresa el avance (%)"}
              keyboardType="numeric"
              value={typeof avanceInput === "string" ? avanceInput : ""}
              onChangeText={handleChangeAvance}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 6,
                padding: 8,
                fontSize: 16,
                backgroundColor: "#fff",
                width: "100%",
                textAlign: "left",
              }}
            />
          </View>
        )}

        <View
          style={
            isWelcomeMode
              ? [
                  styles.buttonRow,
                  {
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]
              : [
                  styles.buttonRow,
                  {
                    marginBottom: 24,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]
          }
        >
          {isWelcomeMode ? (
            <>
              {onLogout && (
                <View style={styles.button}>
                  <Button
                    title="Cerrar sesión"
                    color="#b71c1c"
                    onPress={onLogout}
                  />
                </View>
              )}

              <View style={styles.button}>
                <Button
                  title="Entrada"
                  color={entradaColor}
                  onPress={handleCheckIn}
                  disabled={loading || !canEnter}
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.button}>
                <Button
                  title="Cancelar"
                  color="#b71c1c"
                  onPress={onCancel}
                  disabled={loading}
                />
              </View>

              <View style={styles.button}>
                <Button
                  title="Continuar"
                  color={entradaColor}
                  onPress={handleContinue}
                  disabled={loading || !canContinue}
                />
              </View>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

export default ProjectTaskStep;