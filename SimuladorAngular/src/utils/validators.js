// Funciones de validacion para formularios de la aplicacion
// Cada funcion recibe un valor y retorna un objeto { valid: boolean, message: string }

// Valida formato de correo electronico
// Recibe: value (string) - el correo a validar
// Retorna: { valid, message } - resultado de la validacion
export function validateEmail(value) {
  if (!value || value.trim().length === 0) {
    return { valid: false, message: 'Ingresa tu correo electrónico' }
  }
  if (value.length < 5) {
    return { valid: false, message: 'El correo es demasiado corto' }
  }
  if (value.length > 100) {
    return { valid: false, message: 'El correo no puede exceder 100 caracteres' }
  }
  if (!value.includes('@')) {
    return { valid: false, message: 'El correo debe contener @' }
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    return { valid: false, message: 'Formato de correo inválido' }
  }
  return { valid: true, message: '' }
}

// Valida PIN de dispositivo (exactamente 6 digitos numericos)
// Recibe: value (string) - el PIN a validar
// Retorna: { valid, message } - resultado de la validacion
export function validatePin(value) {
  if (!value || value.length === 0) {
    return { valid: false, message: 'Ingresa el PIN de tu dispositivo' }
  }
  if (!/^\d+$/.test(value)) {
    return { valid: false, message: 'Solo se permiten números' }
  }
  if (value.length !== 6) {
    return { valid: false, message: 'El PIN debe ser de exactamente 6 dígitos' }
  }
  return { valid: true, message: '' }
}

// Valida frecuencia cardiaca en BPM (30-250, entero)
// Recibe: value (number|string) - BPM a validar
// Retorna: { valid, message }
export function validateBPM(value) {
  const num = Number(value)
  if (value === '' || value === null || value === undefined || isNaN(num)) {
    return { valid: false, message: 'Ingresa un valor de BPM' }
  }
  if (!Number.isInteger(num)) {
    return { valid: false, message: 'El BPM debe ser un número entero' }
  }
  if (num < 30 || num > 250) {
    return { valid: false, message: 'El BPM debe ser entre 30 y 250' }
  }
  return { valid: true, message: '' }
}

// Valida variabilidad de frecuencia cardiaca en ms (5-200, 1 decimal)
// Recibe: value (number|string) - HRV a validar
// Retorna: { valid, message }
export function validateHRV(value) {
  if (value === '' || value === null || value === undefined) {
    return { valid: true, message: '' }
  }
  const num = Number(value)
  if (isNaN(num)) {
    return { valid: false, message: 'Ingresa un valor numérico' }
  }
  if (num < 5 || num > 200) {
    return { valid: false, message: 'El HRV debe ser entre 5 y 200 ms' }
  }
  return { valid: true, message: '' }
}

// Valida conteo de pasos diarios (0-100000, entero)
// Recibe: value (number|string) - pasos a validar
// Retorna: { valid, message }
export function validateSteps(value) {
  const num = Number(value)
  if (value === '' || value === null || value === undefined || isNaN(num)) {
    return { valid: false, message: 'Ingresa el número de pasos' }
  }
  if (!Number.isInteger(num)) {
    return { valid: false, message: 'Los pasos deben ser un número entero' }
  }
  if (num < 0 || num > 100000) {
    return { valid: false, message: 'Los pasos deben ser entre 0 y 100,000' }
  }
  return { valid: true, message: '' }
}

// Valida calorias quemadas en kcal (0-10000, 1 decimal)
// Recibe: value (number|string) - calorias a validar
// Retorna: { valid, message }
export function validateCalories(value) {
  const num = Number(value)
  if (value === '' || value === null || value === undefined || isNaN(num)) {
    return { valid: false, message: 'Ingresa las calorías' }
  }
  if (num < 0 || num > 10000) {
    return { valid: false, message: 'Las calorías deben ser entre 0 y 10,000' }
  }
  return { valid: true, message: '' }
}

// Valida distancia recorrida en km (0-100, 2 decimales)
// Recibe: value (number|string) - distancia a validar
// Retorna: { valid, message }
export function validateDistance(value) {
  const num = Number(value)
  if (value === '' || value === null || value === undefined || isNaN(num)) {
    return { valid: false, message: 'Ingresa la distancia' }
  }
  if (num < 0 || num > 100) {
    return { valid: false, message: 'La distancia debe ser entre 0 y 100 km' }
  }
  return { valid: true, message: '' }
}

// Valida minutos de sueno por fase (0-600, entero)
// Recibe: value (number|string) - minutos a validar
// Recibe: fase (string) - nombre de la fase para el mensaje de error
// Retorna: { valid, message }
export function validateSleepMinutes(value, fase) {
  const num = Number(value)
  if (value === '' || value === null || value === undefined || isNaN(num)) {
    return { valid: false, message: `Ingresa los minutos de ${fase}` }
  }
  if (!Number.isInteger(num)) {
    return { valid: false, message: 'Los minutos deben ser un número entero' }
  }
  if (num < 0 || num > 600) {
    return { valid: false, message: `El ${fase} debe ser entre 0 y 600 minutos` }
  }
  return { valid: true, message: '' }
}

// Valida que una fecha no sea futura
// Recibe: value (string) - fecha en formato YYYY-MM-DD
// Retorna: { valid, message }
export function validateDateNotFuture(value) {
  if (!value) {
    return { valid: false, message: 'Selecciona una fecha' }
  }
  const selected = new Date(value)
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  if (selected > today) {
    return { valid: false, message: 'La fecha no puede ser futura' }
  }
  return { valid: true, message: '' }
}

// Valida que un campo de hora no este vacio
// Recibe: value (string) - hora en formato HH:mm
// Retorna: { valid, message }
export function validateTimeRequired(value) {
  if (!value) {
    return { valid: false, message: 'Ingresa la hora' }
  }
  return { valid: true, message: '' }
}
