import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useProjectTaskDropdownsLogic } from '../../../ts/useProjectTaskDropdownsLogic';
import { getEmployeeTiempoActividad } from '../../../db/odooApi';
import ProjectTaskDropdownsStyles from './ProjectTaskDropdownsStyles';

/** ===== Helpers para rotular items aunque vengan en formatos distintos ===== */
type AnyRec = Record<string, any>;
type RecordId = { id: number } & AnyRec;

function pickLabelGeneric(x: AnyRec): string | null {
  // Campos “clásicos”
  if (typeof x.name === 'string' && x.name) return x.name;
  if (typeof x.display_name === 'string' && x.display_name) return x.display_name;
  if (typeof x.descripcion === 'string' && x.descripcion) return x.descripcion;
  if (typeof x.description === 'string' && x.description) return x.description;
  if (typeof x.title === 'string' && x.title) return x.title;
  if (typeof x.label === 'string' && x.label) return x.label;
  if (typeof x.nombre === 'string' && x.nombre) return x.nombre;
  return null;
}

function pickFromMany2one(v: any): string | null {
  // Odoo many2one -> [id, name]
  if (Array.isArray(v) && v.length >= 2 && typeof v[1] === 'string') return v[1];
  return null;
}

function getProjectLabel(item: AnyRec): string {
  // 1) Campos comunes
  const common = pickLabelGeneric(item);
  if (common) return common;

  // 2) Posibles claves de proyecto / many2one
  const m2o =
    pickFromMany2one(item.project_id) ||
    pickFromMany2one(item.proyecto_id) ||
    pickFromMany2one(item.project) ||
    pickFromMany2one(item.proyecto);
  if (m2o) return m2o;

  // 3) Otros campos frecuentes
  if (typeof item.project_name === 'string' && item.project_name) return item.project_name;
  if (typeof item.proyecto_name === 'string' && item.proyecto_name) return item.proyecto_name;

  // 4) Fallback
  return `Proyecto #${item.id ?? '?'}`;
}

function getActivityLabel(item: AnyRec): string {
  const common = pickLabelGeneric(item);
  if (common) return common;

  const m2o =
    pickFromMany2one(item.task_id) ||
    pickFromMany2one(item.actividad_id) ||
    pickFromMany2one(item.task) ||
    pickFromMany2one(item.actividad);
  if (m2o) return m2o;

  if (typeof item.task_name === 'string' && item.task_name) return item.task_name;
  if (typeof item.activity_name === 'string' && item.activity_name) return item.activity_name;
  if (typeof item.actividad_name === 'string' && item.actividad_name) return item.actividad_name;

  return `Actividad #${item.id ?? '?'}`;
}

/** ===== Dropdown simple (con opción de formateador de etiqueta) ===== */
function SimpleDropdown({
  label,
  placeholder,
  data,
  selected,
  onSelect,
  loading,
  disabled,
  getItemLabel,
}: {
  label: string;
  placeholder: string;
  data: RecordId[];
  selected: RecordId | null;
  onSelect: (x: RecordId) => void;
  loading?: boolean;
  disabled?: boolean;
  getItemLabel: (item: RecordId) => string; // <- obligatorio para que podamos elegir formateo por lista
}) {
  const s = ProjectTaskDropdownsStyles;
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    const q = (filter || '').toLowerCase().trim();
    if (!q) return data;
    return data.filter((x) => getItemLabel(x).toLowerCase().includes(q));
  }, [data, filter, getItemLabel]);

  const selectedLabel = selected ? getItemLabel(selected) : '';

  return (
    <View style={s.fieldContainer}>
      <Text style={s.label}>{label}</Text>

      <TouchableOpacity
        style={[
          s.dropdownButton,
          open && s.dropdownButtonOpen,
          (loading || disabled) && s.dropdownButtonDisabled,
        ]}
        onPress={() => !disabled && setOpen(true)}
        disabled={loading || disabled}
        activeOpacity={0.85}
      >
        {loading ? (
          <View style={s.loadingRow}>
            <ActivityIndicator />
            <Text style={s.loadingText}>Cargando…</Text>
          </View>
        ) : (
          <>
            <Text
              style={[
                s.dropdownButtonText,
                !selectedLabel && s.placeholderText,
              ]}
              numberOfLines={1}
            >
              {selectedLabel || placeholder}
            </Text>
            <Text style={s.dropdownArrow}>▾</Text>
          </>
        )}
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setOpen(false)}
          style={s.modalOverlay}
        >
          <View style={s.modalContent}>
            <View style={{ padding: 12 }}>
              <TextInput
                placeholder="Filtrar…"
                value={filter}
                onChangeText={setFilter}
                autoFocus
                style={{
                  borderWidth: 1,
                  borderColor: '#eee',
                  borderRadius: 8,
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  marginBottom: 10,
                }}
              />
              <FlatList
                data={filtered}
                keyExtractor={(item) => String(item.id)}
                style={s.dropdownList}
                renderItem={({ item }) => {
                  const title = getItemLabel(item);
                  const isSelected = selected?.id === item.id;
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        onSelect(item);
                        setOpen(false);
                        setFilter('');
                      }}
                      style={[s.dropdownItem, isSelected && s.selectedDropdownItem]}
                    >
                      <Text style={s.dropdownItemText}>{title}</Text>
                    </TouchableOpacity>
                  );
                }}
                ListEmptyComponent={
                  <Text style={{ padding: 12, color: '#888' }}>Sin resultados</Text>
                }
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

/** ===== Componente principal ===== */
type Props = {
  uid: number;
  pass: string;
  employeeId?: number;    
  selectedProject: RecordId | null;
  selectedTask: RecordId | null;
  onSelectProject: (p: RecordId | null) => void;
  onSelectTask: (t: RecordId | null) => void;
  hideTitle?: boolean;
  currentProject?: RecordId | null;
  currentTask?: RecordId | null;
};

export default function ProjectTaskDropdowns({
  uid,
  pass,
  employeeId,  
  selectedProject,
  selectedTask,
  onSelectProject,
  onSelectTask,
  hideTitle,
  currentProject,
  currentTask,
}: Props) {
  const s = ProjectTaskDropdownsStyles;

  const {
    proyectos,
    availableActivities,
    loading,
    loadingTasks,
  } = useProjectTaskDropdownsLogic(uid, pass, selectedProject, currentTask);

  // Horas restantes de la actividad seleccionada
  const [selectedActivityHours, setSelectedActivityHours] = useState<number | null>(null);
  const [loadingHours, setLoadingHours] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchHours() {
      if (!selectedProject?.id || !selectedTask?.id) {
        setSelectedActivityHours(null);
        return;
      }
      setLoadingHours(true);

      const empIdToUse = employeeId ?? uid; // si tienes hr.employee.id pásalo por props

      try {
        console.debug(
          '[getEmployeeTiempoActividad] params =>',
          { emp_id: empIdToUse, project_id: selectedProject.id, actividad_id: selectedTask.id }
        );

        const raw = await getEmployeeTiempoActividad({
          uid,
          pass,
          emp_id: empIdToUse,
          project_id: selectedProject.id,
          actividad_id: selectedTask.id,
        });

        console.debug('[getEmployeeTiempoActividad] raw result <=', raw);

        if (cancelled) return;

        // Normalizamos la respuesta a número:
        let n: number | null = null;

        if (typeof raw === 'number') {
          n = raw;
        } else if (typeof raw === 'string' && raw.trim() !== '' && !isNaN(Number(raw))) {
          n = Number(raw);
        } else if (raw && typeof raw === 'object') {
          // formatos típicos
          const obj = raw as any;
          if (typeof obj.horas_restantes === 'number') n = obj.horas_restantes;
          else if (typeof obj.remaining_hours === 'number') n = obj.remaining_hours;
          else if (typeof obj.remaining === 'number') n = obj.remaining;
          else if (typeof obj.horas === 'number') n = obj.horas;
          else if (
            typeof obj.asignadas === 'number' &&
            typeof obj.consumidas === 'number'
          ) n = Math.max(0, obj.asignadas - obj.consumidas);
          else if (Array.isArray(obj) && obj.length >= 2 &&
                   typeof obj[0] === 'number' && typeof obj[1] === 'number') {
            // [asignadas, consumidas]
            n = Math.max(0, obj[0] - obj[1]);
          }
        }

        if (n == null) {
          console.warn(
            '[getEmployeeTiempoActividad] No se pudo interpretar la respuesta como horas. ' +
            'Muestra N/D. Revisa la estructura devuelta por la API.'
          );
        }

        setSelectedActivityHours(n);
      } catch (e: any) {
        console.error('[getEmployeeTiempoActividad] fallo RPC:', e?.message || e);
        setSelectedActivityHours(null);
      } finally {
        if (!cancelled) setLoadingHours(false);
      }
    }

    fetchHours();
    return () => {
      cancelled = true;
    };
  }, [uid, pass, employeeId, selectedProject?.id, selectedTask?.id]);


  function handleProject(p: RecordId) {
    onSelectProject(p);
    if (!currentProject || currentProject?.id !== p.id) onSelectTask(null);
    setSelectedActivityHours(null);
  }
  function handleTask(t: RecordId) {
    onSelectTask(t);
  }

  const helpMessage = useMemo(() => {
    if (!selectedProject) return 'Selecciona un proyecto para ver las actividades disponibles';
    if (!selectedTask) return 'Selecciona una actividad para continuar';
    const textoHoras = loadingHours ? 'calculando…' : selectedActivityHours ?? 'N/D';
    return `✓ Proyecto y actividad seleccionado — Horas restantes: ${textoHoras}`;
  }, [selectedProject, selectedTask, selectedActivityHours, loadingHours]);

  const currentProjectLabel = currentProject ? getProjectLabel(currentProject) : '';
  const currentTaskLabel = currentTask ? getActivityLabel(currentTask) : '';

  return (
    <View style={s.container}>
      {!hideTitle && <Text style={s.title}>Selecciona Proyecto y Actividad</Text>}

      {!!currentProject && !!currentTask && (
        <View style={s.currentInfo}>
          <Text style={s.currentLabel}>Actual</Text>
          <Text style={s.currentText}>Proyecto: {currentProjectLabel}</Text>
          <Text style={s.currentText}>Actividad: {currentTaskLabel}</Text>
          <Text style={s.changeLabel}>Cambiar a:</Text>
        </View>
      )}

      <SimpleDropdown
        label="Proyecto"
        placeholder="Elige un proyecto…"
        data={proyectos || []}
        selected={selectedProject}
        onSelect={handleProject}
        loading={!!loading}
        getItemLabel={getProjectLabel}
      />

      <SimpleDropdown
        label="Actividad"
        placeholder={selectedProject ? 'Elige una actividad…' : 'Selecciona un proyecto primero'}
        data={selectedProject ? (availableActivities || []) : []}
        selected={selectedTask}
        onSelect={handleTask}
        loading={!!loadingTasks}
        disabled={!selectedProject}
        getItemLabel={getActivityLabel}
      />

      <View style={s.helpContainer}>
        <Text style={s.helpText}>{helpMessage}</Text>
      </View>
    </View>
  );
}
