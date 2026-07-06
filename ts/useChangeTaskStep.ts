import { useCallback, useEffect, useMemo } from "react";

type Step = "welcome" | "checked_in" | "before_checkout" | "checked_out" | "changing_task";

export function useChangeTaskStep(params: {
  step: Step;

  // "Actual" (lo que está guardado en el sistema/UI como actividad vigente)
  selectedProject: any;
  selectedTask: any;

  // "Cambiar a" (lo que el usuario está seleccionando)
  pendingProject: any;
  pendingTask: any;

  setPendingProject: (v: any) => void;
  setPendingTask: (v: any) => void;

  // Para cancelar y volver al paso anterior (si quieres)
  setStep?: (v: Step) => void;
  setShowChangingTask?: (v: boolean) => void;
}) {
  const {
    step,
    selectedProject,
    selectedTask,
    pendingProject,
    pendingTask,
    setPendingProject,
    setPendingTask,
    setStep,
    setShowChangingTask,
  } = params;

  // Cuando entras a "changing_task", si pending está vacío lo inicializamos con la actual
  useEffect(() => {
    if (step !== "changing_task") return;

    if (!pendingProject && selectedProject) setPendingProject(selectedProject);
    if (!pendingTask && selectedTask) setPendingTask(selectedTask);
  }, [
    step,
    pendingProject,
    pendingTask,
    selectedProject,
    selectedTask,
    setPendingProject,
    setPendingTask,
  ]);

  const currentProject = useMemo(() => selectedProject, [selectedProject]);
  const currentTask = useMemo(() => selectedTask, [selectedTask]);

  const newProject = useMemo(() => pendingProject, [pendingProject]);
  const newTask = useMemo(() => pendingTask, [pendingTask]);

  const cancelChangeTask = useCallback(() => {
    // vuelve a dejar pending como la actual (o null si prefieres)
    setPendingProject(selectedProject);
    setPendingTask(selectedTask);

    // cerrar modal/flujo si aplica
    setShowChangingTask?.(false);

    // volver a un paso seguro (ajusta según tu flujo)
    if (setStep) setStep("before_checkout");
  }, [
    selectedProject,
    selectedTask,
    setPendingProject,
    setPendingTask,
    setShowChangingTask,
    setStep,
  ]);

  // Solo validación mínima (por si el usuario no selecciona nada)
  const canContinue = !!newProject && !!newTask;

  return {
    // Para pintar en UI
    currentProject,
    currentTask,
    newProject,
    newTask,

    // Acciones
    canContinue,
    cancelChangeTask,
  };
}