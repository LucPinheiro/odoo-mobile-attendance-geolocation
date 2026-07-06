/**
 * Componente de alerta para problemas de ubicación
 * 
 * Muestra mensajes específicos cuando no se puede obtener la ubicación
 * y proporciona acciones para que el usuario pueda solucionarlo.
 */

import React from 'react';
import { Alert, Linking, Text, TouchableOpacity, View } from 'react-native';
import LocationAlertStyles from './LocationAlertStyles';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface LocationAlertProps {
  visible: boolean;
  message: string;
  onRetry: () => void;
  onCancel?: () => void;
}

export function LocationAlert({ visible, message, onRetry, onCancel }: LocationAlertProps) {
  if (!visible) return null;

  const handleOpenSettings = () => {
    Alert.alert(
      'Abrir configuración',
      'Para activar la ubicación, ve a Configuración > Aplicaciones > Asistencia App > Permisos y activa la ubicación. También asegúrate de que el GPS esté activado en los ajustes del dispositivo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Abrir configuración', onPress: () => Linking.openSettings() },
      ]
    );
  };

  return (
    <ThemedView style={LocationAlertStyles.overlay}>
      <View style={LocationAlertStyles.container}>
        <View style={LocationAlertStyles.content}>
          {/* Icono de alerta */}
          <View style={LocationAlertStyles.iconContainer}>
            <Text style={LocationAlertStyles.alertIcon}>⚠️</Text>
          </View>

          {/* Título */}
          <ThemedText style={LocationAlertStyles.title}>
            Ubicación requerida
          </ThemedText>

          {/* Mensaje específico */}
          <ThemedText style={LocationAlertStyles.message}>
            {message}
          </ThemedText>

          <ThemedText style={LocationAlertStyles.subMessage}>
            La ubicación es obligatoria para registrar la asistencia y verificar que estés en el lugar de trabajo.
          </ThemedText>

          {/* Botones de acción */}
          <View style={LocationAlertStyles.buttonContainer}>
            <TouchableOpacity
              style={[LocationAlertStyles.button, LocationAlertStyles.primaryButton]}
              onPress={onRetry}
            >
              <Text style={LocationAlertStyles.primaryButtonText}>
                Intentar nuevamente
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[LocationAlertStyles.button, LocationAlertStyles.secondaryButton]}
              onPress={handleOpenSettings}
            >
              <Text style={LocationAlertStyles.secondaryButtonText}>
                Abrir configuración
              </Text>
            </TouchableOpacity>

            {onCancel && (
              <TouchableOpacity
                style={[LocationAlertStyles.button, LocationAlertStyles.cancelButton]}
                onPress={onCancel}
              >
                <Text style={LocationAlertStyles.cancelButtonText}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Información adicional */}
          <View style={LocationAlertStyles.infoContainer}>
            <ThemedText style={LocationAlertStyles.infoText}>
              💡 Asegúrate de que el GPS esté activado y que tengas buena señal
            </ThemedText>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

