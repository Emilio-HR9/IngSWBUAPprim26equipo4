// Servicio mock para sensores en memoria
let mockSensors = [];

export async function insertSensorSnapshot(deviceId, data) {
  const record = {
    id: `sensor-${Date.now()}`,
    dispositivo_id: deviceId,
    tipo_sensor: data.tipo_sensor,
    eje_x: data.eje_x,
    eje_y: data.eje_y,
    eje_z: data.eje_z,
    estado_actividad: data.estado_actividad,
    registrado_en: new Date().toISOString(),
  };
  mockSensors.push(record);
  return record;
}
