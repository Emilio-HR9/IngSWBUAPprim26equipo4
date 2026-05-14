// Motor de simulacion de datos de salud para relojes inteligentes
// Genera datos correlacionados de frecuencia cardiaca, actividad fisica, sueno y alertas
// Los datos se generan clasificando cada dia y correlacionando todas las metricas

// Genera un numero aleatorio con distribucion gaussiana (normal)
// Usa la transformacion de Box-Muller para convertir valores uniformes a normales
// Recibe: mean (number) - media de la distribucion
// Recibe: stddev (number) - desviacion estandar
// Retorna: number - valor con distribucion normal
function gaussianRandom(mean, stddev) {
  let u = 0
  let v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  const normal = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  return mean + stddev * normal
}

// Genera un numero entero aleatorio entre min y max (inclusive)
// Recibe: min (number), max (number)
// Retorna: number - entero aleatorio
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Genera un numero decimal aleatorio entre min y max
// Recibe: min (number), max (number)
// Retorna: number - decimal aleatorio
function randomFloat(min, max) {
  return Math.random() * (max - min) + min
}

// Limita un valor entre un minimo y un maximo
// Recibe: value (number), min (number), max (number)
// Retorna: number - valor acotado
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

// Clasifica un dia aleatoriamente segun nivel de actividad
// Los pesos determinan la probabilidad de cada tipo de dia
// Retorna: string - "sedentario", "normal", "activo" o "muy_activo"
function classifyDay() {
  const rand = Math.random()
  if (rand < 0.25) return 'sedentario'
  if (rand < 0.65) return 'normal'
  if (rand < 0.90) return 'activo'
  return 'muy_activo'
}

// Rangos de datos por tipo de dia
// Cada tipo define los limites para pasos, calorias, distancia, BPM, HRV y sueno
const DAY_PROFILES = {
  sedentario: {
    pasos: [2000, 4500],
    calorias: [1700, 2100],
    distancia: [1.5, 3.5],
    bpmReposo: [65, 85],
    bpmEjercicio: [100, 130],
    lecturasEjercicio: [0, 2],
    hrv: [25, 45],
    suenoHoras: [5, 7],
    minutosActivos: [10, 45],
  },
  normal: {
    pasos: [5000, 9000],
    calorias: [2100, 2600],
    distancia: [3.5, 7],
    bpmReposo: [60, 78],
    bpmEjercicio: [110, 145],
    lecturasEjercicio: [3, 5],
    hrv: [35, 55],
    suenoHoras: [6, 8],
    minutosActivos: [30, 90],
  },
  activo: {
    pasos: [9000, 14000],
    calorias: [2500, 3000],
    distancia: [7, 11],
    bpmReposo: [55, 72],
    bpmEjercicio: [120, 165],
    lecturasEjercicio: [5, 8],
    hrv: [45, 65],
    suenoHoras: [7, 8.5],
    minutosActivos: [60, 150],
  },
  muy_activo: {
    pasos: [14000, 22000],
    calorias: [2900, 3500],
    distancia: [11, 16],
    bpmReposo: [52, 68],
    bpmEjercicio: [130, 180],
    lecturasEjercicio: [8, 12],
    hrv: [55, 80],
    suenoHoras: [7.5, 9],
    minutosActivos: [120, 240],
  },
}

// Franjas horarias para distribuir lecturas de BPM a lo largo del dia
// Cada franja define el tipo de lectura, rango de BPM base y cantidad de lecturas
const TIME_SLOTS = [
  { startHour: 0, endHour: 6, tipo: 'supieno', bpmRange: [45, 65], readings: [6, 12] },
  { startHour: 6, endHour: 8, tipo: 'reposo', bpmRange: [60, 80], readings: [2, 4] },
  { startHour: 8, endHour: 12, tipo: 'mixed', bpmRange: [60, 85], readings: [4, 8] },
  { startHour: 12, endHour: 14, tipo: 'reposo', bpmRange: [65, 85], readings: [2, 4] },
  { startHour: 14, endHour: 18, tipo: 'mixed', bpmRange: [60, 85], readings: [4, 8] },
  { startHour: 18, endHour: 21, tipo: 'mixed', bpmRange: [60, 80], readings: [3, 6] },
  { startHour: 21, endHour: 24, tipo: 'reposo', bpmRange: [58, 75], readings: [3, 6] },
]

// Genera lecturas de frecuencia cardiaca para un dia completo
// Distribuye las lecturas en franjas horarias y agrega ejercicio segun el tipo de dia
// Recibe: fecha (Date) - dia para generar lecturas
// Recibe: profile (object) - perfil del tipo de dia con rangos de BPM
// Recibe: sleepBpmAdjust (number) - ajuste de BPM por mala noche anterior
// Retorna: array de objetos {bpm, hrv_ms, tipo, registrado_en}
function generateHeartRateReadings(fecha, profile, sleepBpmAdjust = 0) {
  const readings = []
  const year = fecha.getFullYear()
  const month = fecha.getMonth()
  const day = fecha.getDate()

  for (const slot of TIME_SLOTS) {
    const numReadings = randomInt(slot.readings[0], slot.readings[1])

    for (let i = 0; i < numReadings; i++) {
      const hour = randomFloat(slot.startHour, slot.endHour)
      const minutes = Math.floor((hour % 1) * 60)
      const wholeHour = Math.floor(hour)

      const timestamp = new Date(year, month, day, wholeHour, minutes, randomInt(0, 59))

      let isExercise = false
      if (slot.tipo === 'mixed') {
        const exerciseChance = profile.lecturasEjercicio[1] / 40
        isExercise = Math.random() < exerciseChance
      }

      let bpm
      let tipo
      if (slot.tipo === 'supieno') {
        bpm = Math.round(gaussianRandom(
          (slot.bpmRange[0] + slot.bpmRange[1]) / 2,
          4
        ))
        tipo = 'sueño'
      } else if (isExercise) {
        bpm = Math.round(gaussianRandom(
          (profile.bpmEjercicio[0] + profile.bpmEjercicio[1]) / 2,
          10
        ))
        tipo = 'ejercicio'
      } else {
        bpm = Math.round(gaussianRandom(
          (profile.bpmReposo[0] + profile.bpmReposo[1]) / 2 + sleepBpmAdjust,
          5
        ))
        tipo = 'reposo'
      }

      bpm = clamp(bpm, 30, 250)

      // HRV inversamente correlacionado con BPM
      const hrvBase = (profile.hrv[0] + profile.hrv[1]) / 2
      const hrvAdjust = (bpm - 70) * -0.3
      const hrv = clamp(
        parseFloat(gaussianRandom(hrvBase + hrvAdjust, 5).toFixed(1)),
        5, 200
      )

      readings.push({
        bpm,
        hrv_ms: hrv,
        tipo,
        registrado_en: timestamp.toISOString(),
      })
    }
  }

  readings.sort((a, b) => new Date(a.registrado_en) - new Date(b.registrado_en))
  return readings
}

// Genera datos de sueno para una noche
// Calcula hora de dormir, despertar, duracion y desglose por fases
// Recibe: fecha (Date) - dia de referencia (se duerme la noche anterior)
// Recibe: profile (object) - perfil del tipo de dia con rango de horas de sueno
// Retorna: objeto con hora_dormir, hora_despertar, duracion_total_min, fases y calidad
function generateSleepData(fecha, profile) {
  const totalHours = randomFloat(profile.suenoHoras[0], profile.suenoHoras[1])
  const totalMinutes = Math.round(totalHours * 60)

  // Hora de dormir: distribucion normal centrada en 23:00
  const sleepHour = clamp(gaussianRandom(23, 1), 21.5, 25.5)
  const sleepDate = new Date(fecha)
  if (sleepHour >= 24) {
    sleepDate.setDate(sleepDate.getDate())
    sleepDate.setHours(Math.floor(sleepHour - 24), Math.round((sleepHour % 1) * 60), 0, 0)
  } else {
    sleepDate.setDate(sleepDate.getDate() - 1)
    sleepDate.setHours(Math.floor(sleepHour), Math.round((sleepHour % 1) * 60), 0, 0)
  }

  const wakeDate = new Date(sleepDate.getTime() + totalMinutes * 60 * 1000)

  // Fases del sueno con porcentajes realistas
  const deepPercent = randomFloat(0.15, 0.25)
  const remPercent = randomFloat(0.20, 0.30)
  const lightPercent = 1 - deepPercent - remPercent

  const suenoProfundo = Math.round(totalMinutes * deepPercent)
  const suenoRem = Math.round(totalMinutes * remPercent)
  const suenoLigero = totalMinutes - suenoProfundo - suenoRem

  // Calidad correlacionada con duracion y sueno profundo
  const durationScore = clamp((totalHours - 4) / 5 * 60, 0, 60)
  const deepScore = clamp(suenoProfundo / totalMinutes * 160, 0, 40)
  const calidad = clamp(Math.round(durationScore + deepScore + gaussianRandom(0, 5)), 0, 100)

  return {
    fecha: fecha.toISOString().split('T')[0],
    hora_dormir: sleepDate.toISOString(),
    hora_despertar: wakeDate.toISOString(),
    duracion_total_min: totalMinutes,
    sueno_ligero_min: suenoLigero,
    sueno_profundo_min: suenoProfundo,
    sueno_rem_min: suenoRem,
    calidad_score: calidad,
  }
}

// Genera datos de actividad fisica para un dia
// Pasos, calorias (correlacionadas con pasos), distancia y minutos activos
// Recibe: fecha (Date) - dia de referencia
// Recibe: profile (object) - perfil del tipo de dia
// Retorna: objeto con fecha, pasos, calorias_kcal, distancia_km, minutos_activos
function generateActivityData(fecha, profile) {
  const pasos = randomInt(profile.pasos[0], profile.pasos[1])

  // Calorias correlacionadas: base metabolica + actividad
  const caloriasBase = randomFloat(1600, 1900)
  const caloriasActividad = pasos * randomFloat(0.035, 0.045)
  const calorias = parseFloat((caloriasBase + caloriasActividad).toFixed(1))
  const caloriasFinal = clamp(calorias, profile.calorias[0], profile.calorias[1] + 200)

  // Distancia correlacionada con pasos
  const distancia = parseFloat((pasos * randomFloat(0.0006, 0.0008)).toFixed(2))
  const distanciaFinal = clamp(distancia, profile.distancia[0], profile.distancia[1] + 1)

  const minutosActivos = randomInt(profile.minutosActivos[0], profile.minutosActivos[1])

  return {
    fecha: fecha.toISOString().split('T')[0],
    pasos,
    calorias_kcal: parseFloat(caloriasFinal.toFixed(1)),
    distancia_km: parseFloat(distanciaFinal.toFixed(2)),
    minutos_activos: minutosActivos,
  }
}

// Genera alertas de salud basadas en los datos del dia
// Revisa reglas de BPM, HRV, actividad y sueno para crear alertas cuando corresponda
// Recibe: lecturasBPM (array) - lecturas de frecuencia cardiaca del dia
// Recibe: actividad (object) - datos de actividad fisica del dia
// Recibe: sueno (object) - datos de sueno del dia
// Recibe: fecha (Date) - dia de referencia
// Retorna: array de objetos alerta con tipo, mensaje, severidad, valor y timestamp
function generateAlerts(lecturasBPM, actividad, sueno, fecha) {
  const alertas = []
  const fechaStr = fecha.toISOString().split('T')[0]

  // Alertas de BPM alto en reposo (>120)
  const bpmAltoReposo = lecturasBPM.filter(r => r.tipo === 'reposo' && r.bpm > 120)
  if (bpmAltoReposo.length > 0) {
    const peor = bpmAltoReposo.reduce((a, b) => a.bpm > b.bpm ? a : b)
    alertas.push({
      tipo_alerta: 'bpm_alto_reposo',
      mensaje: `Frecuencia cardíaca elevada en reposo: ${peor.bpm} BPM`,
      severidad: 'alta',
      valor_detectado: peor.bpm,
      registrado_en: peor.registrado_en,
    })
  }

  // Alertas de BPM bajo (<45)
  const bpmBajo = lecturasBPM.filter(r => r.bpm < 45)
  if (bpmBajo.length > 0) {
    const peor = bpmBajo.reduce((a, b) => a.bpm < b.bpm ? a : b)
    alertas.push({
      tipo_alerta: 'bpm_bajo',
      mensaje: `Frecuencia cardíaca peligrosamente baja: ${peor.bpm} BPM`,
      severidad: 'alta',
      valor_detectado: peor.bpm,
      registrado_en: peor.registrado_en,
    })
  }

  // Alertas de BPM alto en ejercicio (>180)
  const bpmAltoEjercicio = lecturasBPM.filter(r => r.tipo === 'ejercicio' && r.bpm > 180)
  if (bpmAltoEjercicio.length > 0) {
    const peor = bpmAltoEjercicio.reduce((a, b) => a.bpm > b.bpm ? a : b)
    alertas.push({
      tipo_alerta: 'bpm_alto_ejercicio',
      mensaje: `Frecuencia cardíaca muy alta durante ejercicio: ${peor.bpm} BPM`,
      severidad: 'media',
      valor_detectado: peor.bpm,
      registrado_en: peor.registrado_en,
    })
  }

  // Alertas de HRV bajo (<15 ms)
  const hrvBajo = lecturasBPM.filter(r => r.hrv_ms < 15)
  if (hrvBajo.length > 0) {
    const peor = hrvBajo.reduce((a, b) => a.hrv_ms < b.hrv_ms ? a : b)
    alertas.push({
      tipo_alerta: 'hrv_bajo',
      mensaje: `Variabilidad cardíaca baja: ${peor.hrv_ms} ms`,
      severidad: 'media',
      valor_detectado: peor.hrv_ms,
      registrado_en: peor.registrado_en,
    })
  }

  // Alertas de actividad
  if (actividad.pasos === 0) {
    alertas.push({
      tipo_alerta: 'sin_actividad',
      mensaje: `Sin actividad registrada el ${fechaStr}`,
      severidad: 'media',
      valor_detectado: 0,
      registrado_en: fecha.toISOString(),
    })
  } else if (actividad.pasos < 2000) {
    alertas.push({
      tipo_alerta: 'baja_actividad',
      mensaje: `Actividad muy baja: ${actividad.pasos} pasos el ${fechaStr}`,
      severidad: 'baja',
      valor_detectado: actividad.pasos,
      registrado_en: fecha.toISOString(),
    })
  }

  // Alertas de sueno
  const suenoHoras = sueno.duracion_total_min / 60
  if (suenoHoras < 4) {
    alertas.push({
      tipo_alerta: 'sueno_critico',
      mensaje: `Sueño críticamente bajo: ${suenoHoras.toFixed(1)}h el ${fechaStr}`,
      severidad: 'alta',
      valor_detectado: parseFloat(suenoHoras.toFixed(1)),
      registrado_en: fecha.toISOString(),
    })
  } else if (suenoHoras < 5) {
    alertas.push({
      tipo_alerta: 'sueno_insuficiente',
      mensaje: `Sueño insuficiente: ${suenoHoras.toFixed(1)}h el ${fechaStr}`,
      severidad: 'media',
      valor_detectado: parseFloat(suenoHoras.toFixed(1)),
      registrado_en: fecha.toISOString(),
    })
  }

  if (sueno.sueno_profundo_min < 30) {
    alertas.push({
      tipo_alerta: 'sueno_profundo_bajo',
      mensaje: `Poco sueño profundo: ${sueno.sueno_profundo_min} min el ${fechaStr}`,
      severidad: 'baja',
      valor_detectado: sueno.sueno_profundo_min,
      registrado_en: fecha.toISOString(),
    })
  }

  return alertas
}

// Genera todos los datos de un dia completo (BPM, actividad, sueno, alertas)
// Correlaciona los datos entre si: tipo de dia determina rangos de todas las metricas
// Recibe: fecha (Date) - dia a generar
// Recibe: previousSleepHours (number|null) - horas de sueno de la noche anterior para correlacion
// Retorna: objeto con {tipoDia, actividad, lecturasBPM, sueno, alertas}
export function generateDayData(fecha, previousSleepHours = null) {
  const tipoDia = classifyDay()
  const profile = DAY_PROFILES[tipoDia]

  // Si durmio poco la noche anterior, BPM en reposo sube 3-8 puntos
  let sleepBpmAdjust = 0
  if (previousSleepHours !== null && previousSleepHours < 6) {
    sleepBpmAdjust = randomInt(3, 8)
  }

  const actividad = generateActivityData(fecha, profile)
  const lecturasBPM = generateHeartRateReadings(fecha, profile, sleepBpmAdjust)
  const sueno = generateSleepData(fecha, profile)
  const alertas = generateAlerts(lecturasBPM, actividad, sueno, fecha)

  return {
    tipoDia,
    actividad,
    lecturasBPM,
    sueno,
    alertas,
  }
}

// Genera datos historicos para un rango de dias (por defecto 30 dias)
// Genera secuencialmente para mantener la correlacion entre dias consecutivos
// Recibe: days (number) - cantidad de dias a generar (default 30)
// Retorna: objeto con arrays de {actividades, lecturasBPM, suenos, alertas}
export function generateHistoricalData(days = 30) {
  const actividades = []
  const lecturasBPM = []
  const suenos = []
  const alertas = []

  let previousSleepHours = null

  for (let i = days - 1; i >= 0; i--) {
    const fecha = new Date()
    fecha.setDate(fecha.getDate() - i)
    fecha.setHours(0, 0, 0, 0)

    const dayData = generateDayData(fecha, previousSleepHours)

    actividades.push(dayData.actividad)
    lecturasBPM.push(...dayData.lecturasBPM)
    suenos.push(dayData.sueno)
    alertas.push(...dayData.alertas)

    previousSleepHours = dayData.sueno.duracion_total_min / 60
  }

  return { actividades, lecturasBPM, suenos, alertas }
}

// Genera una lectura de sensor (acelerometro o giroscopio) segun estado de actividad
// Recibe: estado (string) - "reposo", "caminando" o "corriendo"
// Retorna: objeto con {acelerometro: {x,y,z}, giroscopio: {x,y,z}}
export function generateSensorReading(estado = 'reposo') {
  const ranges = {
    reposo: {
      accel: { x: [-0.5, 0.5], y: [9.3, 10.3], z: [-0.3, 0.3] },
      gyro: { x: [-5, 5], y: [-5, 5], z: [-5, 5] },
    },
    caminando: {
      accel: { x: [-3, 3], y: [7, 12], z: [-2, 2] },
      gyro: { x: [-30, 30], y: [-30, 30], z: [-30, 30] },
    },
    corriendo: {
      accel: { x: [-8, 8], y: [4, 16], z: [-6, 6] },
      gyro: { x: [-80, 80], y: [-80, 80], z: [-80, 80] },
    },
  }

  const r = ranges[estado] || ranges.reposo

  return {
    acelerometro: {
      x: parseFloat(gaussianRandom((r.accel.x[0] + r.accel.x[1]) / 2, (r.accel.x[1] - r.accel.x[0]) / 4).toFixed(4)),
      y: parseFloat(gaussianRandom((r.accel.y[0] + r.accel.y[1]) / 2, (r.accel.y[1] - r.accel.y[0]) / 4).toFixed(4)),
      z: parseFloat(gaussianRandom((r.accel.z[0] + r.accel.z[1]) / 2, (r.accel.z[1] - r.accel.z[0]) / 4).toFixed(4)),
    },
    giroscopio: {
      x: parseFloat(gaussianRandom((r.gyro.x[0] + r.gyro.x[1]) / 2, (r.gyro.x[1] - r.gyro.x[0]) / 4).toFixed(2)),
      y: parseFloat(gaussianRandom((r.gyro.y[0] + r.gyro.y[1]) / 2, (r.gyro.y[1] - r.gyro.y[0]) / 4).toFixed(2)),
      z: parseFloat(gaussianRandom((r.gyro.z[0] + r.gyro.z[1]) / 2, (r.gyro.z[1] - r.gyro.z[0]) / 4).toFixed(2)),
    },
  }
}
