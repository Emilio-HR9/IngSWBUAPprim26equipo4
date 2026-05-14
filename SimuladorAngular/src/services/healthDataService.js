// Servicio mock para datos de salud en memoria
let db = {
  frecuencia_cardiaca: [],
  actividad_fisica: [],
  sueno: []
};

// =============================================
// FRECUENCIA CARDIACA
// =============================================

export async function insertHeartRateData(deviceId, records) {
  const newRecords = records.map((r, i) => ({
    id: `hr-${Date.now()}-${i}`,
    dispositivo_id: deviceId,
    bpm: r.bpm,
    hrv_ms: r.hrv_ms,
    tipo: r.tipo,
    registrado_en: r.registrado_en,
  }));
  db.frecuencia_cardiaca.push(...newRecords);
  return true;
}

export async function getHeartRateData(deviceId, startDate, endDate) {
  let filtered = db.frecuencia_cardiaca.filter(r => r.dispositivo_id === deviceId);
  if (startDate) filtered = filtered.filter(r => r.registrado_en >= startDate);
  if (endDate) filtered = filtered.filter(r => r.registrado_en <= endDate);
  return filtered.sort((a, b) => new Date(b.registrado_en) - new Date(a.registrado_en));
}

export async function insertManualHeartRate(deviceId, record) {
  const r = {
    id: `hr-manual-${Date.now()}`,
    dispositivo_id: deviceId,
    bpm: record.bpm,
    hrv_ms: record.hrv_ms || null,
    tipo: record.tipo,
    registrado_en: record.registrado_en,
  };
  db.frecuencia_cardiaca.push(r);
  return r;
}

// =============================================
// ACTIVIDAD FISICA
// =============================================

export async function insertActivityData(deviceId, records) {
  const newRecords = records.map((r, i) => ({
    id: `act-${Date.now()}-${i}`,
    dispositivo_id: deviceId,
    fecha: r.fecha,
    pasos: r.pasos,
    calorias_kcal: r.calorias_kcal,
    distancia_km: r.distancia_km,
    minutos_activos: r.minutos_activos || 0,
  }));
  db.actividad_fisica.push(...newRecords);
  return true;
}

export async function getActivityData(deviceId, startDate, endDate) {
  let filtered = db.actividad_fisica.filter(r => r.dispositivo_id === deviceId);
  if (startDate) filtered = filtered.filter(r => r.fecha >= startDate);
  if (endDate) filtered = filtered.filter(r => r.fecha <= endDate);
  return filtered.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

export async function insertManualActivity(deviceId, record) {
  const r = {
    id: `act-manual-${Date.now()}`,
    dispositivo_id: deviceId,
    fecha: record.fecha,
    pasos: record.pasos,
    calorias_kcal: record.calorias_kcal,
    distancia_km: record.distancia_km,
    minutos_activos: record.minutos_activos || 0,
  };
  db.actividad_fisica.push(r);
  return r;
}

// =============================================
// SUENO
// =============================================

export async function insertSleepData(deviceId, records) {
  const newRecords = records.map((r, i) => ({
    id: `sleep-${Date.now()}-${i}`,
    dispositivo_id: deviceId,
    fecha: r.fecha,
    hora_dormir: r.hora_dormir,
    hora_despertar: r.hora_despertar,
    duracion_total_min: r.duracion_total_min,
    sueno_ligero_min: r.sueno_ligero_min,
    sueno_profundo_min: r.sueno_profundo_min,
    sueno_rem_min: r.sueno_rem_min,
    calidad_score: r.calidad_score,
  }));
  db.sueno.push(...newRecords);
  return true;
}

export async function getSleepData(deviceId, startDate, endDate) {
  let filtered = db.sueno.filter(r => r.dispositivo_id === deviceId);
  if (startDate) filtered = filtered.filter(r => r.fecha >= startDate);
  if (endDate) filtered = filtered.filter(r => r.fecha <= endDate);
  return filtered.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

export async function insertManualSleep(deviceId, record) {
  const r = {
    id: `sleep-manual-${Date.now()}`,
    dispositivo_id: deviceId,
    fecha: record.fecha,
    hora_dormir: record.hora_dormir,
    hora_despertar: record.hora_despertar,
    duracion_total_min: record.duracion_total_min,
    sueno_ligero_min: record.sueno_ligero_min,
    sueno_profundo_min: record.sueno_profundo_min,
    sueno_rem_min: record.sueno_rem_min,
    calidad_score: record.calidad_score || null,
  };
  db.sueno.push(r);
  return r;
}

// =============================================
// METRICAS CONSOLIDADAS
// =============================================

export async function getLatestMetrics(deviceId) {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const bpmSorted = db.frecuencia_cardiaca
    .filter(r => r.dispositivo_id === deviceId)
    .sort((a, b) => new Date(b.registrado_en) - new Date(a.registrado_en));
  const latestBPM = bpmSorted.length > 0 ? bpmSorted[0] : null;

  const activityToday = db.actividad_fisica.find(r => r.dispositivo_id === deviceId && r.fecha === today) || null;

  const sleepSorted = db.sueno
    .filter(r => r.dispositivo_id === deviceId && (r.fecha === today || r.fecha === yesterday))
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const sleepAnoche = sleepSorted.length > 0 ? sleepSorted[0] : null;

  return {
    ultimoBPM: latestBPM,
    actividadHoy: activityToday,
    suenoAnoche: sleepAnoche,
  };
}

export async function getRecentData(deviceId, days = 14) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startStr = startDate.toISOString().split('T')[0];

  const actResult = db.actividad_fisica
    .filter(r => r.dispositivo_id === deviceId && r.fecha >= startStr)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  const bpmResult = db.frecuencia_cardiaca
    .filter(r => r.dispositivo_id === deviceId && r.registrado_en >= startDate.toISOString())
    .sort((a, b) => new Date(a.registrado_en) - new Date(b.registrado_en));

  const sleepResult = db.sueno
    .filter(r => r.dispositivo_id === deviceId && r.fecha >= startStr)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  return {
    actividades: actResult,
    lecturasBPM: bpmResult,
    suenos: sleepResult,
  };
}

export async function getAllDataForTable(deviceId, filters = {}) {
  const results = [];

  if (!filters.tipo || filters.tipo === 'bpm' || filters.tipo === 'hrv') {
    let bpmData = db.frecuencia_cardiaca.filter(r => r.dispositivo_id === deviceId);
    if (filters.startDate) bpmData = bpmData.filter(r => r.registrado_en >= filters.startDate);
    if (filters.endDate) bpmData = bpmData.filter(r => r.registrado_en <= filters.endDate + 'T23:59:59');

    bpmData.forEach(r => {
      if (!filters.tipo || filters.tipo === 'bpm') {
        results.push({ fecha: r.registrado_en, tipo: 'BPM', valor: r.bpm, unidad: 'BPM', contexto: r.tipo });
      }
      if ((!filters.tipo || filters.tipo === 'hrv') && r.hrv_ms) {
        results.push({ fecha: r.registrado_en, tipo: 'HRV', valor: r.hrv_ms, unidad: 'ms', contexto: r.tipo });
      }
    });
  }

  if (!filters.tipo || ['pasos', 'calorias', 'distancia'].includes(filters.tipo)) {
    let actData = db.actividad_fisica.filter(r => r.dispositivo_id === deviceId);
    if (filters.startDate) actData = actData.filter(r => r.fecha >= filters.startDate);
    if (filters.endDate) actData = actData.filter(r => r.fecha <= filters.endDate);

    actData.forEach(r => {
      const fechaISO = r.fecha + 'T12:00:00';
      if (!filters.tipo || filters.tipo === 'pasos') {
        results.push({ fecha: fechaISO, tipo: 'Pasos', valor: r.pasos, unidad: 'pasos', contexto: '' });
      }
      if (!filters.tipo || filters.tipo === 'calorias') {
        results.push({ fecha: fechaISO, tipo: 'Calorías', valor: r.calorias_kcal, unidad: 'kcal', contexto: '' });
      }
      if (!filters.tipo || filters.tipo === 'distancia') {
        results.push({ fecha: fechaISO, tipo: 'Distancia', valor: r.distancia_km, unidad: 'km', contexto: '' });
      }
    });
  }

  if (!filters.tipo || filters.tipo === 'sueno') {
    let sleepData = db.sueno.filter(r => r.dispositivo_id === deviceId);
    if (filters.startDate) sleepData = sleepData.filter(r => r.fecha >= filters.startDate);
    if (filters.endDate) sleepData = sleepData.filter(r => r.fecha <= filters.endDate);

    sleepData.forEach(r => {
      results.push({
        fecha: r.hora_dormir,
        tipo: 'Sueño',
        valor: r.duracion_total_min,
        unidad: 'min',
        contexto: `Calidad: ${r.calidad_score}%`,
      });
    });
  }

  results.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  return results;
}
