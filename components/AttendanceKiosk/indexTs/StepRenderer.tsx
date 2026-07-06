import * as React from "react";

// 👇 IMPORTA CADA STEP DIRECTAMENTE DESDE LA CARPETA steps
import { BeforeCheckoutStep } from "../steps/BeforeCheckoutStep";
import { CheckedInStep } from "../steps/CheckedInStep";
import { CheckedOutStep } from "../steps/CheckedOutStep";
import ProjectTaskStep from "../steps/ProjectTaskStep";


/**
 * Componente que renderiza el paso actual del flujo de asistencia según el valor de step.
 * Por simplicidad dejamos los props como any (el problema actual es de imports, no de tipos).
 */
type StepRendererProps = {
  step: "welcome" | "checked_in" | "before_checkout" | "changing_task" | "checked_out";
  showChangingTask?: boolean;
  uid: number;
  pass: string;
  // el resto de props los dejamos abiertos
  [key: string]: any;
};

export function StepRenderer({
  step,
  showChangingTask,
  uid,
  pass,
  ...props
}: StepRendererProps) {
  // 🔎 Pequeña ayuda en desarrollo por si algo sigue viniendo undefined
  if (__DEV__) {
    if (!BeforeCheckoutStep || !CheckedInStep || !CheckedOutStep || !ProjectTaskStep) {
      console.warn("Alguno de los pasos no está bien importado", {
        BeforeCheckoutStep,
        CheckedInStep,
        CheckedOutStep,
        ProjectTaskStep,
      });
    }
  }

  switch (step) {
    case "welcome": {
      // En tu lógica actual, el modo welcome y showChangingTask hacen lo mismo,
      // así que simplificamos a un solo return.
      return (
        <ProjectTaskStep
          mode="welcome"
          uid={uid}
          pass={pass}
          onCheckIn={props.handleCheckIn}
          onLogout={props.onLogout}
          onContinue={props.onContinue}
          loading={props.loading}
          selectedProject={props.selectedProject}
          selectedTask={props.selectedTask}
          setSelectedProject={props.setSelectedProject}
          setSelectedTask={props.setSelectedTask}
          observaciones={props.observaciones}
          setObservaciones={props.setObservaciones}
          avanceInput={props.avanceInput}
          setAvanceInput={props.setAvanceInput}
          pendingProject={props.pendingProject}
          pendingTask={props.pendingTask}
          safeSetPendingProject={props.safeSetPendingProject}
          safeSetPendingTask={props.safeSetPendingTask}
          currentProject={props.currentProject}
          currentTask={props.currentTask}
          pedirAvanceMsg={props.pedirAvanceMsg}
        />
      );
    }

    case "checked_in":
      return (
        <CheckedInStep
          checkInTime={props.checkInTime}
          onNext={props.onNext}
          timer={props.timer}
          formatTimer={props.formatTimer}
          loading={props.loading}
          observaciones={props.observaciones}
          setObservaciones={props.setObservaciones}
          avanceInput={props.avanceInput}
          setAvanceInput={props.setAvanceInput}
          selectedProject={props.selectedProject}
          selectedTask={props.selectedTask}
        />
      );

    case "before_checkout":
      return (
        <BeforeCheckoutStep
          workedHours={props.workedHours}
          onCheckOut={(observaciones: string, calidad?: boolean, avance?: number) =>
            props.handleCheckOutWithProgress(
              observaciones,
              calidad,
              avance
            )
          }
          onChangeTask={props.startChangingTask}
          loading={props.loading}
          timer={props.timer}
          formatTimer={props.formatTimer}
          observaciones={props.observaciones}
          setObservaciones={props.setObservaciones}
          avanceInput={props.avanceInput}
          setAvanceInput={props.setAvanceInput}
          pedirAvanceMsg={props.pedirAvanceMsg}
        />
      );

    case "changing_task":
      return (
        <ProjectTaskStep
          mode="changing_task"
          uid={uid}
          pass={pass}
          onCheckIn={props.handleCheckIn}
          onLogout={props.onLogout}
          onContinue={props.onContinue}
          onCancel={() => {
            // Al cancelar, volvemos al paso anterior y limpiamos pendientes
            props.setShowChangingTask?.(false);
            props.setPendingProject?.(null);
            props.setPendingTask?.(null);
            props.setStep?.("before_checkout");
          }}
          loading={props.loading}
          // En modo cambio de tarea usamos los "pending"
          selectedProject={props.selectedProject}
          selectedTask={props.selectedTask}
          setSelectedProject={props.safeSetPendingProject ?? props.setSelectedProject}
          setSelectedTask={props.safeSetPendingTask ?? props.setSelectedTask}
          observaciones={props.observaciones}
          setObservaciones={props.setObservaciones}
          avanceInput={props.avanceInput}
          setAvanceInput={props.setAvanceInput}
          pendingProject={props.pendingProject}
          pendingTask={props.pendingTask}
          safeSetPendingProject={props.safeSetPendingProject}
          safeSetPendingTask={props.safeSetPendingTask}
          currentProject={props.currentProject}
          currentTask={props.currentTask}
          pedirAvanceMsg={props.pedirAvanceMsg}
        />
      );

    case "checked_out":
      return (
        <CheckedOutStep
          onRestart={props.onRestart}
          onLogout={props.onLogout}
          checkOutTime={props.checkOutTime}
          workedHours={props.workedHours}
          fullTime={props.fullTime}
        />
      );

    default:
      return null;
  }
}
