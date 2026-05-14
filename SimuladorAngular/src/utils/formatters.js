// Funciones de formateo para mostrar datos en la interfaz de usuario
// Cada funcion recibe un valor crudo y retorna un string formateado para la UI

import { format, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

// Formatea latidos por minuto
// Recibe: value (number) - BPM
// Retorna: string - ej: "72 BPM"
export function formatBPM(value) {
  if (value === null || value === undefined) return '--'
  return `${Math.round(value)} BPM`
}

// Formatea variabilidad de frecuencia cardiaca
// Recibe: value (number) - HRV en milisegundos
// Retorna: string - ej: "45.2 ms"
export function formatHRV(value) {
  if (value === null || value === undefined) return '--'
  return `${Number(value).toFixed(1)} ms`
}

// Formatea conteo de pasos con separador de miles
// Recibe: value (number) - cantidad de pasos
// Retorna: string - ej: "8,432 pasos"
export function formatSteps(value) {
  if (value === null || value === undefined) return '--'
  return `${Number(value).toLocaleString('es-MX')} pasos`
}

// Formatea calorias quemadas
// Recibe: value (number) - calorias en kcal
// Retorna: string - ej: "2,145.5 kcal"
export function formatCalories(value) {
  if (value === null || value === undefined) return '--'
  return `${Number(value).toLocaleString('es-MX', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kcal`
}

// Formatea distancia recorrida
// Recibe: value (number) - distancia en km
// Retorna: string - ej: "6.73 km"
export function formatDistance(value) {
  if (value === null || value === undefined) return '--'
  return `${Number(value).toFixed(2)} km`
}

// Formatea duracion de sueno de minutos a horas y minutos
// Recibe: minutes (number) - duracion total en minutos
// Retorna: string - ej: "7h 23min"
export function formatSleepDuration(minutes) {
  if (minutes === null || minutes === undefined) return '--'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}min`
}

// Formatea puntuacion de calidad de sueno
// Recibe: value (number) - puntuacion 0-100
// Retorna: string - ej: "78%"
export function formatQualityScore(value) {
  if (value === null || value === undefined) return '--'
  return `${Math.round(value)}%`
}

// Formatea una fecha ISO a formato dia/mes/ano
// Recibe: isoString (string) - fecha en formato ISO 8601
// Retorna: string - ej: "12/05/2026"
export function formatDate(isoString) {
  if (!isoString) return '--'
  return format(new Date(isoString), 'dd/MM/yyyy')
}

// Formatea una hora ISO a formato 24h
// Recibe: isoString (string) - fecha/hora en formato ISO 8601
// Retorna: string - ej: "08:30"
export function formatTime(isoString) {
  if (!isoString) return '--'
  return format(new Date(isoString), 'HH:mm')
}

// Formatea fecha y hora completa
// Recibe: isoString (string) - fecha/hora en formato ISO 8601
// Retorna: string - ej: "12/05/2026 08:30"
export function formatDateTime(isoString) {
  if (!isoString) return '--'
  return format(new Date(isoString), 'dd/MM/yyyy HH:mm')
}

// Formatea un timestamp como tiempo relativo en espanol
// Recibe: isoString (string) - fecha/hora en formato ISO 8601
// Retorna: string - ej: "hace 2 horas"
export function formatRelativeTime(isoString) {
  if (!isoString) return '--'
  return formatDistanceToNow(new Date(isoString), { addSuffix: true, locale: es })
}

// Formatea porcentaje de cambio con signo positivo/negativo
// Recibe: value (number) - porcentaje de cambio
// Retorna: string - ej: "+12%" o "-5%"
export function formatPercentChange(value) {
  if (value === null || value === undefined) return '--'
  const sign = value > 0 ? '+' : ''
  return `${sign}${Math.round(value)}%`
}

// Formatea un valor de acelerometro
// Recibe: value (number) - valor del eje en m/s2
// Retorna: string - ej: "0.2341 m/s²"
export function formatAccelerometer(value) {
  if (value === null || value === undefined) return '--'
  return `${Number(value).toFixed(4)} m/s²`
}

// Formatea un valor de giroscopio
// Recibe: value (number) - valor del eje en grados/s
// Retorna: string - ej: "4.53 °/s"
export function formatGyroscope(value) {
  if (value === null || value === undefined) return '--'
  return `${Number(value).toFixed(2)} °/s`
}

// Formatea el nombre del dia de la semana abreviado con numero
// Recibe: isoString (string) - fecha en formato ISO 8601
// Retorna: string - ej: "Lun 5"
export function formatDayLabel(isoString) {
  if (!isoString) return '--'
  return format(new Date(isoString), 'EEE d', { locale: es })
}
